# AppSheet MCP Server

[![npm version](https://img.shields.io/npm/v/appsheet-mcp-server)](https://www.npmjs.com/package/appsheet-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Open-source [MCP](https://modelcontextprotocol.io) server for **Google AppSheet** — enabling AI assistants (Claude, Gemini, Cursor, etc.) to interact with your AppSheet apps via the Model Context Protocol.

## Features

- 🔍 **CRUD Operations** — Find, add, update, delete rows in any AppSheet table
- 📋 **Schema Discovery** — List apps, tables, and column structure
- ⚡ **Custom Actions** — Trigger AppSheet actions and automation bots
- 🏢 **Multi-App Support** — Configure multiple apps with a single server
- 🔒 **Secure** — API keys stay local, never exposed to AI models
- 🚀 **Zero Config** — Works with just 2 environment variables

## Prerequisites

- **Node.js 18+**
- **AppSheet Core plan or higher** (API access requires a paid plan)
- **AppSheet API Key** — generated in AppSheet Editor → Settings → Integrations

## Quick Start

### 1. Get Your API Key

1. Open your AppSheet app in the editor
2. Go to **Settings → Integrations → IN: from cloud services**
3. Enable the API and copy the **Application Access Key**
4. Note your **App ID** from the URL: `https://www.appsheet.com/template/AppDef?appName=YOUR_APP_ID`

### 2. Configure

#### Option A: Environment Variables (Single App)

```bash
export APPSHEET_APP_ID="your-app-id"
export APPSHEET_API_KEY="V2-your-api-key"
export APPSHEET_REGION="global"  # or "eu" or "apac"
export APPSHEET_TABLES="Customers,Orders,Products"  # optional
```

#### Option B: Config File (Multiple Apps)

Create `~/.appsheet-mcp.json`:

```json
{
  "apps": {
    "crm": {
      "appId": "abc-123-def-456",
      "apiKey": "V2-xxxxx-xxxxx",
      "region": "global",
      "tables": ["Customers", "Contacts", "Deals"]
    },
    "inventory": {
      "appId": "ghi-789-jkl-012",
      "apiKey": "V2-yyyyy-yyyyy",
      "region": "eu",
      "tables": ["Products", "Warehouses", "Orders"]
    }
  }
}
```

### 3. Connect to Your AI Assistant

#### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "appsheet": {
      "command": "npx",
      "args": ["-y", "appsheet-mcp-server"],
      "env": {
        "APPSHEET_APP_ID": "your-app-id",
        "APPSHEET_API_KEY": "V2-your-api-key",
        "APPSHEET_REGION": "global"
      }
    }
  }
}
```

#### Cursor

Add to `.cursor/mcp.json` in your project:

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

#### VS Code

Add to your VS Code settings or `.vscode/mcp.json`:

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

## Tools

### Data Operations (CRUD)

| Tool | Description |
|------|-------------|
| `appsheet_find_rows` | Query/search rows with optional filter expression |
| `appsheet_add_rows` | Add one or more rows to a table |
| `appsheet_update_rows` | Update existing rows by key column |
| `appsheet_delete_rows` | Delete rows by key column values |

### Schema Discovery

| Tool | Description |
|------|-------------|
| `appsheet_list_apps` | List all configured apps |
| `appsheet_list_tables` | List tables in an app |
| `appsheet_describe_table` | Discover column names and types from sample data |

### Automation

| Tool | Description |
|------|-------------|
| `appsheet_run_action` | Execute a custom AppSheet action |
| `appsheet_run_workflow` | Trigger an AppSheet automation/bot |

### Utility

| Tool | Description |
|------|-------------|
| `appsheet_get_app_info` | Get app configuration summary (without API key) |

## Usage Examples

Once connected, ask your AI assistant:

> "Show me all customers from the Customers table"

> "Add a new order with customer 'Acme Corp', product 'Widget', quantity 50"

> "Update the status of order #123 to 'Shipped'"

> "What tables are available in my CRM app?"

> "Describe the structure of the Products table"

> "Run the 'Send Invoice' action on order #456"

## Filter Expressions

The `appsheet_find_rows` tool supports AppSheet filter expressions:

```
# Find active customers
selector: [Status] = "Active"

# Find orders over $1000
selector: [Total] > 1000

# Find by date range
selector: AND([Date] >= "2024-01-01", [Date] <= "2024-12-31")

# Find by name (contains)
selector: CONTAINS([Name], "Smith")
```

See [AppSheet expression documentation](https://support.google.com/appsheet/topic/10589072) for full syntax.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APPSHEET_APP_ID` | Yes* | — | Your AppSheet app ID |
| `APPSHEET_API_KEY` | Yes* | — | Your AppSheet API key |
| `APPSHEET_REGION` | No | `global` | API region: `global`, `eu`, `apac` |
| `APPSHEET_TABLES` | No | — | Comma-separated table names |
| `APPSHEET_CONFIG_PATH` | No | `~/.appsheet-mcp.json` | Path to multi-app config file |
| `APPSHEET_DEBUG` | No | `false` | Enable debug logging |

*Required unless using a config file.

## Debugging

Enable debug logging to see API calls:

```bash
export APPSHEET_DEBUG=true
```

Debug output goes to stderr (not stdout, which is reserved for MCP protocol).

## Regions

| Region | Base URL | Use for |
|--------|----------|---------|
| `global` | `www.appsheet.com` | Default, most apps |
| `eu` | `eu.appsheet.com` | EU data residency |
| `apac` | `asia-southeast.appsheet.com` | Asia-Pacific |

## Troubleshooting

### "AppSheet API error (403)"
- Verify your API key is correct
- Ensure API access is enabled in AppSheet Settings → Integrations
- Check that your AppSheet plan supports API access (Core or higher)

### "AppSheet API error (404)"
- Verify the table name matches exactly (case-sensitive)
- Check the app ID is correct

### "No AppSheet configuration found"
- Set `APPSHEET_APP_ID` and `APPSHEET_API_KEY` environment variables
- Or create a config file at `~/.appsheet-mcp.json`

## Contributing

Contributions welcome! Please open an issue or PR on GitHub.

## License

MIT © [Islom Ilkhomov](https://github.com/anthropics) / [EnterGravity](https://entergravity.com)

## Built By

Built by [EnterGravity](https://entergravity.com) — AI Automation Engineering Consultancy specializing in AppSheet, Gemini, and enterprise automation. 49+ AppSheet projects delivered with 100% client satisfaction.
