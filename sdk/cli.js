#!/usr/bin/env node

import fs from "node:fs";
import { renderCouncilMarkdown, reviewAction, runCouncil } from "./index.js";

const [command, filePath] = process.argv.slice(2);

if (!command || !filePath) {
  console.error("Usage: node sdk/cli.js <run-council|review-action> <input.json>");
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));

if (command === "run-council") {
  console.log(renderCouncilMarkdown(runCouncil(payload, payload.policy)));
} else if (command === "review-action") {
  console.log(JSON.stringify(reviewAction(payload.action || payload, payload.policy), null, 2));
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
