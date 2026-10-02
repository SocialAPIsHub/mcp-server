# Installing the SocialAPIs MCP server (for AI agents)

This file tells an AI agent (Cline, Claude Code, Cursor, etc.) exactly how to install and verify this server. Follow the steps in order.

## What this server does

Gives the agent 47 read-only tools for public Facebook and Instagram data: pages, posts, comments, groups, the Ads Library, Marketplace, profiles, reels and locations. Every tool calls the SocialAPIs REST API and costs credits (1 credit per call for most tools; each tool description states its price).

## Prerequisites

1. **Node.js 18 or newer** (`node --version`). Needed only for the local install.
2. **A SocialAPIs API key.** Ask the user for it. If they don't have one, tell them to sign up at https://socialapis.io and copy the key from https://socialapis.io/dashboard (the free tier includes 200 calls per month, no credit card). Never invent or guess a key.

## Option A — Local install (recommended)

No clone or build step is needed; the package runs with `npx`.

Add this to the MCP settings file (for Cline: `cline_mcp_settings.json`), replacing `YOUR_API_KEY` with the user's key:

```json
{
  "mcpServers": {
    "socialapis": {
      "command": "npx",
      "args": ["-y", "@socialapis/mcp"],
      "env": {
        "SOCIALAPIS_API_KEY": "YOUR_API_KEY"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

If the settings file already has an `mcpServers` object, add the `socialapis` entry to it — don't replace the other servers.

## Option B — Hosted endpoint (no Node.js needed)

For clients that support remote MCP servers over Streamable HTTP:

```json
{
  "mcpServers": {
    "socialapis": {
      "type": "streamableHttp",
      "url": "https://mcp.socialapis.io/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

`x-api-token: YOUR_API_KEY` works as an alternative header.

## Verify the install

1. Confirm the server shows 47 tools (names start with `facebook_` or `instagram_`).
2. Call `facebook_get_page_id` with `{"link": "https://www.facebook.com/nike"}`.
3. Expected: a JSON result containing a `facebook_id` field and a `meta` block with `creditsCharged` and `creditsRemaining`. This call costs 1 credit.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `SOCIALAPIS_API_KEY environment variable or API key argument required` | Key missing in the local config | Add `SOCIALAPIS_API_KEY` under `env` |
| `Missing SocialAPIs API key` (hosted) | Header not sent | Add the `Authorization: Bearer <key>` header |
| HTTP 401 / 403 in the result | Key invalid, or account paused | Ask the user to re-copy the key from the dashboard |
| `Insufficient credits` | Out of credits | User can upgrade or top up at https://socialapis.io/pricing |
| Server lists 0 tools | No network access to `mcp.socialapis.io` | Check the machine can reach https://mcp.socialapis.io/health |
