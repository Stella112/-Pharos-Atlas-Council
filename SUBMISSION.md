# Pharos Skill Builder Campaign Submission

Skill name:
`pharos-atlas-council`

Short description:
Pharos Atlas Council is a multi-agent RealFi decision Skill for Pharos Agent Center. Atlas evaluates RealFi/RWA strategies through Yield, Risk, Compliance, Bridge, Market, and Memory agents, then Sentinel Shield approves, blocks, or escalates execution based on safety, compliance, budget, data freshness, and user policy gates.

Campaign category fit:
Primary category: RealFi product interaction Skill.
Also relevant to DeFi position checking, onchain analytics, smart contract interaction preflight, testnet/mainnet activity safety, and developer debugging.

Functional proof:
The repository includes a working JavaScript SDK, runnable demos, and a stdio MCP server. `npm test` verifies both SDK logic and MCP framing. `npm run demo:yield` runs a RealFi council decision. `npm run demo:unsafe` shows Sentinel Shield blocking an unsafe transfer.

GitHub link:
https://github.com/Stella112/-Pharos-Atlas-Council

Email address:
TODO: add your email before posting.

Demo link, video, or screenshots:
TODO: add demo video or screenshots. The repo includes runnable demos:

```bash
npm run demo:yield
npm run demo:unsafe
```

Instructions:
1. Clone the repository.
2. Run `npm test` to verify the SDK.
3. Run `npm run demo:yield` to see Atlas Council evaluate a RealFi yield goal.
4. Run `npm run demo:unsafe` to see Sentinel Shield block an unsafe transfer.
5. Install the Skill by copying `skills/pharos-atlas-council` into the Pharos Skill Engine skills directory.
6. For MCP clients, run `npm run mcp` or use `mcp/config.example.json`.

Supported framework:
Pharos Skill Engine, Codex/OpenAI-compatible Skills, JavaScript SDK consumers, and stdio MCP clients.

Additional notes/dependencies:
Node.js 18+ recommended. No npm install is required for the core SDK, demos, or MCP server. The system is read-only by default and requires explicit user confirmation before any write action.
