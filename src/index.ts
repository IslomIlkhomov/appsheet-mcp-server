/**
 * AppSheet MCP Server
 *
 * Open-source MCP server for Google AppSheet — CRUD, schema discovery,
 * and automation tools for AI assistants.
 *
 * @see https://github.com/anthropics/appsheet-mcp-server
 * @license MIT
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerCrudTools } from "./tools/crud.js";
import { registerSchemaTools } from "./tools/schema.js";
import { registerActionTools } from "./tools/actions.js";
import { registerUtilityTools } from "./tools/utility.js";
import { registerSchemaResources } from "./resources/schema.js";
import { loadConfig, isDebug } from "./config.js";

async function main(): Promise<void> {
  // Load and validate configuration
  const config = loadConfig();
  const appCount = Object.keys(config.apps).length;

  if (isDebug()) {
    console.error("[AppSheet MCP] Debug mode enabled");
    console.error(`[AppSheet MCP] Loaded ${appCount} app(s)`);
    for (const [name, app] of Object.entries(config.apps)) {
      console.error(
        `[AppSheet MCP]   → ${name}: ${app.appId} (${app.region}, ${app.tables?.length ?? 0} tables)`
      );
    }
  }

  // Create MCP server
  const server = new McpServer({
    name: "appsheet-mcp-server",
    version: "1.0.0",
  });

  // Register all tools and resources
  registerCrudTools(server);
  registerSchemaTools(server);
  registerActionTools(server);
  registerUtilityTools(server);
  registerSchemaResources(server);

  // Start with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  if (isDebug()) {
    console.error("[AppSheet MCP] Server started successfully");
    console.error("[AppSheet MCP] 10 tools registered, listening on stdio");
  }
}

main().catch((error) => {
  console.error("[AppSheet MCP] Fatal error:", error);
  process.exit(1);
});
