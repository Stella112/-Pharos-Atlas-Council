# Demo Video Script

Use this flow for a short recording.

## 1. Open With The Idea

Say:

> Pharos Atlas Council is a RealFi Prime Broker Skill for Pharos Agent Center. A user gives a high-level goal, Atlas compares strategies, and Sentinel Shield blocks unsafe execution before any onchain write.

## 2. Show The Repo

Point out:

- `skills/pharos-atlas-council`: the Pharos Skill.
- `sdk`: the working JavaScript SDK.
- `mcp`: the MCP server for agent clients.
- `demos`: sample inputs for the video.

## 3. Run Tests

```bash
npm test
```

Expected:

```text
SDK tests passed
MCP smoke test passed
```

## 4. Run The Full Demo

```bash
npm run demo:video
```

What to highlight:

- The report title says `Pharos Atlas Council Prime Broker Report`.
- The conservative RWA strategy receives a conditional recommendation.
- The risky high-APY strategy is downgraded.
- Sentinel Shield escalates the RealFi write action because user confirmation is still required.
- Sentinel blocks the unsafe transfer because it exceeds the policy limit.

## 5. Close With The Campaign Fit

Say:

> This fits Pharos as a RealFi product interaction Skill, onchain analytics Skill, and smart contract interaction preflight layer. It is functional today through a Skill, SDK, MCP server, tests, and runnable demos.
