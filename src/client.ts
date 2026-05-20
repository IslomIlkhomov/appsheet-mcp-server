/**
 * AppSheet MCP Server — REST API Client
 *
 * Wraps the AppSheet REST API v2 with typed methods for CRUD and custom actions.
 * API docs: https://support.google.com/appsheet/answer/10105342
 */

import { REGIONS } from "./types.js";
import type { AppConfig, AppSheetRequest, AppSheetResponse } from "./types.js";
import { isDebug } from "./config.js";

export class AppSheetClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(private config: AppConfig) {
    const regionUrl = REGIONS[config.region] || REGIONS.global;
    this.baseUrl = `${regionUrl}/api/v2/apps/${config.appId}/tables`;
    this.apiKey = config.apiKey;
  }

  /** Make a request to the AppSheet API */
  private async request(
    table: string,
    body: AppSheetRequest
  ): Promise<Record<string, unknown>[]> {
    const url = `${this.baseUrl}/${encodeURIComponent(table)}/Action`;

    if (isDebug()) {
      console.error(`[AppSheet MCP] ${body.Action} → ${table}`);
      console.error(`[AppSheet MCP] URL: ${url}`);
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ApplicationAccessKey: this.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `AppSheet API error (${response.status}): ${text.slice(0, 500)}`
      );
    }

    const data = (await response.json()) as AppSheetResponse;

    if (isDebug()) {
      const rowCount = Array.isArray(data) ? data.length : data.Rows?.length ?? 0;
      console.error(`[AppSheet MCP] Response: ${rowCount} row(s)`);
    }

    // AppSheet returns rows directly as an array or nested under Rows
    if (Array.isArray(data)) {
      return data as Record<string, unknown>[];
    }
    return data.Rows ?? [];
  }

  /** Find/query rows from a table */
  async find(
    table: string,
    selector?: string
  ): Promise<Record<string, unknown>[]> {
    const body: AppSheetRequest = {
      Action: "Find",
      Properties: {},
      Rows: [],
    };

    if (selector) {
      body.Properties!.Selector = `Filter(${table}, ${selector})`;
    }

    return this.request(table, body);
  }

  /** Add rows to a table */
  async add(
    table: string,
    rows: Record<string, unknown>[]
  ): Promise<Record<string, unknown>[]> {
    return this.request(table, {
      Action: "Add",
      Properties: {},
      Rows: rows,
    });
  }

  /** Edit/update rows in a table (rows must include key column) */
  async edit(
    table: string,
    rows: Record<string, unknown>[]
  ): Promise<Record<string, unknown>[]> {
    return this.request(table, {
      Action: "Edit",
      Properties: {},
      Rows: rows,
    });
  }

  /** Delete rows from a table (keys must include key column values) */
  async delete(
    table: string,
    keys: Record<string, unknown>[]
  ): Promise<Record<string, unknown>[]> {
    return this.request(table, {
      Action: "Delete",
      Properties: {},
      Rows: keys,
    });
  }

  /** Run a custom AppSheet action */
  async runAction(
    table: string,
    action: string,
    rows?: Record<string, unknown>[]
  ): Promise<Record<string, unknown>[]> {
    const url = `${this.baseUrl}/${encodeURIComponent(table)}/Action`;

    if (isDebug()) {
      console.error(`[AppSheet MCP] Action "${action}" → ${table}`);
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ApplicationAccessKey: this.apiKey,
      },
      body: JSON.stringify({
        Action: action,
        Properties: {},
        Rows: rows ?? [],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `AppSheet API error (${response.status}): ${text.slice(0, 500)}`
      );
    }

    const data = await response.json();
    if (Array.isArray(data)) return data as Record<string, unknown>[];
    return (data as AppSheetResponse).Rows ?? [];
  }
}
