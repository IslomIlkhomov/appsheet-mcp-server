/**
 * Utility Tools — App info and metadata
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAppConfig, listApps, loadConfig } from "../config.js";

export function registerUtilityTools(server: McpServer): void {
  // ── Get App Info ───────────────────────────────────────────
  server.tool(
    "appsheet_get_app_info",
    "Get configuration summary for an AppSheet app (ID, region, tables). Does not expose the API key.",
    {
      app: z
        .string()
        .optional()
        .describe("App name from config"),
    },
    async ({ app }) => {
      try {
        const config = getAppConfig(app);
        const appNames = listApps();
        const currentName = app || (appNames.includes("default") ? "default" : appNames[0]);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  name: currentName,
                  appId: config.appId,
                  region: config.region,
                  tables: config.tables ?? [],
                  tableCount: config.tables?.length ?? 0,
                  apiKeyConfigured: true,
                  totalAppsConfigured: appNames.length,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
