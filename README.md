# Pharos Atlas Council

**Pharos Atlas Council** is a safety-gated RealFi decision Skill for Pharos Agent Center.

Users describe a goal, such as:

> Evaluate a 7-9% RealFi yield strategy on Pharos while preserving liquidity and compliance safety.

Atlas Council compares possible strategies through specialized agents, scores them with a deterministic rubric, and then uses **Sentinel Shield** to approve, block, or escalate execution before any onchain write.

**Core idea:** Atlas proposes. Sentinel approves.

## What This Project Does

- Evaluates RealFi/RWA yield strategies for Pharos users.
- Runs a six-agent council: Yield, Risk, Compliance, Bridge, Market, and Memory.
- Scores candidate strategies with a transparent 100-point rubric.
- Applies Sentinel Shield policy gates before execution.
- Blocks unsafe transactions, excessive transfers, stale data, missing compliance, and unconfirmed writes.
- Produces decision artifacts: Trade Credit Report, Compliance Receipt, Accountability Ledger, and Mistake Memory.

## Repository Structure

```text
.
├── skills/pharos-atlas-council/   # Pharos Agent Center Skill
├── sdk/                           # JavaScript SDK
├── mcp/                           # stdio MCP server
├── demos/                         # runnable demo inputs
├── test/                          # SDK tests
├── SUBMISSION.md                  # Discord submission draft
└── README.md
```

## Quick Demo

No package install is required for the core demo.

Run tests:

```bash
npm test
```

Run the RealFi council demo:

```bash
npm run demo:yield
```

Run the Sentinel safety demo:

```bash
npm run demo:unsafe
```

Expected result:

- The council conditionally recommends the conservative RealFi/RWA strategy.
- The high-APY risky strategy is rejected or downgraded.
- Sentinel Shield refuses to execute until user confirmation is provided.
- The unsafe transfer demo is blocked because it exceeds the policy limit.

## Skill Installation

Copy the Skill folder into the Pharos Skill Engine skills directory:

```text
skills/pharos-atlas-council
```

Invoke it with:

```text
Use $pharos-atlas-council to evaluate a Pharos RealFi goal and block unsafe execution with Sentinel Shield.
```

## Example User Prompt

```text
Evaluate whether I should allocate 10,000 USDC into a 7-9% RealFi yield strategy on Pharos. I need 7-day liquidity and compliance-safe execution.
```

The Skill returns:

1. Decision summary
2. Sentinel Shield decision
3. Trade Credit Report
4. Council debate
5. Shield gate table
6. Compliance Receipt
7. Agent Accountability Ledger
8. Execution checklist
9. Mistake Memory entry

## SDK Usage

The SDK is dependency-free and can be imported by agent apps or developer tools.

```js
import { reviewAction, runCouncil, scoreStrategies } from "pharos-atlas-council";

const scores = scoreStrategies({
  candidates: [
    {
      name: "Conservative RWA Yield Vault",
      yieldQuality: 9,
      capitalPreservation: 8,
      liquidity: 8,
      complianceReadiness: 8,
      executionSafety: 8,
      marketTiming: 8,
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

Available tools:

- `atlas_score_strategies`: score RealFi/RWA candidates.
- `sentinel_review_action`: approve, block, or escalate a planned onchain action.
- `atlas_run_council`: run council scoring and Sentinel Shield together.

Example MCP config:

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

## Safety Model

Atlas Council is read-only by default.

It does not:

- request private keys in advisory mode,
- print private keys,
- execute write actions without explicit user confirmation,
- treat high APY as enough reason to bypass risk or compliance gates.

Sentinel Shield blocks or escalates:

- unsupported networks,
- unknown contracts,
- stale data,
- missing compliance,
- transfer or allocation limits,
- unconfirmed write actions,
- private-key requests,
- wallet-drain patterns.

## Supported Frameworks

- Pharos Skill Engine
- Codex/OpenAI-compatible Skills
- JavaScript SDK consumers
- stdio MCP clients

## Campaign Submission

A ready-to-edit campaign submission message is included in:

```text
SUBMISSION.md
```
