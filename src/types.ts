export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type BountyStatus = 
  | 'PENDING_PAYMENT_402'
  | 'ESCROW_LOCKED'
  | 'IN_PROGRESS'
  | 'PENDING_VERIFICATION'
  | 'RESOLVED_AND_PAID'
  | 'REJECTED';

export interface InfrastructureIssueAssessment {
  category: 'POTHOLE' | 'STREETLIGHT' | 'GUARDRAIL' | 'WATER_LEAK' | 'ELECTRICAL' | 'OTHER';
  title: string;
  description: string;
  severityLevel: SeverityLevel;
  severityScore: number; // 0 - 100
  structuralRisk: string;
  recommendedAction: string;
  estimatedFixTimeDays: number;
  bountyAlgo: number; // e.g. 1.25 ALGO
  bountyMicroAlgos: number; // e.g. 1250000
  urgencyMultiplier: number;
  detectedHazards: string[];
}

export interface X402Challenge {
  challengeId: string;
  resource: string;
  payTo: string; // Algorand Testnet Escrow Address
  amountAlgo: number;
  amountMicroAlgos: number;
  assetId: number; // 0 for ALGO
  network: 'algorand-testnet';
  facilitatorUrl: string;
  note: string;
  expiresAt: number;
  createdAt: number;
}

export interface X402PaymentResponse {
  error: string;
  status: 402;
  message: string;
  challenge: X402Challenge;
  rawHeaders: Record<string, string>;
}

export interface BountyTicket {
  id: string;
  title: string;
  category: string;
  description: string;
  severityLevel: SeverityLevel;
  severityScore: number;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  beforeImageUrl: string;
  afterImageUrl?: string;
  bountyAlgo: number;
  bountyMicroAlgos: number;
  reporterAddress: string;
  workerAddress?: string;
  status: BountyStatus;
  creationTxId: string;
  releaseTxId?: string;
  creationRound?: number;
  releaseRound?: number;
  createdAt: number;
  resolvedAt?: number;
  verificationReport?: {
    score: number;
    passed: boolean;
    verdict: string;
    improvementsDetected: string[];
    hazardsRemaining: string[];
  };
}

export interface AlgorandTransactionRecord {
  txId: string;
  type: 'X402_FEE_PAYMENT' | 'ESCROW_DEPOSIT' | 'BOUNTY_RELEASE_PAYOUT' | 'FACILITATOR_SETTLEMENT';
  sender: string;
  receiver: string;
  amountAlgo: number;
  amountMicroAlgos: number;
  feeMicroAlgos: number;
  confirmedRound: number;
  timestamp: number;
  note: string;
  loraExplorerUrl: string;
  ticketId?: string;
}

export interface ConnectedWallet {
  address: string;
  balanceAlgo: number;
  balanceMicroAlgos: number;
  walletType: 'PERA_WALLET' | 'TESTNET_GENERATED' | 'CUSTOM_MNEMONIC';
  isConnected: boolean;
  network: 'algorand-testnet';
}
