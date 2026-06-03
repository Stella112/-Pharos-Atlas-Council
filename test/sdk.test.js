import assert from "node:assert/strict";
import { reviewAction, runCouncil, scoreCandidate } from "../sdk/index.js";

const strongCandidate = scoreCandidate({
  name: "Safe RWA Vault",
  yieldQuality: 8,
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
});

assert.equal(strongCandidate.decision, "conditional_recommend");
assert.ok(strongCandidate.total >= 75);

const unsafe = reviewAction(
  {
    type: "transfer",
    network: "pharos-atlantic-testnet",
    amountUsd: 5000,
    contractKnown: false,
    isWrite: true,
    userConfirmed: false,
  },
  { maxTransferUsd: 1000 },
);

assert.equal(unsafe.decision, "block");
assert.ok(unsafe.reasons.some((reason) => reason.includes("exceeds limit")));

const council = runCouncil({
  goal: "Stable RealFi yield",
  network: "pharos-atlantic-testnet",
  wallet: "0x0000000000000000000000000000000000000000",
  capitalAmount: "10000 USDC",
  candidates: [
    {
      name: "Safe RWA Vault",
      yieldQuality: 8,
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

assert.equal(council.topCandidate.name, "Safe RWA Vault");
assert.equal(council.sentinel.decision, "escalate");

console.log("SDK tests passed");
