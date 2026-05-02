# 🇨🇭 MCP Swiss Army

> **The Swiss Army knife of MCP servers — 16 tools in a single connection.**

Connect once to `mcp-swiss-army` and give your AI agent access to weather, stocks, news, search, translation, and more. No API keys required.

[![npm version](https://img.shields.io/npm/v/mcp-swiss-army)](https://www.npmjs.com/package/mcp-swiss-army)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-Server-orange)](https://modelcontextprotocol.io)

---

## 🚀 Quick Start

### Use with Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "swiss-army": {
      "command": "npx",
      "args": ["-y", "mcp-swiss-army"]
    }
  }
}
```

### Use with Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "swiss-army": {
      "command": "npx",
      "args": ["-y", "mcp-swiss-army"]
    }
  }
}
```

### Use with OpenClaw / Any MCP Client

```bash
npx mcp-swiss-army
```

---

## 📦 Available Tools

| Category | Tool | Description | API Key? |
|----------|------|-------------|:--------:|
| **Utility** | `calculator` | Evaluate math expressions | ❌ |
| | `current_time` | Get time in any timezone | ❌ |
| | `ip_info` | Geolocation by IP | ❌ |
| | `generate_uuid` | Generate random UUIDs | ❌ |
| **Weather** | `get_weather` | Current weather + forecast | ❌ |
| **Search** | `web_search` | Search the web (DuckDuckGo) | ❌ |
| | `wikipedia` | Wikipedia summaries | ❌ |
| | `dictionary` | English word definitions | ❌ |
| **News** | `get_news` | Top headlines (CNN/BBC/Reuters) | ❌ |
| | `hackernews` | HN top stories | ❌ |
| **Finance** | `stock_quote` | Live stock prices | ❌ |
| | `currency_convert` | Currency conversion | ❌ |
| **Dev** | `github_repo` | GitHub repo info | ❌ |
| | `npm_package` | npm package info | ❌ |
| **Language** | `translate` | Translate 100+ languages | ❌ |
| | `text_analysis` | Word count, keywords, reading time | ❌ |

---

## 🌐 Cloud Deployment (Premium)

Don't want to run it locally? Use our hosted version:

```
https://swiss-army-mcp.example.com/sse
```

**Free tier:** 100 requests/day  
**Pro tier:** $5/month — unlimited requests

---

## 🔧 Self-Hosted

```bash
# Install globally
npm install -g mcp-swiss-army

# Run
mcp-swiss-army
```

---

## 💡 Example Usage

Once connected, ask your AI agent:

- *"What's the weather in Beijing?"*
- *"What's Apple's stock price today?"*
- *"Translate 'hello world' to Chinese"*
- *"Show me top HN stories"*
- *"Get Wikipedia summary of MCP"*
- *"Convert 1000 USD to CNY"*

---

## 📈 Roadmap

- [ ] AI-powered search summaries
- [ ] Social media lookup (Twitter/X)
- [ ] Code execution sandbox
- [ ] Custom API connectors
- [ ] Web scraping tool
- [ ] Image generation
- [ ] Email/Calendar integration

---

## 🤝 Contributing

PRs welcome! Each tool should:
1. Be self-contained in `src/tools/<name>.ts`
2. Use free APIs (no API keys)
3. Have clear descriptions for the AI

---

## 📄 License

MIT — use it freely.

---

**Built with ❤️ by Max Wang**

If this saves you time, consider supporting me:
- 🇨🇳 [爱发电 (国内)](https://afdian.com/@YOUR_ID) — 支付宝/微信
- ☕ [Buy me a coffee](https://github.com/sponsors/YOUR_USERNAME) — GitHub Sponsors
