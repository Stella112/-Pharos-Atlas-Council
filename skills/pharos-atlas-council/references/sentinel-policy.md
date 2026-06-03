# Sentinel Shield Policy

Sentinel Shield is the final execution gate. It never decides strategy quality; it decides whether the selected action is safe enough to execute.

## Default Policy

- Allowed network: `pharos-atlantic-testnet`
- Pharos mainnet: requires explicit confirmation
- Maximum transfer: 1000 USD
- Maximum strategy allocation: 10000 USD
- Unknown contract: escalate by default
- RWA/RealFi action: requires compliance readiness
- Execution: requires fresh data
- Any write action: requires explicit user confirmation
- Blocked actions: wallet drain patterns and private-key requests

## Decisions

- `approve`: no blocking reasons or warnings.
- `escalate`: action may be valid, but needs user confirmation or extra verification.
- `block`: action violates policy and should not be executed.

## Common Blocks

- unsupported network,
- amount exceeds policy,
- compliance required but missing,
- live data stale or unavailable,
- explicitly blocked action type.

## Common Escalations

- Pharos mainnet execution,
- unknown or unverified contract,
- write action without final user confirmation.
