import express from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { tools } from './src/tools.js';
import { SERVER_IDENTITY, enrichTool, buildStructuredResult } from './src/toolMeta.js';

const app = express();
const PORT = process.env.PORT || 3001;
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.socialapis.io';
const SERVER_VERSION = '1.2.1';

// Upstream scraping calls can take up to ~85s (api-scraping axios timeout).
// Give the backend fetch a little more so we return the API's own error
// instead of an opaque abort.
const BACKEND_TIMEOUT_MS = 90_000;

app.use(cors({
  // Browser-based MCP clients (e.g. the MCP Inspector) need these exposed
  // and allowed. Mcp-Session-Id is unused in stateless mode but harmless.
  exposedHeaders: ['Mcp-Session-Id'],
  allowedHeaders: [
    'Content-Type', 'Accept', 'Authorization', 'x-api-key', 'x-api-token',
    'Mcp-Session-Id', 'Mcp-Protocol-Version', 'Last-Event-ID',
  ],
}));
app.use(express.json({ limit: '1mb' }));

// Legacy shape for GET /tools. npm client 1.1.0 and older build their tool
// list from this endpoint but never return structuredContent, and MCP
// clients reject tools that declare an outputSchema without it — so this
// shape must not gain outputSchema. Newer clients request ?format=full.
const publicTools = tools.map((tool) => ({
  name: tool.name,
  description: tool.description,
  inputSchema: tool.inputSchema,
}));

// Full definitions (title, annotations, outputSchema) for the hosted /mcp
// endpoint and npm client >= 1.2.0.
const fullTools = tools.map(enrichTool);

/**
 * Call the SocialAPIs REST backend for one tool invocation.
 * Shared by the legacy /proxy route (used by the npm stdio client) and the
 * hosted /mcp endpoint, so both paths hit the API identically.
 *
 * @returns {{ status: number, ok: boolean, data: any }}
 */
async function callBackend(toolName, args, apiKey) {
  const toolDef = tools.find((t) => t.name === toolName);
  if (!toolDef) {
    return {
      status: 404,
      ok: false,
      data: { error: `Tool not found: ${toolName}`, available_tools: tools.map((t) => t.name) },
    };
  }

  const url = new URL(toolDef.endpoint, API_BASE_URL);
  if (toolDef.method === 'GET' && args) {
    for (const [key, value] of Object.entries(args)) {
      if (value !== undefined && value !== null) url.searchParams.append(key, String(value));
    }
  }

  console.log(`📡 [${toolDef.method}] ${url.pathname}`);

  const response = await fetch(url.toString(), {
    method: toolDef.method,
    headers: { 'x-api-token': apiKey, 'Content-Type': 'application/json' },
    body: toolDef.method === 'POST' ? JSON.stringify(args ?? {}) : undefined,
    signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { error: `Backend returned non-JSON response (HTTP ${response.status})` };
  }
  return { status: response.status, ok: response.ok, data };
}

/**
 * Pull the caller's SocialAPIs key from the request. Accepts the same
 * header as the REST API (x-api-token), the legacy proxy header
 * (x-api-key), or a standard bearer token — remote MCP clients differ in
 * which of these they let users configure.
 */
function extractApiKey(req) {
  const auth = req.headers.authorization;
  if (auth && /^Bearer\s+/i.test(auth)) return auth.replace(/^Bearer\s+/i, '').trim();
  return req.headers['x-api-token'] || req.headers['x-api-key'] || null;
}

/** Build a fresh MCP server bound to one caller's API key. */
function createMcpServer(apiKey) {
  const server = new Server(
    { ...SERVER_IDENTITY, version: SERVER_VERSION },
    { capabilities: { tools: {} } },
  );

  // Tool discovery is public (same data as GET /tools) so directories and
  // clients can list tools before the user has entered a key.
  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: fullTools }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (!apiKey) {
      return {
        isError: true,
        content: [{
          type: 'text',
          text: 'Missing SocialAPIs API key. Send it as "Authorization: Bearer <key>" '
            + '(or the "x-api-token" header). Get a free key at https://socialapis.io/dashboard',
        }],
      };
    }

    try {
      const { ok, data } = await callBackend(name, args, apiKey);
      // Text content stays for clients that ignore structured output.
      // structuredContent only on success: errors carry isError and are
      // exempt from outputSchema validation.
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        ...(ok ? { structuredContent: buildStructuredResult(data) } : { isError: true }),
      };
    } catch (error) {
      return {
        isError: true,
        content: [{ type: 'text', text: JSON.stringify({ error: error.message, tool: name }) }],
      };
    }
  });

  return server;
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'socialapis-mcp-server',
    version: SERVER_VERSION,
    tools: tools.length,
  });
});

// List available tools (used by the npm stdio client)
app.get('/tools', (req, res) => {
  res.json({ tools: req.query.format === 'full' ? fullTools : publicTools });
});

// Legacy proxy endpoint used by the npm stdio client (mcp-wrapper.js)
app.post('/proxy', async (req, res) => {
  try {
    const { tool, arguments: args } = req.body;
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({
        error: 'Missing x-api-key header',
        message: 'Please provide your SocialAPIs API key in the x-api-key header',
      });
    }

    const { status, ok, data } = await callBackend(tool, args, apiKey);
    res.status(status).json({ success: ok, data });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Hosted MCP endpoint (Streamable HTTP, stateless). A fresh server and
// transport per request: no session state to share across PM2/containers,
// and each request carries its own API key.
app.post('/mcp', async (req, res) => {
  const server = createMcpServer(extractApiKey(req));
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    // Plain JSON responses instead of SSE — simpler behind nginx/Cloudflare
    // and enough for request/response tool calls.
    enableJsonResponse: true,
  });

  res.on('close', () => {
    transport.close().catch(() => {});
    server.close().catch(() => {});
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('❌ MCP error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      });
    }
  }
});

// Stateless mode: no server-initiated streams or sessions to delete.
const methodNotAllowed = (req, res) => {
  res.status(405).set('Allow', 'POST').json({
    jsonrpc: '2.0',
    error: { code: -32000, message: 'Method not allowed. Use POST.' },
    id: null,
  });
};
app.get('/mcp', methodNotAllowed);
app.delete('/mcp', methodNotAllowed);

app.listen(PORT, () => {
  console.log(`✅ MCP server running on port ${PORT}`);
  console.log(`🔌 Hosted MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`📡 Legacy proxy endpoint: http://localhost:${PORT}/proxy`);
  console.log(`🛠️  Available tools: http://localhost:${PORT}/tools`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});
