# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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