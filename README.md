# SocialAPIs MCP Server

<div align="center">

![SocialAPIs Logo](https://socialapis.io/logo.png)

**Facebook & Instagram data for AI agents — local (npx) or hosted (remote MCP)**

[![npm version](https://badge.fury.io/js/%40socialapis%2Fmcp.svg)](https://www.npmjs.com/package/@socialapis/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/SocialAPIsHub/mcp-server.svg)](https://github.com/SocialAPIsHub/mcp-server/stargazers)

[Website](https://socialapis.io) • [Documentation](https://docs.socialapis.io) • [Discord](https://discord.gg/D5bQskrwV) • [npm](https://www.npmjs.com/package/@socialapis/mcp)

[![Install in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=socialapis&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBzb2NpYWxhcGlzL21jcCJdLCJlbnYiOnsiU09DSUFMQVBJU19BUElfS0VZIjoiWU9VUl9BUElfS0VZIn19)

**Official SDKs:** [Python](https://pypi.org/project/socialapis-sdk/) • [JavaScript / TypeScript](https://www.npmjs.com/package/socialapis-sdk) • [Go](https://github.com/SocialAPIsHub/socialapis-go)

</div>

---

## 🚀 Quick Start

> **AI agents (Cline, Claude Code, Cursor):** follow [`llms-install.md`](llms-install.md) for step-by-step install and verification.

**One-click:** use the **Install in Cursor** button above — then replace `YOUR_API_KEY` in Cursor's MCP settings with your key. Also listed on [Smithery](https://smithery.ai), [cursor.directory](https://cursor.directory/plugins/socialapis-facebook-instagram-data), [mcp.so](https://mcp.so/servers/socialapis-facebook-instagram-data) and the [official MCP Registry](https://registry.modelcontextprotocol.io) (`io.github.SocialAPIsHub/social-media-api`).

### Option A — Hosted (remote MCP, no install)

Point any client that supports remote MCP servers (Streamable HTTP) at:

```
https://mcp.socialapis.io/mcp
```

Authenticate with your SocialAPIs API key in a header:

```
Authorization: Bearer YOUR_API_KEY
```

(`x-api-token: YOUR_API_KEY` also works.) Tool listing works without a key; tool calls need one. Example config for clients that take a URL + headers:

```json
{
  "mcpServers": {
    "socialapis": {
      "url": "https://mcp.socialapis.io/mcp",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    }
  }
}
```

### Option B — Local (npx, stdio)

### Installation
```bash
npm install -g @socialapis/mcp
```

### Configuration

Add to your Claude Desktop config:

**macOS:**
```bash
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```powershell
notepad %APPDATA%\Claude\claude_desktop_config.json
```

## 🔧 Configuration

### Method 1: Command Line Argument (Recommended for Claude Desktop)
```json
{
  "mcpServers": {
    "socialapis": {
      "command": "npx",
      "args": ["-y", "@socialapis/mcp", "YOUR_API_KEY"]
    }
  }
}
```

### Method 2: Environment Variable
```bash
# Set environment variable
export SOCIALAPIS_API_KEY=your_api_key_here

# Run without argument
npx @socialapis/mcp
```

### Method 3: .env File (For Development)
```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

**.env file:**
```properties
SOCIALAPIS_API_KEY=your_api_key_here
MCP_PROXY_URL=https://mcp.socialapis.io
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SOCIALAPIS_API_KEY` | Your SocialAPIs API key | None (required) |
| `MCP_PROXY_URL` | MCP proxy server URL | `https://mcp.socialapis.io` |
| `PORT` | HTTP server port | `3001` |
| `API_BASE_URL` | Backend API URL | `https://api.socialapis.io` |

### Get API Key

1. Sign up at [socialapis.io](https://socialapis.io)
2. Go to [Dashboard](https://socialapis.io/dashboard)
3. Copy your API key
4. Replace `YOUR_API_KEY` in config

### Test It

Restart Claude Desktop and ask:
```
Get Nike's Facebook page details
```

---

## 📋 Features

- 🌐 **One API key** - Facebook and Instagram behind a single interface
- 🤖 **AI-First** - Built for Claude, Cursor, and AI agents
- 📊 **Rich Data** - Posts, comments, engagement metrics
- 🔍 **Advanced Filtering** - Time ranges, pagination
- 🎯 **Simple Auth** - No OAuth complexity
- 🧩 **Structured output** - every tool declares an output schema and returns `{ result, creditsCharged, creditsRemaining }`, so agents can track credit spend directly
- 🛡️ **Read-only annotations** - all tools are marked `readOnlyHint`, so clients can skip confirmation prompts
- ⚡ **Fast** - Global edge network
- 🔒 **Secure** - API keys stay local

---

## 🛠️ Available Tools

12 tools covering 47 actions across Facebook and Instagram. Each tool groups one resource and takes an `action` argument; every action maps to one REST endpoint on `api.socialapis.io`. Tool descriptions list each action, the parameters it needs and its credit cost.

| Tool | Actions |
|---|---|
| `facebook_page` | `details` (followers, contact info, category; `exact_followers_count=true` costs 5 credits), `id`, `posts` (`limit` 3-9, date filters), `videos` (`limit` 6-12), `reels` |
| `facebook_group` | `details`, `id`, `posts` (`limit` 3-9, date filters), `videos` |
| `facebook_post` | `details`, `details_extended` (view counts, video URLs, audio metadata), `id`, `attachments` (5 credits), `video`, `comments`, `comment_replies` |
| `facebook_search` | `pages`, `people`, `posts`, `videos`, `locations` (location UIDs for the other searches) |
| `facebook_ads` | `search` (ads by keyword, page, country, status), `keywords` (advertisers for a keyword), `page_details`, `archive_details`, `countries` |
| `facebook_marketplace` | `search` (price, location, category, condition filters), `vehicles`, `rentals`, `listing`, `seller`, `categories`, `city_coordinates` |
| `facebook_media_download` | Download URLs for Facebook images and videos |
| `instagram_profile` | `details`, `id`, `posts`, `reels`, `highlights`, `highlight_details` |
| `instagram_post` | `details`, `id` (shortcode from a post URL) |
| `instagram_reels` | `feed`, `by_audio` |
| `instagram_search` | Popular users, hashtags and places for a keyword |
| `instagram_location` | `posts` (recent or top), `nearby` |

Example call: `facebook_page` with `{"action": "posts", "link": "https://www.facebook.com/nike", "limit": 9}`.

**Upgrading from 1.x:** the 47 earlier tool names (`facebook_get_page_details`, `instagram_get_profile_posts`, …) still work when called directly, so existing prompts and scripts keep running. They're no longer listed. If your client auto-approves tools by name, add the new names.

### Not supported yet
Only Facebook and Instagram are live today. TikTok, X / Twitter, LinkedIn and YouTube are on the roadmap with no committed dates — tools for them will appear here only once they ship.

Track the platform roadmap at [socialapis.io/api-sources](https://socialapis.io/api-sources).

---

## 💡 Usage examples

Each prompt below is a real Claude Desktop session. Some of these are single-tool-call patterns ("get me X"); some require Claude to chain multiple calls + aggregate the results (noted where).

### Single-call patterns (fast, cheap)

```
What's Nike's follower count on Facebook?
→ Uses facebook_page action=details (1 credit)

Get the latest 9 posts from facebook.com/EngenSA
→ Uses facebook_page action=posts with limit=9 (1-3 credits depending on actual returned count)

Show me the Meta ads currently running for "Apple Vision Pro" in Germany
→ Uses facebook_ads action=search (1 credit)
```

### Multi-call patterns (Claude orchestrates these — but it's slower + more expensive)

```
Compare engagement on Nike vs Adidas's last 9 Facebook posts
→ Claude calls facebook_page action=posts twice (~2-6 credits total),
  aggregates reactions/comments/shares per post, returns a comparison.

What are people saying in the comments on Coca-Cola's last 3 posts?
→ Claude calls facebook_page action=posts (1 credit) then
  facebook_post action=comments 3 times (3 credits) and summarizes.

Show me marketplace listings for "PlayStation 5" under $400 in Berlin
→ Claude calls facebook_marketplace action=city_coordinates (1 credit) +
  facebook_marketplace action=search with filters (1 credit).
```

### What this MCP server does NOT do

Some queries look natural in a chat ("compare engagement over the last month") but require aggregations the API doesn't expose as a single tool yet. Claude can still answer them, but it'll fan out into many tool calls — which is slow + expensive.

| Query shape | Why it's hard |
|---|---|
| "Engagement rate over the last 30 days" for a page | Requires fetching every post in the date range (paginated, `limit` capped at 9 per call) and computing engagement per post. Hits the LLM tool-call budget on busy pages. |
| "Compare engagement rates between Brand A, B, C over the last month" | Same problem, 3× — one paginated fetch per brand, then comparison math. Works for small windows; slow for "last month" on high-volume pages. |
| Historical archive older than what Facebook itself serves | We surface what Facebook makes publicly visible. Posts that scrolled off Facebook's visible feed aren't retrievable. |
| Server-side time-series (daily engagement, weekly growth) | Not yet — on the roadmap as a future `engagement-stats` endpoint with built-in aggregation. |

If your use case maps to one of these patterns and you want the aggregation pre-computed instead of LLM-orchestrated, [contact support](https://socialapis.io/contact-us) with the specific query — we're prioritizing the aggregation endpoint based on customer demand.

---

## 🏗️ Architecture
```
Claude Desktop
    ↓
@socialapis/mcp (local MCP client)
    ↓
https://mcp.socialapis.io (global proxy)
    ↓
https://api.socialapis.io (data API)
```

**Why this architecture?**
- ✅ Low latency (global edge network)
- ✅ High reliability (99.9% uptime)
- ✅ Auto rate limiting
- ✅ Smart caching
- ✅ Your API key stays local

---

## 🔧 Development

### Local Setup
```bash
# Clone repository
git clone https://github.com/SocialAPIsHub/mcp-server.git
cd mcp-server

# Install dependencies
npm install

# Run MCP client
npm start YOUR_API_KEY

# Run HTTP proxy server
npm run serve
```

### Project Structure
```
mcp-server/
├── src/
│   ├── tools.js          # The 47 endpoint definitions (one per action)
│   └── groups.js         # Groups them into the 12 listed tools
├── mcp-wrapper.js        # MCP client (runs locally)
├── server.js             # HTTP proxy server
├── package.json
├── Dockerfile
└── README.md
```

### Testing
```bash
# Test MCP client locally
node mcp-wrapper.js YOUR_API_KEY

# Test HTTP proxy
curl http://localhost:3001/health
curl http://localhost:3001/tools

# Test specific tool
curl -X POST http://localhost:3001/proxy \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"tool":"facebook_page","arguments":{"action":"details","link":"https://facebook.com/nike"}}'
```

---

## 📊 Pricing

| Plan | Credits / month | Price |
|------|-----------------|-------|
| **Free** | 200 | $0 |
| Pro | 1,500 | $4.99 |
| Ultra | 30,000 | $49 |
| Mega | 120,000 | $179 |
| Enterprise | Custom | [Contact us](https://socialapis.io/contact-us) |

Most tools cost 1 credit per call; each tool description states its exact price. Current plans: [socialapis.io/pricing](https://socialapis.io/pricing).

[View detailed pricing →](https://socialapis.io/pricing)

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📖 Documentation

- [Full Documentation](https://docs.socialapis.io)
- [API Reference](https://docs.socialapis.io/api-reference/facebook)
- [MCP Guide](https://docs.socialapis.io/mcp)
- [Examples](https://github.com/SocialAPIsHub/examples)

---

## 💬 Support

- 📧 **Email:** [support@socialapis.io](mailto:support@socialapis.io)
- 💬 **Discord:** [discord.gg/D5bQskrwV](https://discord.gg/D5bQskrwV)
- 🐛 **Issues:** [GitHub Issues](https://github.com/SocialAPIsHub/mcp-server/issues)
- 📚 **Docs:** [docs.socialapis.io](https://docs.socialapis.io)

---

## 🗺️ Roadmap

**Shipped:**

- [x] Facebook API support — 7 tools, 31 actions (Pages, Groups, Posts, Search, Ads Library, Marketplace, Media)
- [x] **Instagram support** — 5 tools, 16 actions (Profiles, Posts, Reels, Highlights, Discovery / Locations)
- [x] MCP server implementation
- [x] HTTP proxy server
- [x] npm package published — [`@socialapis/mcp`](https://www.npmjs.com/package/@socialapis/mcp)
- [x] **MCP Registry listing** — [registry.modelcontextprotocol.io](https://registry.modelcontextprotocol.io)
- [x] **Python SDK** — [`socialapis-sdk`](https://pypi.org/project/socialapis-sdk/) on PyPI (50 endpoints, MIT)
- [x] **JavaScript / TypeScript SDK** — [`socialapis-sdk`](https://www.npmjs.com/package/socialapis-sdk) on npm (Node 18+, Bun, Deno, browsers)
- [x] **Go SDK** — [github.com/SocialAPIsHub/socialapis-go](https://github.com/SocialAPIsHub/socialapis-go) (idiomatic, zero deps)

**Upcoming:**

- [ ] TikTok support
- [ ] X (Twitter) support
- [ ] LinkedIn support
- [ ] YouTube support
- [ ] Advanced analytics — server-side aggregation endpoints (engagement-over-time, brand comparisons) so multi-call patterns become a single tool call
- [ ] Real-time webhooks — push notifications on new posts / engagement thresholds
- [ ] LangChain integration

Platform priorities shift based on customer demand. The fastest way to push something up the queue is to email [support@socialapis.io](mailto:support@socialapis.io) or DM [@socialapis on Telegram](https://t.me/socialapis) with the use case.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Model Context Protocol](https://modelcontextprotocol.io)
- Powered by [Anthropic Claude](https://anthropic.com)
- Inspired by the AI agent community

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=SocialAPIsHub/mcp-server&type=Date)](https://star-history.com/#SocialAPIsHub/mcp-server&Date)

---

<div align="center">

**Made with ❤️ by the SocialAPIs Team**

[Website](https://socialapis.io) • [Twitter](https://twitter.com/socialapis) • [Discord](https://discord.gg/D5bQskrwV)

[Python SDK](https://pypi.org/project/socialapis-sdk/) • [JS SDK](https://www.npmjs.com/package/socialapis-sdk) • [Go SDK](https://github.com/SocialAPIsHub/socialapis-go)

</div>