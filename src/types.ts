/**
 * AppSheet MCP Server — Shared Type Definitions
 */

/** Configuration for a single AppSheet app */
export interface AppConfig {
  appId: string;
  apiKey: string;
  region: "global" | "eu" | "apac";
  tables?: string[];
}

/** Multi-app configuration */
export interface MultiAppConfig {
  apps: Record<string, AppConfig>;
}

/** AppSheet API request body */
export interface AppSheetRequest {
  Action: "Find" | "Add" | "Edit" | "Delete";
  Properties?: {
    Locale?: string;
    Timezone?: string;
    Selector?: string;
    [key: string]: unknown;
  };
  Rows?: Record<string, unknown>[];
}

/** AppSheet API response */
export interface AppSheetResponse {
  Rows?: Record<string, unknown>[];
  [key: string]: unknown;
}

/** AppSheet API region base URLs */
export const REGIONS: Record<string, string> = {
  global: "https://www.appsheet.com",
  eu: "https://eu.appsheet.com",
  apac: "https://asia-southeast.appsheet.com",
};
