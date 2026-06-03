export type CandidateGates = {
  compliance?: boolean;
  risk?: boolean;
  execution?: boolean;
  userConstraints?: boolean;
  dataFreshness?: boolean;
  [key: string]: boolean | undefined;
};

export type StrategyCandidate = {
  name?: string;
  yieldQuality?: number;
  capitalPreservation?: number;
  liquidity?: number;
  complianceReadiness?: number;
  executionSafety?: number;
  marketTiming?: number;
  councilConsensus?: number;
  memoryPenalty?: number;
  gates?: CandidateGates;
  notes?: string;
};

export type ScoredCandidate = {
  name: string;
  total: number;
  decision: "recommend" | "conditional_recommend" | "watchlist" | "reject";
  failedGates: string[];
  notes: string;
};

export type SentinelAction = {
  type?: string;
  network?: string;
  amount?: string | number;
  amountUsd?: string | number;
  contractKnown?: boolean;
  requiresCompliance?: boolean;
  complianceReady?: boolean;
  dataFresh?: boolean;
  isWrite?: boolean;
  userConfirmed?: boolean;
  [key: string]: unknown;
};

export type SentinelPolicy = {
  allowedNetworks?: string[];
  mainnetRequiresConfirmation?: boolean;
  maxTransferUsd?: number;
  maxStrategyAllocationUsd?: number;
  unknownContractAction?: "block" | "escalate";
  requireComplianceForRwa?: boolean;
  requireFreshDataForExecution?: boolean;
  requireUserConfirmationForWrites?: boolean;
  blockedActions?: string[];
};

export type SentinelReview = {
  decision: "approve" | "block" | "escalate";
  reasons: string[];
  warnings: string[];
  policy: Required<SentinelPolicy>;
};

export type CouncilPayload = {
  goal?: string;
  network?: string;
  wallet?: string;
  capitalAmount?: string;
  targetReturn?: string;
  riskTolerance?: string;
  liquidityNeed?: string;
  complianceRequirements?: string[];
  candidates?: StrategyCandidate[];
  proposedAction?: SentinelAction;
  policy?: SentinelPolicy;
};

export function scoreCandidate(candidate: StrategyCandidate): ScoredCandidate;
export function scoreStrategies(payload: CouncilPayload | StrategyCandidate[]): ScoredCandidate[];
export function reviewAction(action: SentinelAction, policy?: SentinelPolicy): SentinelReview;
export function runCouncil(payload: CouncilPayload, policy?: SentinelPolicy): unknown;
export function renderCouncilMarkdown(result: unknown): string;
export const DEFAULT_POLICY: Required<SentinelPolicy>;
export const CATEGORY_WEIGHTS: Record<string, number>;
