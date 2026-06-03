---
name: pharos-atlas-council
description: Run a multi-agent RealFi decision council with Sentinel Shield safety gates for Pharos Agent Center. Use when a user asks an AI agent to evaluate RealFi strategies, RWA exposure, yield opportunities, liquidity preservation, remittance routes, compliance gates, bridge plans, portfolio actions, transaction safety, or autonomous onchain decisions on Pharos.
---

# Pharos Atlas Council

Turn a high-level RealFi goal into an accountable Pharos decision. Atlas proposes strategies through a six-agent council. Sentinel Shield approves, blocks, or escalates execution before any onchain write.

## Core Principle

Atlas proposes. Sentinel approves.

Use the council for strategy reasoning and use Sentinel Shield as the final execution gate. Default to read-only analysis. Never send a transaction from council output alone.

## Council Flow

1. Capture the user's goal, constraints, wallet/network, time horizon, capital size, liquidity need, compliance requirements, and risk tolerance.
2. Build candidate strategies from user-provided assets, Pharos ecosystem context, or live protocol data available to the active agent.
3. Run the six council roles in `references/agent-prompts.md`.
4. Score candidates with the rubric in `references/scoring-rubric.md` or the SDK function `scoreStrategies`.
5. Convert the selected candidate into a proposed action.
6. Run Sentinel Shield using `references/sentinel-policy.md` or the SDK function `reviewAction`.
7. Produce:
   - Trade Credit Report,
   - Compliance Receipt,
   - Agent Accountability Ledger,
   - Sentinel Shield decision,
   - Mistake Memory entry.
8. If execution is requested, show the exact transaction plan and ask for explicit confirmation. Treat Pharos mainnet as a separate confirmation step.

## Council Members

- Yield Agent: discovers and ranks RealFi/RWA opportunities.
- Risk Agent: stress tests downside, liquidity, counterparty, oracle, and smart-contract risk.
- Compliance Agent: enforces ZK/KYC/AML constraints and approval gates.
- Bridge Agent: reviews cross-chain routing, route fees, timing, finality, and failure modes.
- Market Agent: evaluates live conditions, slippage, volatility, rates, and data freshness.
- Memory Agent: checks past mistakes and penalizes repeated unsafe patterns.
- Sentinel Shield: final policy gate that approves, blocks, or escalates execution.

## Inputs

Required:

- goal,
- network (`pharos-atlantic-testnet` or `pharos-mainnet`),
- wallet or account context,
- capital amount or relative size,
- risk tolerance,
- candidate strategies or enough context to derive them.

Useful:

- target APY,
- maximum drawdown,
- liquidity deadline,
- allowed assets/protocols,
- compliance requirements,
- whether cross-chain routing is allowed,
- user policy limits.

Use `assets/stable-yield-goal.json` and `assets/unsafe-transfer-action.json` as templates.

## Output Format

Return the council result in this order:

1. Decision summary: recommend, conditional recommend, watchlist, or reject.
2. Sentinel Shield: approve, block, or escalate, with reasons.
3. Trade Credit Report: selected strategy, expected return range, main risks, stress test, liquidity plan.
4. Council Debate: one concise paragraph per agent.
5. Shield Gates: pass/fail table for network, risk, compliance, data freshness, user confirmation, and execution safety.
6. Compliance Receipt: identity/compliance assumptions, blocked conditions, ZK/privacy notes.
7. Agent Accountability Ledger: agent votes, confidence, dissent, and final responsibility owner.
8. Execution Plan: read-only checks first, transaction plan only after explicit user request.
9. Mistake Memory: what to monitor, what would make the council wrong, and what to learn next time.

## Execution Rules

- Do not ask for private keys in advisory mode.
- Do not print private keys under any condition.
- Do not execute writes without user confirmation.
- Block or escalate unknown contracts, stale data, missing compliance, unsupported networks, excessive spend, or actions outside the user's mission.
- For mainnet, require an explicit mainnet confirmation even if all other gates pass.

## SDK and MCP

Use the repository SDK when the host environment supports Node.js:

```bash
node sdk/cli.js run-council demos/stable-yield-goal.json
node sdk/cli.js review-action demos/unsafe-transfer-action.json
```

Use the MCP server when the agent framework supports stdio MCP tools:

```bash
node mcp/server.js
```
