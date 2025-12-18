import express from 'express';
import cors from 'cors';
import { tools } from './src/tools.js';

const app = express();
const PORT = process.env.PORT || 3001;
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.socialapis.io/v1';

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'socialapis-mcp-server',
    version: '1.0.0',
    tools: tools.length
  });
});

// List available tools
app.get('/tools', (req, res) => {
  res.json({
    tools: tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  });
});

// MCP Proxy endpoint
app.post('/proxy', async (req, res) => {
  try {
    const { tool, arguments: args } = req.body;
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ 
        error: 'Missing x-api-key header',
        message: 'Please provide your SocialAPIs API key in the x-api-key header'
      });
    }

    const toolDef = tools.find(t => t.name === tool);
    if (!toolDef) {
      return res.status(404).json({ 
        error: `Tool not found: ${tool}`,
        available_tools: tools.map(t => t.name)
      });
    }

    const url = new URL(toolDef.endpoint, API_BASE_URL);

    if (toolDef.method === 'GET' && args) {
      Object.entries(args).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    console.log(`📡 [${toolDef.method}] ${url.toString()}`);

    // Forward to backend API with x-api-token header
    const response = await fetch(url.toString(), {
      method: toolDef.method,
      headers: {
        'x-api-token': apiKey,
        'Content-Type': 'application/json',
      },
      body: toolDef.method === 'POST' ? JSON.stringify(args) : undefined,
    });

    const data = await response.json();

    res.status(response.status).json({
      success: response.ok,
      data,
    });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ MCP Proxy Server running on port ${PORT}`);
  console.log(`📡 Proxy endpoint: http://localhost:${PORT}/proxy`);
  console.log(`🛠️  Available tools: http://localhost:${PORT}/tools`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});