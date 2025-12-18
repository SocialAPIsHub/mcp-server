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
| `API_BASE_URL` | Backend API URL | `https://api.socialapis.io/v1` |

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

### Facebook Pages
- `facebook_get_page_id` - Extract page ID from URL
- `facebook_get_page_details` - Get page info, followers, likes
- `facebook_get_page_posts` - Fetch posts with time filtering
- `facebook_get_page_reels` - Get reels/short videos

### Facebook Groups
- `facebook_get_group_id` - Extract group ID from URL
- `facebook_get_group_details` - Get group metadata
- `facebook_get_group_posts` - Fetch group posts

### Facebook Posts
- `facebook_get_post_id` - Extract post ID from URL
- `facebook_get_post_details` - Get reactions, comments, shares
- `facebook_get_post_attachments` - Get media attachments
- `facebook_get_video_details` - Get video metadata
- `facebook_get_post_comments` - Fetch comments with pagination

**More platforms coming soon:** Instagram, TikTok, YouTube, Twitter

---

## 💡 Usage Examples

### Brand Monitoring
```
Monitor Nike's Facebook page and alert me if engagement drops below average
```

### Competitive Analysis
```
Compare engagement rates between Nike, Adidas, and Puma over the last month
```

### Content Strategy
```
What types of posts get the most engagement on Coca-Cola's Facebook page?
```

### Sentiment Analysis
```
Analyze comments on our recent posts and identify common themes
```

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
- [API Reference](https://docs.socialapis.io/api-reference)
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