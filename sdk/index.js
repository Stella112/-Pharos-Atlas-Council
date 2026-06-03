const CATEGORY_WEIGHTS = {
  yieldQuality: 15,
  capitalPreservation: 20,
  liquidity: 15,
  complianceReadiness: 15,
  executionSafety: 15,
  marketTiming: 10,
  councilConsensus: 5,
  memoryPenalty: 5,
};

const DEFAULT_POLICY = {
  allowedNetworks: ["pharos-atlantic-testnet"],
  mainnetRequiresConfirmation: true,
  maxTransferUsd: 1000,
  maxStrategyAllocationUsd: 10000,
  unknownContractAction: "escalate",
  requireComplianceForRwa: true,
  requireFreshDataForExecution: true,
  requireUserConfirmationForWrites: true,
  blockedActions: ["wallet-drain", "private-key-request"],
};

function bounded(value) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(10, number));
}

function normalizeUsd(value) {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return 0;
  const match = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function failedGateNames(gates = {}) {
  return Object.entries(gates)
    .filter(([, passed]) => !passed)
    .map(([name]) => name);
}

export function scoreCandidate(candidate = {}) {
  const positive =
    (bounded(candidate.yieldQuality) / 10) * CATEGORY_WEIGHTS.yieldQuality +
    (bounded(candidate.capitalPreservation) / 10) * CATEGORY_WEIGHTS.capitalPreservation +
    (bounded(candidate.liquidity) / 10) * CATEGORY_WEIGHTS.liquidity +
    (bounded(candidate.complianceReadiness) / 10) * CATEGORY_WEIGHTS.complianceReadiness +
    (bounded(candidate.executionSafety) / 10) * CATEGORY_WEIGHTS.executionSafety +
    (bounded(candidate.marketTiming) / 10) * CATEGORY_WEIGHTS.marketTiming +
    (bounded(candidate.councilConsensus) / 10) * CATEGORY_WEIGHTS.councilConsensus;

  const penalty = (bounded(candidate.memoryPenalty) / 10) * CATEGORY_WEIGHTS.memoryPenalty;
  const total = Math.round((positive - penalty) * 10) / 10;
  const failedGates = failedGateNames(candidate.gates);

  let decision = "reject";
  if (failedGates.length > 0) decision = "watchlist";
  else if (total >= 85) decision = "recommend";
  else if (total >= 75) decision = "conditional_recommend";
  else if (total >= 60) decision = "watchlist";

  return {
    name: candidate.name || "Unnamed candidate",
    total,
    decision,
    failedGates,
    notes: candidate.notes || "",
  };
}

export function scoreStrategies(payload = {}) {
  const candidates = Array.isArray(payload) ? payload : payload.candidates || [];
  return candidates.map(scoreCandidate).sort((a, b) => b.total - a.total);
}

export function reviewAction(action = {}, policy = {}) {
  const mergedPolicy = { ...DEFAULT_POLICY, ...policy };
  const reasons = [];
  const warnings = [];

  const network = action.network || "unknown";
  if (!mergedPolicy.allowedNetworks.includes(network)) {
    if (network === "pharos-mainnet" && mergedPolicy.mainnetRequiresConfirmation) {
      warnings.push("Mainnet action requires explicit confirmation.");
    } else {
      reasons.push(`Network '${network}' is not allowed by policy.`);
    }
  }

  if (mergedPolicy.blockedActions.includes(action.type)) {
    reasons.push(`Action type '${action.type}' is blocked.`);
  }

  const amountUsd = normalizeUsd(action.amountUsd || action.amount);
  if (action.type === "transfer" && amountUsd > mergedPolicy.maxTransferUsd) {
    reasons.push(`Transfer amount ${amountUsd} USD exceeds limit ${mergedPolicy.maxTransferUsd} USD.`);
  }

  if (action.type === "strategy_allocation" && amountUsd > mergedPolicy.maxStrategyAllocationUsd) {
    reasons.push(
      `Strategy allocation ${amountUsd} USD exceeds limit ${mergedPolicy.maxStrategyAllocationUsd} USD.`,
    );
  }

  if (action.contractKnown === false) {
    const message = "Target contract is unknown or unverified.";
    if (mergedPolicy.unknownContractAction === "block") reasons.push(message);
    else warnings.push(message);
  }

  if (action.requiresCompliance && mergedPolicy.requireComplianceForRwa && !action.complianceReady) {
    reasons.push("Compliance is required for this RWA/RealFi action but is not ready.");
  }

  if (action.dataFresh === false && mergedPolicy.requireFreshDataForExecution) {
    reasons.push("Live data is stale or missing, so execution is blocked.");
  }

  if (action.isWrite && mergedPolicy.requireUserConfirmationForWrites && !action.userConfirmed) {
    warnings.push("Write action requires explicit user confirmation before execution.");
  }

  let decision = "approve";
  if (reasons.length > 0) decision = "block";
  else if (warnings.length > 0) decision = "escalate";

  return {
    decision,
    reasons,
    warnings,
    policy: mergedPolicy,
  };
}

export function runCouncil(payload = {}, policy = {}) {
  const scores = scoreStrategies(payload);
  const top = scores[0] || null;
  const proposedAction = payload.proposedAction || {
    type: "strategy_allocation",
    network: payload.network,
    amount: payload.capitalAmount,
    amountUsd: normalizeUsd(payload.capitalAmount),
    requiresCompliance: true,
    complianceReady: top ? !top.failedGates.includes("compliance") : false,
    dataFresh: top ? !top.failedGates.includes("dataFreshness") : false,
    contractKnown: true,
    isWrite: true,
    userConfirmed: false,
  };
  const sentinel = reviewAction(proposedAction, policy);

  return {
    goal: payload.goal || "Unspecified goal",
    network: payload.network || "unknown",
    wallet: payload.wallet || "unknown",
    decision: top?.decision || "reject",
    topCandidate: top,
    scores,
    sentinel,
    artifacts: buildArtifacts(payload, top, sentinel),
  };
}

function buildArtifacts(payload, top, sentinel) {
  return {
    tradeCreditReport: {
      strategy: top?.name || "No candidate selected",
      score: top?.total ?? 0,
      expectedReturn: payload.targetReturn || "User-defined target; verify with live data.",
      liquidityPlan: payload.liquidityNeed || "Not provided",
      status: top?.decision || "reject",
    },
    complianceReceipt: {
      status: sentinel.reasons.some((reason) => reason.toLowerCase().includes("compliance")) ? "failed" : "pending_or_pass",
      notes: payload.complianceRequirements || [],
      privacy: "Prefer ZK/privacy-preserving attestations when available.",
    },
    accountabilityLedger: {
      yieldAgent: "Ranks sustainable return, rejects unrealistic APY.",
      riskAgent: "Stress tests capital preservation and liquidity.",
      complianceAgent: "Blocks unknown or missing KYC/AML/RWA gates.",
      bridgeAgent: "Flags cross-chain route, fee, and finality assumptions.",
      marketAgent: "Penalizes stale market data.",
      memoryAgent: "Penalizes repeated mistakes such as chasing headline APY.",
      sentinelShield: sentinel.decision,
    },
    mistakeMemory: {
      lesson: "Do not execute RealFi strategies when data freshness, compliance, or user confirmation gates are unresolved.",
      monitor: ["APY source", "exit liquidity", "compliance status", "bridge health", "oracle freshness"],
    },
  };
}

export function renderCouncilMarkdown(result) {
  const top = result.topCandidate;
  const lines = [
    "# Pharos Atlas Council Report",
    "",
    `Goal: ${result.goal}`,
    `Network: ${result.network}`,
    `Wallet: ${result.wallet}`,
    "",
    "## Decision Summary",
    "",
    `Council decision: ${result.decision}`,
    `Top candidate: ${top ? `${top.name} (${top.total}/100)` : "none"}`,
    `Sentinel Shield: ${result.sentinel.decision}`,
    "",
    "## Sentinel Reasons",
    "",
    ...(result.sentinel.reasons.length ? result.sentinel.reasons.map((reason) => `- BLOCK: ${reason}`) : ["- No blocking reasons."]),
    ...(result.sentinel.warnings.length ? result.sentinel.warnings.map((warning) => `- WARNING: ${warning}`) : []),
    "",
    "## Candidate Scores",
    "",
    ...result.scores.map((score) => `- ${score.name}: ${score.total}/100 - ${score.decision}`),
    "",
    "## Trade Credit Report",
    "",
    `Strategy: ${result.artifacts.tradeCreditReport.strategy}`,
    `Liquidity plan: ${result.artifacts.tradeCreditReport.liquidityPlan}`,
    "",
    "## Compliance Receipt",
    "",
    `Status: ${result.artifacts.complianceReceipt.status}`,
    `Privacy note: ${result.artifacts.complianceReceipt.privacy}`,
    "",
    "## Mistake Memory",
    "",
    result.artifacts.mistakeMemory.lesson,
  ];
  return lines.join("\n");
}

export { DEFAULT_POLICY, CATEGORY_WEIGHTS };
