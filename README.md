# AppSheet MCP Server

[![npm version](https://img.shields.io/npm/v/appsheet-mcp-server)](https://www.npmjs.com/package/appsheet-mcp-server)
[![Smithery](https://smithery.ai/badge/appsheet)](https://smithery.ai/server/appsheet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Open-source [MCP](https://modelcontextprotocol.io) server for **Google AppSheet** — lets any AI assistant query, write, and automate your AppSheet apps through natural language.

## Setup

1. Open your app → **Settings → Integrations** → Enable API
2. Copy your **App Id** and **Access Key**

<details>
<summary>Where to find App Id and Access Key (screenshot)</summary>

![Where to find App Id and Access Key](docs/appsheet-id-and-key.png)

</details>

3. Add to your AI assistant's MCP config:

<details>
<summary>MCP config (click to expand)</summary>

```json
{
  "mcpServers": {
    "appsheet": {
      "command": "npx",
      "args": ["-y", "appsheet-mcp-server"],
      "env": {
        "APPSHEET_APP_ID": "your-app-id",
        "APPSHEET_API_KEY": "V2-your-access-key"
      }
    }
  }
}
```

</details>

## Tools

<details>
<summary>10 tools available (click to expand)</summary>

| Tool | Description |
|------|-------------|
| `appsheet_find_rows` | Query rows with optional filter |
| `appsheet_add_rows` | Add rows |
| `appsheet_update_rows` | Update rows by key |
| `appsheet_delete_rows` | Delete rows by key |
| `appsheet_list_tables` | List tables (live discovery) |
| `appsheet_describe_table` | Infer columns from sample data |
| `appsheet_run_action` | Execute a custom action |
| `appsheet_run_workflow` | Trigger an automation/bot |
| `appsheet_list_apps` | List configured apps |
| `appsheet_get_app_info` | App config summary |

</details>

## Examples

<details>
<summary>Try these prompts (click to expand)</summary>

**1.** "What tables do I have?"
**2.** "Show active customers"
**3.** "Add a row to Products"
**4.** "Count pending shipments"
**5.** "Update status to Delivered"
**6.** "Delete cancelled orders"
**7.** "Run Send Invoice on order #456"
**8.** "Describe the Orders table"


</details>

## Web App

No terminal? Use the browser-based **[AppSheet Chat](https://script.google.com/u/0/home/projects/1LierNqciZQI_bX5uOsw46hAYN3JGwMm3R0EHXr3vMxfchpEOuspiVYlF/edit)** — same tools, built-in chat UI, supports Gemini/OpenAI/Claude.

## License

MIT © [Islom Ilkhomov](https://github.com/IslomIlkhomov)
