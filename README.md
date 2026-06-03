# Pharos Atlas Council

**Pharos Atlas Council** is a RealFi Prime Broker Skill for Pharos Agent Center. It gives AI agents a structured operating desk for RealFi decisions: capital goals, strategy comparison, risk review, compliance checks, execution planning, and accountable reporting.

Users describe a goal, such as:

> Evaluate a 7-9% RealFi yield strategy on Pharos while preserving liquidity and compliance safety.

Atlas Council researches candidate opportunities, runs an internal debate between specialized agents, scores each strategy, applies ZK/compliance and risk gates, prepares execution plans, and learns from outcomes through a Mistake Memory Loop. It is designed for agent-managed capital workflows where the user gives an intent and the agent needs a disciplined process before acting onchain.

The council is paired with **Sentinel Shield**, a final safety layer that approves, blocks, or escalates any proposed onchain action before execution. Atlas does not blindly execute. It prepares a plan, documents the reasoning, and requires Sentinel approval plus explicit user confirmation before any write action.

**Core idea:** Atlas is the RealFi prime broker. Sentinel is the execution gate.

## What This Project Does

- Turns high-level RealFi goals into scored Pharos action plans.
- Evaluates RealFi/RWA yield strategies for Pharos users.
- Helps agents decide whether a RealFi, DeFi, bridge, transfer, or contract interaction plan is safe enough to continue.
- Runs a six-agent council: Yield Scout, Risk Steward, Compliance Shield, Bridge Navigator, Market Oracle, and Memory Keeper.
- Scores candidate strategies with a transparent 100-point rubric.
- Applies Sentinel Shield policy gates before execution.
- Blocks unsafe transactions, excessive transfers, stale data, missing compliance, and unconfirmed writes.
- Produces decision artifacts: Trade Credit Report, Compliance Receipt, Accountability Ledger, and Mistake Memory.

As a Prime Broker Skill, Atlas Council covers the decision workflow around agent-managed capital:

- **Capital allocation**: compare strategies against yield, liquidity, and risk targets.
- **Risk management**: stress test candidates and recommend exposure limits.
- **Compliance coordination**: document KYC/AML/RWA assumptions and ZK/privacy notes.
- **Execution planning**: prepare read-only checks and transaction plans without blindly executing.
- **Reporting**: produce receipts and accountability records agents can reuse.
- **Monitoring memory**: record what would make the decision wrong and what to check next.

## Campaign Fit

Atlas Council fits the Pharos Skill Builder campaign as a **RealFi product interaction Skill** and **agent-native prime broker workflow**.

It also overlaps with these suggested categories:

- **DeFi position checker**: evaluates candidate yield/position strategies before action.
- **Onchain analytics Skill**: turns strategy inputs, risk gates, and policy checks into a structured decision report.
- **Smart contract interaction Skill**: reviews planned contract/write actions before execution.
- **Testnet/mainnet activity helper**: treats testnet and mainnet differently, with mainnet requiring explicit confirmation.
- **Developer debugging Skill**: explains why an agent action was blocked or escalated.

The Skill is functional today in three ways:

1. **Skill layer**: `skills/pharos-atlas-council/SKILL.md` gives Pharos Agent Center a complete prime-broker workflow.
2. **SDK layer**: `sdk/index.js` runs deterministic strategy scoring and Sentinel policy review.
3. **MCP layer**: `mcp/server.js` exposes the same logic as MCP tools for agent clients.

## Atlas Council Agents

- **Yield Scout**: discovers and ranks RealFi/RWA opportunities.
- **Risk Steward**: stress tests strategies and recommends position sizing.
- **Compliance Shield**: enforces ZK/KYC/AML and RealFi compliance gates.
- **Bridge Navigator**: reviews LayerZero-style routing, cross-chain movement, fees, timing, and failure modes.
- **Market Oracle**: checks market conditions, liquidity, volatility, rates, and data freshness.
- **Memory Keeper**: tracks past decisions, mistakes, and recurring risk patterns.
- **Sentinel Shield**: final approve/block/escalate layer before any onchain action.

## Prime Broker Flow

```text
Goal -> Strategy Desk -> Council Debate & Simulation -> Risk Scoring + ZK Gates -> Sentinel Shield -> Confirmed Execution Plan -> Monitoring & Memory
```

## Repository Structure

```text
.
|-- skills/pharos-atlas-council/   # Pharos Agent Center Skill
|-- sdk/                           # JavaScript SDK
|-- mcp/                           # stdio MCP server
|-- demos/                         # runnable demo inputs
|-- test/                          # SDK tests
|-- SUBMISSION.md                  # Discord submission draft
`-- README.md
```

## Quick Demo

No package install is required for the core demo.

Run tests:

```bash
npm test
```

Run the RealFi Prime Broker demo:

```bash
npm run demo:yield
```

Run the Sentinel safety demo:

```bash
npm run demo:unsafe
```

Run the full video demo flow:

```bash
npm run demo:video
```

Expected result:

- Atlas conditionally recommends the conservative RealFi/RWA strategy.
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
Use $pharos-atlas-council to evaluate a Pharos RealFi goal as a prime broker and block unsafe execution with Sentinel Shield.
```

## Example User Prompt

```text
Act as my Pharos RealFi prime broker. Evaluate whether I should allocate 10,000 USDC into a 7-9% RealFi yield strategy on Pharos. I need 7-day liquidity and compliance-safe execution.
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

A short recording guide is included in:

```text
DEMO.md
```
