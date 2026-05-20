/**
 * Action Tools — Run custom AppSheet actions and trigger workflows
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AppSheetClient } from "../client.js";
import { getAppConfig } from "../config.js";

export function registerActionTools(server: McpServer): void {
  // ── Run Action ─────────────────────────────────────────────
  server.tool(
    "appsheet_run_action",
    "Execute a custom AppSheet action on a table. Use for actions defined in the AppSheet editor (e.g., send email, change status, grouped actions).",
    {
      app: z
        .string()
        .optional()
        .describe("App name from config"),
      table: z.string().describe("Table the action belongs to"),
      action: z
        .string()
        .describe("Name of the custom action to execute"),
      rows: z
        .array(z.record(z.unknown()))
        .optional()
        .describe(
          "Optional row data to pass to the action. Must include key column to identify target rows."
        ),
    },
    async ({ app, table, action, rows }) => {
      try {
        const config = getAppConfig(app);
        const client = new AppSheetClient(config);
        const result = await client.runAction(table, action, rows);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  message: `Action "${action}" executed on table "${table}"`,
                  result,
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

  // ── Run Workflow ───────────────────────────────────────────
  server.tool(
    "appsheet_run_workflow",
    "Trigger an AppSheet automation/bot/workflow by executing its associated action. The action must be configured as a bot trigger in AppSheet.",
    {
      app: z
        .string()
        .optional()
        .describe("App name from config"),
      table: z.string().describe("Table the workflow is associated with"),
      action: z
        .string()
        .describe("Name of the workflow/bot trigger action"),
      rows: z
        .array(z.record(z.unknown()))
        .describe(
          "Row data that triggers the workflow. Must include key column."
        ),
    },
    async ({ app, table, action, rows }) => {
      try {
        const config = getAppConfig(app);
        const client = new AppSheetClient(config);
        const result = await client.runAction(table, action, rows);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  message: `Workflow "${action}" triggered on table "${table}"`,
                  result,
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
