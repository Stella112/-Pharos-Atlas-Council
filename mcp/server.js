#!/usr/bin/env node

import { stdin, stdout } from "node:process";
import fs from "node:fs";
import { reviewAction, runCouncil, scoreStrategies } from "../sdk/index.js";

let buffer = "";

const tools = [
  {
    name: "atlas_score_strategies",
    description: "Score Pharos RealFi/RWA strategy candidates using the Atlas Council rubric.",
    inputSchema: {
      type: "object",
      properties: {
        goal: { type: "string" },
        candidates: { type: "array", items: { type: "object" } },
      },
      required: ["candidates"],
    },
  },
  {
    name: "sentinel_review_action",
    description: "Approve, block, or escalate a planned Pharos onchain action using Sentinel Shield policy rules.",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "object" },
        policy: { type: "object" },
      },
      required: ["action"],
    },
  },
  {
    name: "atlas_run_council",
    description: "Run Atlas Council scoring plus Sentinel Shield review for a Pharos RealFi goal.",
    inputSchema: {
      type: "object",
      properties: {
        goal: { type: "string" },
        network: { type: "string" },
        wallet: { type: "string" },
        capitalAmount: { type: "string" },
        riskTolerance: { type: "string" },
        candidates: { type: "array", items: { type: "object" } },
        proposedAction: { type: "object" },
        policy: { type: "object" },
      },
      required: ["goal", "candidates"],
    },
  },
];

function respond(id, result) {
  stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, result })}\n`);
}

function fail(id, code, message) {
  stdout.write(`${JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } })}\n`);
}

function textContent(value) {
  return {
    content: [
      {
        type: "text",
        text: typeof value === "string" ? value : JSON.stringify(value, null, 2),
      },
    ],
  };
}

async function handle(message) {
  const { id, method, params = {} } = message;

  if (method === "initialize") {
    respond(id, {
      protocolVersion: "2024-11-05",
      capabilities: { tools: {}, resources: {} },
      serverInfo: { name: "pharos-atlas-council", version: "0.1.0" },
    });
    return;
  }

  if (method === "notifications/initialized") return;

  if (method === "tools/list") {
    respond(id, { tools });
    return;
  }

  if (method === "tools/call") {
    const name = params.name;
    const args = params.arguments || {};
    if (name === "atlas_score_strategies") {
      respond(id, textContent({ goal: args.goal, results: scoreStrategies(args) }));
      return;
    }
    if (name === "sentinel_review_action") {
      respond(id, textContent(reviewAction(args.action, args.policy)));
      return;
    }
    if (name === "atlas_run_council") {
      respond(id, textContent(runCouncil(args, args.policy)));
      return;
    }
    fail(id, -32602, `Unknown tool: ${name}`);
    return;
  }

  if (method === "resources/list") {
    respond(id, {
      resources: [
        {
          uri: "pharos-atlas://skill",
          name: "Pharos Atlas Council Skill",
          mimeType: "text/markdown",
          description: "Instructions for the Pharos Agent Center skill.",
        },
      ],
    });
    return;
  }

  if (method === "resources/read") {
    if (params.uri !== "pharos-atlas://skill") {
      fail(id, -32602, `Unknown resource: ${params.uri}`);
      return;
    }
    const text = fs.readFileSync("skills/pharos-atlas-council/SKILL.md", "utf8");
    respond(id, {
      contents: [
        {
          uri: params.uri,
          mimeType: "text/markdown",
          text,
        },
      ],
    });
    return;
  }

  fail(id, -32601, `Unsupported method: ${method}`);
}

stdin.setEncoding("utf8");
stdin.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() || "";
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      handle(JSON.parse(line)).catch((error) => fail(null, -32000, error.message));
    } catch (error) {
      fail(null, -32700, error.message);
    }
  }
});
