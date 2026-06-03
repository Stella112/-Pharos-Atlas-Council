#!/usr/bin/env node

import { stdin, stdout } from "node:process";
import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { reviewAction, runCouncil, scoreStrategies } from "../sdk/index.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillPath = resolve(repoRoot, "skills/pharos-atlas-council/SKILL.md");

let buffer = Buffer.alloc(0);
let responseFraming = "line";

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
  writeJson({ jsonrpc: "2.0", id, result });
}

function fail(id, code, message) {
  writeJson({ jsonrpc: "2.0", id, error: { code, message } });
}

function writeJson(payload) {
  const json = JSON.stringify(payload);
  if (responseFraming === "header") {
    stdout.write(`Content-Length: ${Buffer.byteLength(json, "utf8")}\r\n\r\n${json}`);
  } else {
    stdout.write(`${json}\n`);
  }
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
    const text = fs.readFileSync(skillPath, "utf8");
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

stdin.on("data", (chunk) => {
  buffer = Buffer.concat([buffer, Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)]);
  parseBuffer();
});

function parseBuffer() {
  while (buffer.length > 0) {
    const text = buffer.toString("utf8");
    if (text.startsWith("Content-Length:")) {
      const headerEnd = text.indexOf("\r\n\r\n");
      if (headerEnd === -1) return;

      const header = text.slice(0, headerEnd);
      const match = header.match(/Content-Length:\s*(\d+)/i);
      if (!match) {
        fail(null, -32700, "Missing Content-Length header.");
        buffer = Buffer.alloc(0);
        return;
      }

      const contentLength = Number(match[1]);
      const bodyStart = Buffer.byteLength(text.slice(0, headerEnd + 4), "utf8");
      if (buffer.length < bodyStart + contentLength) return;

      responseFraming = "header";
      const body = buffer.subarray(bodyStart, bodyStart + contentLength).toString("utf8");
      buffer = buffer.subarray(bodyStart + contentLength);
      dispatchJson(body);
      continue;
    }

    const newlineIndex = text.search(/\r?\n/);
    if (newlineIndex === -1) return;

    const line = text.slice(0, newlineIndex).trim();
    const newlineLength = text[newlineIndex] === "\r" && text[newlineIndex + 1] === "\n" ? 2 : 1;
    const consumed = Buffer.byteLength(text.slice(0, newlineIndex + newlineLength), "utf8");
    buffer = buffer.subarray(consumed);
    if (line) {
      responseFraming = "line";
      dispatchJson(line);
    }
  }
}

function dispatchJson(json) {
  try {
    const parsed = JSON.parse(json);
    const result = handle(parsed);
    if (result?.catch) result.catch((error) => fail(parsed.id ?? null, -32000, error.message));
  } catch (error) {
    fail(null, -32700, error.message);
  }
}
