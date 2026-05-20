/**
 * CRUD Tools — Find, Add, Update, Delete rows in AppSheet tables
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AppSheetClient } from "../client.js";
import { getAppConfig } from "../config.js";

export function registerCrudTools(server: McpServer): void {
  // ── Find Rows ──────────────────────────────────────────────
  server.tool(
    "appsheet_find_rows",
    "Query/search rows from an AppSheet table. Returns all rows or filtered rows using an AppSheet expression.",
    {
      app: z
        .string()
        .optional()
        .describe("App name from config (optional if only one app configured)"),
      table: z.string().describe("Table name to query"),
      selector: z
        .string()
        .optional()
        .describe(
          'Optional AppSheet filter expression, e.g. [Status] = "Active"'
        ),
    },
    async ({ app, table, selector }) => {
      try {
        const config = getAppConfig(app);
        const client = new AppSheetClient(config);
        const rows = await client.find(table, selector);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(rows, null, 2),
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

  // ── Add Rows ───────────────────────────────────────────────
  server.tool(
    "appsheet_add_rows",
    "Add one or more rows to an AppSheet table.",
    {
      app: z
        .string()
        .optional()
        .describe("App name from config"),
      table: z.string().describe("Table name"),
      rows: z
        .array(z.record(z.unknown()))
        .describe("Array of row objects to add. Each object maps column names to values."),
    },
    async ({ app, table, rows }) => {
      try {
        const config = getAppConfig(app);
        const client = new AppSheetClient(config);
        const result = await client.add(table, rows);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                { message: `Added ${result.length} row(s)`, rows: result },
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

  // ── Update Rows ────────────────────────────────────────────
  server.tool(
    "appsheet_update_rows",
    "Update one or more existing rows in an AppSheet table. Each row object must include the key column.",
    {
      app: z
        .string()
        .optional()
        .describe("App name from config"),
      table: z.string().describe("Table name"),
      rows: z
        .array(z.record(z.unknown()))
        .describe(
          "Array of row objects to update. Must include the key column to identify which rows to update."
        ),
    },
    async ({ app, table, rows }) => {
      try {
        const config = getAppConfig(app);
        const client = new AppSheetClient(config);
        const result = await client.edit(table, rows);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                { message: `Updated ${result.length} row(s)`, rows: result },
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

  // ── Delete Rows ────────────────────────────────────────────
  server.tool(
    "appsheet_delete_rows",
    "Delete one or more rows from an AppSheet table by key column values.",
    {
      app: z
        .string()
        .optional()
        .describe("App name from config"),
      table: z.string().describe("Table name"),
      keys: z
        .array(z.record(z.unknown()))
        .describe(
          "Array of objects containing key column values to identify rows to delete."
        ),
    },
    async ({ app, table, keys }) => {
      try {
        const config = getAppConfig(app);
        const client = new AppSheetClient(config);
        const result = await client.delete(table, keys);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                { message: `Deleted ${result.length} row(s)`, rows: result },
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
