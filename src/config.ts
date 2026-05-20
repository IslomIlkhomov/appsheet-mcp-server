/**
 * AppSheet MCP Server — Configuration Loader
 *
 * Supports two modes:
 * 1. Single-app via environment variables (APPSHEET_APP_ID, APPSHEET_API_KEY)
 * 2. Multi-app via JSON config file (~/.appsheet-mcp.json or APPSHEET_CONFIG_PATH)
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { homedir } from "os";
import type { AppConfig, MultiAppConfig } from "./types.js";

const DEFAULT_CONFIG_PATH = resolve(homedir(), ".appsheet-mcp.json");

let _config: MultiAppConfig | null = null;

/** Load configuration from env vars or config file */
export function loadConfig(): MultiAppConfig {
  if (_config) return _config;

  // Try env vars first (single-app mode)
  const appId = process.env.APPSHEET_APP_ID;
  const apiKey = process.env.APPSHEET_API_KEY;

  if (appId && apiKey) {
    const region = (process.env.APPSHEET_REGION || "global") as AppConfig["region"];
    const tables = process.env.APPSHEET_TABLES
      ? process.env.APPSHEET_TABLES.split(",").map((t) => t.trim())
      : undefined;

    _config = {
      apps: {
        default: { appId, apiKey, region, tables },
      },
    };

    if (isDebug()) {
      console.error("[AppSheet MCP] Loaded single-app config from env vars");
    }

    return _config;
  }

  // Try config file (multi-app mode)
  const configPath = process.env.APPSHEET_CONFIG_PATH || DEFAULT_CONFIG_PATH;

  if (existsSync(configPath)) {
    try {
      const raw = readFileSync(configPath, "utf-8");
      const parsed = JSON.parse(raw);

      if (!parsed.apps || typeof parsed.apps !== "object") {
        throw new Error('Config file must have an "apps" object');
      }

      // Validate each app config
      for (const [name, app] of Object.entries(parsed.apps)) {
        const a = app as Record<string, unknown>;
        if (!a.appId || !a.apiKey) {
          throw new Error(`App "${name}" missing required fields: appId, apiKey`);
        }
        if (!a.region) {
          (a as Record<string, unknown>).region = "global";
        }
      }

      _config = parsed as MultiAppConfig;

      if (isDebug()) {
        console.error(
          `[AppSheet MCP] Loaded ${Object.keys(_config.apps).length} app(s) from ${configPath}`
        );
      }

      return _config;
    } catch (err) {
      throw new Error(
        `Failed to parse config file at ${configPath}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  throw new Error(
    "No AppSheet configuration found. Set APPSHEET_APP_ID + APPSHEET_API_KEY env vars, " +
      `or create a config file at ${DEFAULT_CONFIG_PATH}. ` +
      "See README for setup instructions."
  );
}

/** Get config for a specific app (or the default/first app) */
export function getAppConfig(appName?: string): AppConfig {
  const config = loadConfig();
  const apps = Object.keys(config.apps);

  if (!appName) {
    // Return first (or "default") app
    const name = apps.includes("default") ? "default" : apps[0];
    return config.apps[name];
  }

  if (!config.apps[appName]) {
    throw new Error(
      `App "${appName}" not found in configuration. Available apps: ${apps.join(", ")}`
    );
  }

  return config.apps[appName];
}

/** List all configured app names */
export function listApps(): string[] {
  const config = loadConfig();
  return Object.keys(config.apps);
}

/** Check if debug mode is enabled */
export function isDebug(): boolean {
  return process.env.APPSHEET_DEBUG === "true";
}
