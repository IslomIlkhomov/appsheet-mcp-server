/**
 * Schema Resources — Expose app schema as MCP resources
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { loadConfig, getAppConfig } from "../config.js";

export function registerSchemaResources(server: McpServer): void {
  // Register a resource for each configured app's schema
  const config = loadConfig();

  for (const [name, app] of Object.entries(config.apps)) {
    const uri = `appsheet://apps/${name}/schema`;

    server.resource(
      `schema-${name}`,
      uri,
      {
        description: `Schema for AppSheet app "${name}" — lists configured tables and app metadata`,
        mimeType: "application/json",
      },
      async () => {
        const appConfig = getAppConfig(name);

        const schema = {
          app: name,
          appId: appConfig.appId,
          region: appConfig.region,
          tables: (appConfig.tables ?? []).map((tableName) => ({
            name: tableName,
            // Column details require a Find call — see appsheet_describe_table tool
          })),
        };

        return {
          contents: [
            {
              uri,
              mimeType: "application/json",
              text: JSON.stringify(schema, null, 2),
            },
          ],
        };
      }
    );
  }
}
