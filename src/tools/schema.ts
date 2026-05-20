/**
 * Schema Tools — Discover apps, tables, and column structure
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AppSheetClient } from "../client.js";
import { getAppConfig, listApps, loadConfig } from "../config.js";

export function registerSchemaTools(server: McpServer): void {
  // ── List Apps ──────────────────────────────────────────────
  server.tool(
    "appsheet_list_apps",
    "List all configured AppSheet apps with their regions and table counts.",
    {},
    async () => {
      try {
        const config = loadConfig();
        const apps = Object.entries(config.apps).map(([name, app]) => ({
          name,
          appId: app.appId,
          region: app.region,
          tables: app.tables ?? [],
          tableCount: app.tables?.length ?? 0,
        }));

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(apps, null, 2),
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

  // ── List Tables ────────────────────────────────────────────
  server.tool(
    "appsheet_list_tables",
    "List table names configured for an AppSheet app.",
    {
      app: z
        .string()
        .optional()
        .describe("App name from config"),
    },
    async ({ app }) => {
      try {
        const config = getAppConfig(app);
        const tables = config.tables ?? [];

        if (tables.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: "No tables configured. Add table names to your config to enable schema discovery, or use appsheet_describe_table to probe a specific table.",
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ tables }, null, 2),
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

  // ── Describe Table ─────────────────────────────────────────
  server.tool(
    "appsheet_describe_table",
    "Discover the column structure of an AppSheet table by fetching a sample row. Returns column names and sample values.",
    {
      app: z
        .string()
        .optional()
        .describe("App name from config"),
      table: z.string().describe("Table name to describe"),
    },
    async ({ app, table }) => {
      try {
        const config = getAppConfig(app);
        const client = new AppSheetClient(config);

        // Fetch one row to discover columns
        const rows = await client.find(table);
        const sampleRow = rows[0];

        if (!sampleRow) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Table "${table}" appears to be empty. Cannot infer schema without data.`,
              },
            ],
          };
        }

        const columns = Object.entries(sampleRow).map(([name, value]) => ({
          name,
          sampleValue: value,
          inferredType: inferType(value),
        }));

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  table,
                  columnCount: columns.length,
                  rowCount: rows.length,
                  columns,
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

/** Infer a simple type string from a sample value */
function inferType(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "string") {
    // Try to detect common AppSheet types
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return "date/datetime";
    if (/^https?:\/\//.test(value)) return "url";
    if (value.includes("@")) return "email";
    return "text";
  }
  if (Array.isArray(value)) return "list";
  return "object";
}
