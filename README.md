# SocialAPIs MCP Server

<div align="center">

![SocialAPIs Logo](https://socialapis.io/logo.png)

**Unified social media API for AI agents**

[![npm version](https://badge.fury.io/js/%40socialapis%2Fmcp.svg)](https://www.npmjs.com/package/@socialapis/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/SocialAPIsHub/mcp-server.svg)](https://github.com/SocialAPIsHub/mcp-server/stargazers)

[Website](https://socialapis.io) • [Documentation](https://docs.socialapis.io) • [Discord](https://discord.gg/socialapis) • [npm](https://www.npmjs.com/package/@socialapis/mcp)

</div>

---

## 🚀 Quick Start

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

- 🌐 **Unified API** - One interface for multiple platforms
- 🤖 **AI-First** - Built for Claude, Cursor, and AI agents
- 📊 **Rich Data** - Posts, comments, engagement metrics
- 🔍 **Advanced Filtering** - Time ranges, pagination
- 🎯 **Simple Auth** - No OAuth complexity
- ⚡ **Fast** - Global edge network
- 🔒 **Secure** - API keys stay local

---

## 🛠️ Available Tools

47 tools across Facebook and Instagram. Every tool maps 1:1 to a REST endpoint on `api.socialapis.io` — pricing notes in each tool description indicate per-call credit cost.

### Facebook — Pages
- `facebook_get_page_id` — Extract page ID from URL
- `facebook_get_page_details` — Page info, followers, likes, category. Set `exact_followers_count=true` for the exact integer (charges 5 credits instead of 1)
- `facebook_get_page_posts` — Fetch posts with `after_time` / `before_time` for date filtering. `limit` 3-9, charges scale per `ceil(returned / 3)`
- `facebook_get_page_videos` — Page videos, `limit` 6-12
- `facebook_get_page_reels` — Reels / short videos

### Facebook — Groups
- `facebook_get_group_id` — Extract group ID from URL
- `facebook_get_group_metadata` — Lightweight metadata (name, id, cover image)
- `facebook_get_group_details` — Full details (members, description, rules)
- `facebook_get_group_posts` — Group posts, same `limit` + date filtering as page posts
- `facebook_get_group_videos` — Group videos

### Facebook — Posts
- `facebook_get_post_id` — Extract post ID from URL
- `facebook_get_post_details` — Reactions, comments count, shares, media
- `facebook_get_post_attachments` — Full media attachments (5 credits per call)
- `facebook_get_video_details` — Video post metadata + stats
- `facebook_get_post_comments` — Top-level comments, `limit` up to 30
- `facebook_get_comment_replies` — Replies to a specific comment

### Facebook — Search
- `facebook_search_pages` — Search pages by keyword + optional location filter
- `facebook_search_people` — Search public profiles by keyword
- `facebook_search_locations` — Look up Facebook location UIDs (for use in other endpoints)
- `facebook_search_posts` — Search posts by keyword, recency, location
- `facebook_search_videos` — Search Facebook Watch videos

### Facebook — Ads Library (Meta Ad Transparency)
- `facebook_ads_search` — Search ads by keyword, country, status
- `facebook_ads_page_details` — All ads from a specific page
- `facebook_ads_archive_details` — Full ad archive details
- `facebook_ads_keywords` — Search ads by keyword
- `facebook_ads_countries` — List of supported country codes

### Facebook — Marketplace
- `facebook_marketplace_search` — Item search with location, price, category, condition filters
- `facebook_marketplace_listing` — Single listing details
- `facebook_marketplace_seller` — Seller profile + their listings
- `facebook_marketplace_categories` — Browse category hierarchy
- `facebook_marketplace_city_coordinates` — Lat/long for a city (for radius search)
- `facebook_marketplace_vehicles` — Vehicle-specific listing search
- `facebook_marketplace_rentals` — Rental property listings

### Facebook — Media
- `facebook_download_media` — Direct download URL for FB media (images, videos)

### Instagram — Profile
- `instagram_get_user_id` — Resolve username → numeric ID
- `instagram_get_profile_details` — Profile info, follower count, bio, post count
- `instagram_get_profile_posts` — Recent posts from a profile
- `instagram_get_profile_reels` — Reels from a profile
- `instagram_get_profile_highlights` — Story highlights list
- `instagram_get_highlight_details` — Full content of a specific highlight

### Instagram — Posts + Reels
- `instagram_get_post_id` — Resolve post URL → ID
- `instagram_get_post_details` — Likes, comments, media, caption
- `instagram_get_reels_feed` — Reels feed for a profile
- `instagram_get_reels_by_audio` — Reels using a specific audio/music ID

### Instagram — Discovery
- `instagram_popular_search` — Trending queries / suggestions
- `instagram_get_location_posts` — Posts tagged at a specific location
- `instagram_get_nearby_locations` — Nearby location IDs (for use in location-posts)

### Coming soon
- TikTok (videos, profiles, hashtags)
- X / Twitter (tweets, profiles, search)
- LinkedIn (company pages, posts, employees)
- YouTube (videos, channels, comments)

Track the platform roadmap at [socialapis.io/api-sources](https://socialapis.io/api-sources).

---

## 💡 Usage examples

Each prompt below is a real Claude Desktop session. Some of these are single-tool-call patterns ("get me X"); some require Claude to chain multiple calls + aggregate the results (noted where).

### Single-call patterns (fast, cheap)

```
What's Nike's follower count on Facebook?
→ Uses facebook_get_page_details (1 credit)

Get the latest 9 posts from facebook.com/EngenSA
→ Uses facebook_get_page_posts with limit=9 (1-3 credits depending on actual returned count)

Show me the Meta ads currently running for "Apple Vision Pro" in Germany
→ Uses facebook_ads_search (1 credit)
```

### Multi-call patterns (Claude orchestrates these — but it's slower + more expensive)

```
Compare engagement on Nike vs Adidas's last 9 Facebook posts
→ Claude calls facebook_get_page_posts twice (~2-6 credits total),
  aggregates reactions/comments/shares per post, returns a comparison.

What are people saying in the comments on Coca-Cola's last 3 posts?
→ Claude calls facebook_get_page_posts (1 credit) then
  facebook_get_post_comments 3 times (3 credits) and summarizes.

Show me marketplace listings for "PlayStation 5" under $400 in Berlin
→ Claude calls facebook_marketplace_city_coordinates (1 credit) +
  facebook_marketplace_search with filters (1 credit).
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
│   └── tools.js          # Tool definitions
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
  -d '{"tool":"facebook_get_page_details","arguments":{"link":"https://facebook.com/nike"}}'
```

---

## 📊 Pricing

| Plan | Requests/Month | Price |
|------|----------------|-------|
| **Free** | 200 | $0 |
| **Starter** | 30,000 | $49 |
| **Pro** | 120,000 | $179 |
| **Enterprise** | Unlimited | Custom |

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
- 💬 **Discord:** [discord.gg/socialapis](https://discord.gg/socialapis)
- 🐛 **Issues:** [GitHub Issues](https://github.com/SocialAPIsHub/mcp-server/issues)
- 📚 **Docs:** [docs.socialapis.io](https://docs.socialapis.io)

---

## 🗺️ Roadmap

- [x] Facebook API support
- [x] MCP server implementation
- [x] HTTP proxy server
- [x] npm package published
- [ ] Instagram support
- [ ] TikTok support
- [ ] YouTube support
- [ ] Twitter/X support
- [ ] Real-time webhooks
- [ ] Advanced analytics
- [ ] Python SDK
- [ ] LangChain integration

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

[Website](https://socialapis.io) • [Twitter](https://twitter.com/socialapis) • [Discord](https://discord.gg/socialapis)

</div>