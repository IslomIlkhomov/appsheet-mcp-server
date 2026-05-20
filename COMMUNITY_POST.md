# Community Post Drafts — AppSheet MCP Server Launch

---

## 1. AppSheet Community Post (community.appsheet.com)

### Title: 🚀 Open-Source MCP Server for AppSheet — Let AI Assistants Talk to Your Apps

**Category:** Tips & Tricks / Community Resources

---

Hey AppSheet community! 👋

I've built and open-sourced an **MCP (Model Context Protocol) server for AppSheet** that lets AI assistants like Claude, Gemini, Cursor, and VS Code Copilot interact directly with your AppSheet apps.

### What it does

Connect your AI assistant to your AppSheet apps and:
- 🔍 **Query data** — "Show me all active customers from my CRM"
- ➕ **Add rows** — "Add a new order for Acme Corp"
- ✏️ **Update records** — "Change order #123 status to Shipped"
- 🗑️ **Delete rows** — "Remove the cancelled orders"
- 📋 **Discover schema** — "What tables and columns does my app have?"
- ⚡ **Trigger actions** — "Run the Send Invoice action on order #456"

### Why I built this

Google's official AppSheet MCP server is locked behind Enterprise Plus private preview. The managed options (Zapier, Pipedream) require paid platforms. There was no free, open-source, self-hosted option for the rest of us.

### Setup (2 minutes)

1. Get your AppSheet API key (Settings → Integrations)
2. Add this to your Claude Desktop config:

```json
{
  "mcpServers": {
    "appsheet": {
      "command": "npx",
      "args": ["-y", "appsheet-mcp-server"],
      "env": {
        "APPSHEET_APP_ID": "your-app-id",
        "APPSHEET_API_KEY": "V2-your-api-key"
      }
    }
  }
}
```

3. Start chatting with your data!

### Features
- ✅ 10 tools (CRUD + schema + actions + workflows)
- ✅ Multi-app support (configure multiple apps)
- ✅ Works with Claude, Cursor, VS Code, any MCP client
- ✅ TypeScript, well-documented, MIT licensed
- ✅ Debug mode for troubleshooting

### Links
- GitHub: https://github.com/IslomIlkhom/appsheet-mcp-server
- npm: https://www.npmjs.com/package/appsheet-mcp-server

Would love your feedback! What tools/features would you want added?

Built by Antigravity — 49+ AppSheet projects, 100% client satisfaction 🎯

---

## 2. LinkedIn Post

---

🚀 Just open-sourced: **AppSheet MCP Server**

The first free, open-source MCP server for Google AppSheet.

What does it do? It lets AI assistants (Claude, Gemini, Cursor) talk directly to your AppSheet apps:

→ Query and filter data with natural language
→ Add, update, delete records
→ Discover table schemas automatically
→ Trigger custom actions and workflows
→ Multi-app support out of the box

Why? Google's own AppSheet MCP is Enterprise Plus only (private preview). Zapier/Pipedream charge monthly fees. There was no free option.

Now there is. 10 tools. 2-minute setup. MIT licensed.

npm install → configure → ask your AI to manage your AppSheet data.

GitHub: https://github.com/IslomIlkhom/appsheet-mcp-server
npm: https://www.npmjs.com/package/appsheet-mcp-server

Built on 49+ AppSheet projects and real MCP production experience (our GIPHM Insurance MCP server handles 37 tables, 707 columns in production).

#AppSheet #MCP #AI #Automation #OpenSource #NoCode #GoogleWorkspace

---

## 3. Dev.to / Medium Article Outline

### Title: "Building an Open-Source MCP Server for Google AppSheet"

1. **The Problem** — Google's AppSheet MCP is gated. No open-source option exists.
2. **What is MCP?** — Brief explainer for non-AI-native audience
3. **Architecture** — REST API wrapping, stdio transport, tool registration
4. **10 Tools Explained** — CRUD, schema, actions with code examples
5. **Multi-App Config** — env vars vs JSON file
6. **Setup Guide** — Claude Desktop, Cursor, VS Code
7. **Lessons from Production** — GIPHM MCP server experience (302 redirect problem, hallucination reduction)
8. **What's Next** — Community contributions, feature roadmap
