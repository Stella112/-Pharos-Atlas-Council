# Pharos Atlas Council

Pharos Atlas Council is a Pharos Agent Center Skill, JavaScript SDK, and MCP server for safety-gated RealFi decisions.

The core idea:

> Atlas proposes. Sentinel approves.

A user gives a high-level goal like "generate stable 7-9% RealFi yield while preserving liquidity and privacy." Atlas Council evaluates candidate strategies through specialized agents, scores them with a deterministic rubric, then Sentinel Shield blocks or escalates unsafe execution before any onchain write.

## What It Includes

- `skills/pharos-atlas-council`: Pharos Agent Center Skill package.
- `sdk`: dependency-free JavaScript SDK for council scoring and Sentinel policy review.
- `mcp/server.js`: stdio MCP server exposing Atlas/Sentinel tools.
- `demos`: sample RealFi goal and unsafe transfer review.

## Why This Fits Pharos

Pharos Agent Center already enables natural language onchain actions such as balance checks, transactions, contract reads/writes, gas estimation, deployment, ERC20 actions, and batch transfers. Atlas Council adds a decision and safety layer before those actions:

- RealFi/RWA strategy evaluation,
- compliance and ZK/privacy-aware receipts,
- risk and liquidity scoring,
- bridge and market condition checks,
- policy-based transaction blocking,
- agent accountability ledger.

## Quick Start

Run the tests:

```bash
npm test
```

Run the RealFi council demo:

```bash
npm run demo:yield
```

Run the unsafe transaction review:

```bash
npm run demo:unsafe
```

No dependency install is required for the core demo.

## SDK Usage

```js
import { reviewAction, runCouncil, scoreStrategies } from "pharos-atlas-council";

const scores = scoreStrategies({
  candidates: [
    {
      name: "Conservative RWA Yield Vault",
      yieldQuality: 8,
      capitalPreservation: 8,
      liquidity: 8,
      complianceReadiness: 8,
      executionSafety: 8,
      marketTiming: 7,
      councilConsensus: 8,
      memoryPenalty: 1,
      gates: {
        compliance: true,
        risk: true,
        execution: true,
        userConstraints: true,
        dataFreshness: true,
      },
    },
  ],
});

const sentinel = reviewAction({
  type: "transfer",
  network: "pharos-atlantic-testnet",
  amountUsd: 5000,
  contractKnown: false,
  isWrite: true,
  userConfirmed: false,
});
```

## MCP Usage

Start the stdio MCP server:

```bash
npm run mcp
```

Available MCP tools:

- `atlas_score_strategies`: score RealFi/RWA strategy candidates.
- `sentinel_review_action`: approve, block, or escalate a planned onchain action.
- `atlas_run_council`: run council scoring and Sentinel Shield together.

Example MCP client config:

```json
{
  "mcpServers": {
    "pharos-atlas-council": {
      "command": "node",
      "args": ["mcp/server.js"]
    }
  }
}
```

## Skill Installation

Copy this folder into the Pharos Skill Engine skills directory:

```text
skills/pharos-atlas-council
```

Then invoke:

```text
Use $pharos-atlas-council to evaluate a Pharos RealFi goal and block unsafe execution with Sentinel Shield.
```

## Demo Story

Prompt:

```text
Evaluate whether I should allocate 10,000 USDC into a 7-9% RealFi yield strategy on Pharos. I need 7-day liquidity and compliance-safe execution.
```

Expected behavior:

1. Atlas Council compares a conservative RWA strategy and a risky high-APY strategy.
2. The risky strategy is rejected for liquidity, compliance, and memory-risk reasons.
3. The conservative strategy receives a conditional recommendation.
4. Sentinel Shield escalates instead of executing because write actions require explicit confirmation.
5. The output includes a Trade Credit Report, Compliance Receipt, Agent Accountability Ledger, and Mistake Memory.

## Safety Model

Atlas Council is read-only by default. It does not request private keys in advisory mode and does not execute transactions from council output alone.

Sentinel Shield blocks or escalates:

- unsupported networks,
- unknown contracts,
- stale data,
- missing compliance,
- transfer or allocation limits,
- write actions without user confirmation,
- any private-key request or wallet-drain pattern.

## Campaign Submission

Skill name:
`pharos-atlas-council`

Short description:
Pharos Atlas Council is a multi-agent RealFi decision Skill for Pharos Agent Center. Atlas evaluates RealFi/RWA strategies through Yield, Risk, Compliance, Bridge, Market, and Memory agents, then Sentinel Shield approves, blocks, or escalates execution based on safety, compliance, budget, and user policy gates.

Instructions:
Run `npm test`, then `npm run demo:yield` and `npm run demo:unsafe`. Install the Skill by copying `skills/pharos-atlas-council` into the Pharos Skill Engine skills directory. MCP clients can run `npm run mcp`.

Supported framework:
Pharos Skill Engine, Codex/OpenAI-compatible Skills, and stdio MCP clients.

Dependencies:
Node.js 18+ recommended. No package install is required for the core demo.
