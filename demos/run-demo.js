#!/usr/bin/env node

import fs from "node:fs";
import { reviewAction, runCouncil, renderCouncilMarkdown } from "../sdk/index.js";

const filePath = process.argv[2] || "demos/stable-yield-goal.json";
const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));

if (payload.action) {
  console.log("# Sentinel Shield Review\n");
  console.log(JSON.stringify(reviewAction(payload.action, payload.policy), null, 2));
} else {
  console.log(renderCouncilMarkdown(runCouncil(payload, payload.policy)));
}
