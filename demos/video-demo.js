#!/usr/bin/env node

import fs from "node:fs";
import { reviewAction, runCouncil, renderCouncilMarkdown } from "../sdk/index.js";

const yieldGoal = JSON.parse(fs.readFileSync("demos/stable-yield-goal.json", "utf8"));
const unsafeTransfer = JSON.parse(fs.readFileSync("demos/unsafe-transfer-action.json", "utf8"));

console.log("============================================================");
console.log("PHAROS ATLAS COUNCIL - DEMO VIDEO FLOW");
console.log("============================================================");
console.log("");
console.log("Demo 1: RealFi Prime Broker decision");
console.log("User goal: stable 7-9% yield, 7-day liquidity, compliance-safe execution.");
console.log("");
console.log(renderCouncilMarkdown(runCouncil(yieldGoal, yieldGoal.policy)));
console.log("");
console.log("============================================================");
console.log("");
console.log("Demo 2: Sentinel Shield blocks unsafe execution");
console.log("Planned action: transfer 5,000 USD with a 1,000 USD policy limit.");
console.log("");
console.log(JSON.stringify(reviewAction(unsafeTransfer.action, unsafeTransfer.policy), null, 2));
console.log("");
console.log("============================================================");
console.log("Demo complete: Atlas proposes. Sentinel approves, escalates, or blocks.");
console.log("============================================================");
