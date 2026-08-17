#!/usr/bin/env node

/**
 * Generates the test data file consumed by `testrigor test-suite run --variables-path`.
 *
 * The values come from app.json plus the CI environment, so a testRigor test case can
 * assert against the version it is actually running:
 *
 *   check that page contains text stored value "appVersion"
 *
 * Usage: TR_PLATFORM=android node scripts/testrigor-vars.js testrigor-vars.json
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const appConfig = JSON.parse(fs.readFileSync(path.join(root, "app.json"), "utf8"));
const outputPath = process.argv[2] || "testrigor-vars.json";

const { version, name, ios, android } = appConfig.expo;
const platform = (process.env.TR_PLATFORM || "").toLowerCase();

if (platform !== "android" && platform !== "ios") {
  console.error(`TR_PLATFORM must be "android" or "ios" (got: "${process.env.TR_PLATFORM ?? ""}")`);
  process.exit(1);
}

// testRigor reads global test data as a flat map of variable name -> value.
const variables = {
  appVersion: version,
  appName: name,
  appPlatform: platform,
  appIdentifier: platform === "ios" ? ios.bundleIdentifier : android.package,
  gitCommit: (process.env.GITHUB_SHA || "").slice(0, 7),
  gitRef: process.env.GITHUB_REF_NAME || "local",
};

fs.writeFileSync(outputPath, `${JSON.stringify(variables, null, 2)}\n`);
console.log(`Wrote ${outputPath}:`);
console.log(JSON.stringify(variables, null, 2));
