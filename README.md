# AppSheet MCP Server

[![npm version](https://img.shields.io/npm/v/appsheet-mcp-server)](https://www.npmjs.com/package/appsheet-mcp-server)
[![Smithery](https://smithery.ai/badge/appsheet)](https://smithery.ai/server/appsheet)
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

### 1. Get Your App ID and Access Key

Both come from the same screen in the AppSheet editor:

![Where to find the App Id and Access Key in AppSheet Settings → Integrations](docs/appsheet-id-and-key.png)

1. Open your app, then go to **Settings (⚙️) → Integrations**.
2. Under **IN: from cloud services to your app**, turn the **Enable** toggle on.
3. Copy the **App Id** shown in that section — this is your `APPSHEET_APP_ID` (e.g. `a369c03b-f9f8-4bce-af50-444ff4cb6ab7`).
4. Under **Application Access Keys**, click **Create Application Access Key** if none exists, then click **Show Access Key** and copy it — this is your `APPSHEET_API_KEY` (it starts with `V2-`).

> Keep the access key secret — it grants API access to your app's data. The key stays local to this server and is never sent to the AI model.

### 2. Configure

#### Option A: Environment Variables (Single App)

```bash
export APPSHEET_APP_ID="your-app-id"
export APPSHEET_API_KEY="V2-your-api-key"
export APPSHEET_REGION="global"  # or "eu" or "apac"
```

#### Option B: Config File (Multiple Apps)

Create `~/.appsheet-mcp.json`:

```json
{
  "apps": {
    "crm": {
      "appId": "abc-123-def-456",
      "apiKey": "V2-xxxxx-xxxxx",
      "region": "global"
    },
    "inventory": {
      "appId": "ghi-789-jkl-012",
      "apiKey": "V2-yyyyy-yyyyy",
      "region": "eu"
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

#### Gemini Code Assist / Antigravity

Add to your `.gemini/settings.json` or workspace MCP config:

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
selector: AND([Date] >= "2025-01-01", [Date] <= "2025-12-31")

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

## Web App (No Install)

Prefer a browser-based setup? The **AppSheet Chat** web app is a hosted Google Apps Script version with a built-in chat UI. No terminal, no npm — just paste your credentials and start chatting.

- **8 tools** — same CRUD, schema, and action capabilities as this MCP server
- **3 LLM providers** — Gemini, OpenAI, Claude (bring your own API key)
- **Zero install** — runs entirely in Google Apps Script

[Open the Web App →](https://script.google.com/u/0/home/projects/1LierNqciZQI_bX5uOsw46hAYN3JGwMm3R0EHXr3vMxfchpEOuspiVYlF/edit)

## Limitations

This server can only do what the AppSheet REST API exposes. Where the API is gated, the server is gated too. Be aware of the following before relying on it:

### Tables *can* be discovered live
`appsheet_list_tables` discovers tables straight from the API using only your **App ID + access key** — no need to pre-configure table names. It falls back to configured names only if the discovery endpoint is unavailable. (Setting `APPSHEET_TABLES` is therefore optional, useful mainly to scope or order the list.)

### Column-level schema is inferred, not declared
There is **no column schema endpoint**. The `appsheet_describe_table` tool works by fetching sample rows and inferring column names and types from the data. As a result it **cannot** see:

- **Column `Type` definitions** (e.g. whether a field is Text, Number, Enum, Price, etc.)
- **Validation rules** or constraints defined in the editor
- **Virtual columns** (computed values not stored in row data)
- **`Ref` relationships** between tables

If a column is empty in the sampled rows, it won't appear at all. Treat the output as a best-effort shape hint, not an authoritative schema.

### Actions cannot be listed or discovered
The AppSheet API does **not** provide a way to enumerate the actions or automations configured in your app. Because of this:

- `appsheet_run_action` / `appsheet_run_workflow` require the **exact action name** as defined in the AppSheet editor — you have to know it in advance.
- Only **row-level actions** are invokable via the API. The action runs against the row(s) you pass in.
- There is **no API search** for available action names, and the editor does not surface the API-callable name separately, so triggering grouped/sequenced actions may require trial and error.

### Data operations are limited to the API's native verbs
Beyond custom actions, the only built-in operations are `Find`, `Add`, `Edit`, and `Delete`. The server does not (and cannot) reproduce AppSheet's in-app validation, security filters, or workflow side effects beyond what the API itself triggers.

### What it's good for today
Structured **CRUD** over your tables, plus letting an AI assistant infer your data's shape **without** needing the Google Sheets API (gspread, Sheets API, etc.). It's a fast path to reading and writing AppSheet data — just not a full mirror of the editor's modeling layer.

> See [AppSheet API integration points](https://support.google.com/appsheet/answer/10105557) for the underlying capabilities and constraints.

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

### Writes succeed but commit 0 rows
If `appsheet_add_rows` / `appsheet_update_rows` return a `warning` and `"Added 0 row(s)"`, AppSheet accepted the request (HTTP 200) but committed nothing. This is gated app-side, not a server error. Check that:
- API updates are enabled: **Data → table → "Are updates allowed?"** includes the operation, and **Settings → Integrations** is on.
- All **required columns** are supplied — a row failing validation is silently dropped.

## Contributing

Contributions welcome! Please open an issue or PR on GitHub.

## License

MIT © [Islom Ilkhom](https://github.com/IslomIlkhom) / [Antigravity](https://antigravity.google/)
