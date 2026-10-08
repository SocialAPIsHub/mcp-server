# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2026-10-08

### Changed
- **Per-action inputs are spelled out.** Grouped tools share one input list, so it wasn't clear which parameters each action takes. Each action in a tool description now lists all its inputs, marked required or optional (e.g. `action=comments: … Inputs: link (required), limit (optional), end_cursor (optional), include_reply_info (optional).`). Each parameter description now names the actions that use it and whether it's required for each (e.g. `link: details, id (required): Facebook post URL.`).

No tools, actions or schemas changed. Only description text.

## [2.0.0] - 2026-10-06

### Changed
- **47 tools grouped into 12.** Each tool covers one resource (`facebook_page`, `facebook_post`, `facebook_ads`, `instagram_profile`, …) and takes an `action` argument (`details`, `posts`, `search`, …). Every action from 1.x is still there, with the same parameters, endpoints and prices. Fewer tools fit under client tool limits (Cursor caps the total across servers) and are easier for agents to choose between.
- A missing `action` or required parameter now returns a clear error before any credit is spent.
- `/health` reports `tools` (12) and `actions` (47).

### Compatibility
- The 47 1.x tool names still work when called directly (hosted `/mcp`, `/proxy` and the npm client), so existing prompts and scripts keep running. They are no longer listed.
- npm clients 1.2.x pick up the grouped tools automatically. 1.1.0 and older keep the old per-endpoint list from `GET /tools`.
- **Breaking** for configs that auto-approve or allow-list tools by name: add the new tool names.

## [1.2.1] - 2026-10-06

### Changed
- **Clearer tool descriptions** for all 47 tools. Each one now says what it returns, when to use it instead of a similar tool, and where its IDs come from. For example, `facebook_ads_keywords` finds advertisers for a keyword, while `facebook_ads_search` returns the ads; post details vs. extended details; general Marketplace search vs. the vehicle and rental searches. Every description now states its price.
- **Clearer parameter descriptions** for 33 parameters: Marketplace location and price filters, search queries, and IDs that come from another tool.

No tools were added, removed or renamed, and no input schemas changed. Existing configs and auto-approve lists keep working.

## [1.2.0] - 2026-10-02

### Added
- **Tool annotations** on all 47 tools: `readOnlyHint: true`, `destructiveHint: false`, `openWorldHint: true` — every tool only reads public data, so clients can skip confirmation prompts.
- **Human-readable titles** for every tool (e.g. "Facebook: Get Page Details").
- **Structured output.** Every tool declares an `outputSchema` and returns `structuredContent` on success: `{ result, creditsCharged, creditsRemaining }`. `result` is the REST response unchanged; the credit fields are lifted out of its `meta` block so agents can track spend without parsing each endpoint's shape. The JSON text content is still returned for clients that ignore structured output.
- **Server identity** in the MCP handshake: title, description, website and icon. Icon and title also added to `server.json`.

### Compatibility
- `GET /tools` keeps its previous shape (name, description, inputSchema). npm client 1.1.0 and older read it and don't return structured output, which clients require once a tool declares `outputSchema`. Client 1.2.0 requests `GET /tools?format=full`. Upgrading is optional.

## [1.1.0] - 2026-10-02

### Added
- **Hosted remote MCP endpoint** at `https://mcp.socialapis.io/mcp` (Streamable HTTP, stateless, JSON responses). Clients that support remote MCP servers can connect with a URL — no local install.
- Authentication via `Authorization: Bearer <key>` or `x-api-token: <key>`. `tools/list` works without a key so directories and clients can show the tool catalog; `tools/call` returns a clear error until a key is supplied.
- `remotes` entry in `server.json` for the official MCP Registry.

### Changed
- Upgraded `@modelcontextprotocol/sdk` from 0.5 to 1.31. The npm stdio client (`npx @socialapis/mcp`) is unchanged for users.
- Backend calls now time out after 90s instead of hanging indefinitely.
- Descriptions (README, `package.json`, `server.json`) now state exactly what is live: Facebook and Instagram. Removed TikTok and "multiple platforms" claims.
- `facebook_get_page_details` no longer mentions page likes — Facebook stopped exposing public page like counts.

### Security
- `.dockerignore` now excludes MCP registry publisher token files so they can never be baked into an image.

## [1.0.0] - 2025-01-17

### Added
- Initial release of SocialAPIs MCP Server
- Support for 12 Facebook API tools
- MCP client (mcp-wrapper.js) for local execution
- HTTP proxy server for production deployment
- npm package published as @socialapis/mcp
- Comprehensive documentation and examples
- Support for Claude Desktop, Cursor, and VSCode

### Tools Included
- Facebook page tools (ID, details, posts, reels)
- Facebook group tools (ID, details, posts)
- Facebook post tools (ID, details, attachments, comments)
- Facebook video tools (details)

### Infrastructure
- Global edge network for low latency
- Automatic rate limiting
- Smart caching
- 99.9% uptime SLA

## [Unreleased]

### Planned
- TikTok support
- YouTube support
- Twitter/X support
- Real-time webhooks
- Advanced analytics
- Python SDK
- LangChain integration