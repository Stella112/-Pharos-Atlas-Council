# Pharos Skill Builder Campaign Submission

Skill name:
`pharos-atlas-council`

Short description:
Pharos Atlas Council is a RealFi Prime Broker Skill for Pharos Agent Center. Users state high-level capital goals such as stable yield, liquidity preservation, RWA exposure, or remittance treasury management. Atlas evaluates RealFi/RWA strategies through Yield Scout, Risk Steward, Compliance Shield, Bridge Navigator, Market Oracle, and Memory Keeper, then Sentinel Shield approves, blocks, or escalates execution based on safety, compliance, budget, data freshness, and user policy gates.

Campaign category fit:
Primary category: RealFi product interaction Skill.
Also relevant to DeFi position checking, onchain analytics, smart contract interaction preflight, testnet/mainnet activity safety, and developer debugging.

Functional proof:
The repository includes a working JavaScript SDK, runnable demos, and a stdio MCP server. `npm test` verifies both SDK logic and MCP framing. `npm run demo:yield` runs a RealFi Prime Broker decision. `npm run demo:unsafe` shows Sentinel Shield blocking an unsafe transfer.

GitHub link:
https://github.com/Stella112/-Pharos-Atlas-Council

Email address:
[Add your email address before posting]

Demo link, video, or screenshots:
[Add your demo video or screenshots link before posting]

The repo includes runnable demos:

```bash
npm run demo:video
npm run demo:yield
npm run demo:unsafe
```

Instructions:
1. Clone the repository.
2. Run `npm test` to verify the SDK.
3. Run `npm run demo:video` to see the full demo flow.
4. Run `npm run demo:yield` to see Atlas Council act as a RealFi Prime Broker for a yield goal.
5. Run `npm run demo:unsafe` to see Sentinel Shield block an unsafe transfer.
6. Install the Skill by copying `skills/pharos-atlas-council` into the Pharos Skill Engine skills directory.
7. For MCP clients, run `npm run mcp` or use `mcp/config.example.json`.

Supported framework:
Pharos Skill Engine, Codex/OpenAI-compatible Skills, JavaScript SDK consumers, and stdio MCP clients.

Additional notes/dependencies:
Node.js 18+ recommended. No npm install is required for the core SDK, demos, or MCP server. The system is read-only by default and requires explicit user confirmation before any write action.
