#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const API_KEY = process.env.SOCIALAPIS_API_KEY || process.argv[2];
const MCP_PROXY_URL = process.env.MCP_PROXY_URL || 'https://mcp.socialapis.io';

if (!API_KEY) {
  console.error('Error: SOCIALAPIS_API_KEY environment variable or API key argument required');
  console.error('Usage: socialapis-mcp <api-key>');
  process.exit(1);
}

const server = new Server(
  {
    name: 'socialapis-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Fetch tools from server
async function getTools() {
  try {
    const response = await fetch(`${MCP_PROXY_URL}/tools`);
    const data = await response.json();
    return data.tools;
  } catch (error) {
    console.error('Failed to fetch tools:', error);
    return [];
  }
}

let cachedTools = null;

server.setRequestHandler(ListToolsRequestSchema, async () => {
  if (!cachedTools) {
    cachedTools = await getTools();
  }
  return { tools: cachedTools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const response = await fetch(`${MCP_PROXY_URL}/proxy`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: name,
        arguments: args,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result.data, null, 2),
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result.data || result, null, 2),
          },
        ],
        isError: true,
      };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error.message,
            tool: name,
          }),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('✅ SocialAPIs MCP Client running');
  console.error(`🔑 Using API key: ${API_KEY.substring(0, 8)}...`);
  console.error(`🌐 Proxy URL: ${MCP_PROXY_URL}`);
}

main().catch((error) => {
  console.error('❌ Server error:', error);
  process.exit(1);
});