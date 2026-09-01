import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  getAlgodClient, 
  getEscrowAccount, 
  getTestnetStatus, 
  verifyOnChainTransaction, 
  releaseEscrowPayout, 
  getLoraTransactionUrl, 
  getLoraAccountUrl,
  X402_FACILITATOR_URL,
  ALGOD_SERVER
} from './src/services/algorand.js';
import { assessInfrastructureIssue, verifyRepairCompletion } from './src/services/gemini.js';
import { 
  BountyTicket, 
  X402Challenge, 
  AlgorandTransactionRecord 
} from './src/types.js';

const app = express();
const PORT = 3000;

// Body parser middleware with large payload limit for image data
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-memory persistent state for demo & runtime
const activeChallenges = new Map<string, X402Challenge>();
const tickets: BountyTicket[] = [];
const transactionLedger: AlgorandTransactionRecord[] = [];

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AutoShield Agentic x402 Engine',
    network: 'algorand-testnet',
    timestamp: Date.now()
  });
});

// Algorand node status & facilitator telemetry
app.get('/api/algorand/status', async (req, res) => {
  try {
    const status = await getTestnetStatus();
    const escrowAddr = String(getEscrowAccount().addr);
    res.json({
      ...status,
      escrowAddress: escrowAddr,
      escrowLoraUrl: getLoraAccountUrl(escrowAddr),
      totalLockedBounties: tickets.filter(t => t.status === 'ESCROW_LOCKED').length,
      totalPaidBounties: tickets.filter(t => t.status === 'RESOLVED_AND_PAID').length,
      totalAlgoLocked: tickets
        .filter(t => t.status === 'ESCROW_LOCKED')
        .reduce((sum, t) => sum + t.bountyAlgo, 0),
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to fetch status' });
  }
});

// Escrow & Facilitator configuration
app.get('/api/escrow/info', (req, res) => {
  const escrowAddr = String(getEscrowAccount().addr);
  res.json({
    escrowAddress: escrowAddr,
    network: 'algorand-testnet',
    assetId: 0,
    algodNode: ALGOD_SERVER,
    facilitatorUrl: X402_FACILITATOR_URL,
    loraAccountUrl: getLoraAccountUrl(escrowAddr),
    minBountyMicroAlgos: 500000,
  });
});

// AI Infrastructure Severity Assessment endpoint
app.post('/api/infrastructure/assess', async (req, res) => {
  try {
    const { image, category, notes } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image is required for AI infrastructure inspection' });
    }

    const assessment = await assessInfrastructureIssue(image, category, notes);
    res.json({
      success: true,
      assessment,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Assessment failed' });
  }
});

// -------------------------------------------------------------
// CORE HTTP 402 PAYMENT GATE (x402-avm Protocol Endpoint)
// -------------------------------------------------------------
app.post('/api/infrastructure/submit-ticket', async (req, res) => {
  try {
    const escrowAddr = String(getEscrowAccount().addr);
    const { 
      title, 
      category, 
      description, 
      severityLevel, 
      severityScore, 
      bountyAlgo, 
      bountyMicroAlgos, 
      beforeImageUrl, 
      location, 
      reporterAddress 
    } = req.body;

    const microAlgos = Number(bountyMicroAlgos || Math.round((bountyAlgo || 1.5) * 1_000_000));
    const algoAmount = microAlgos / 1_000_000;

    // Check payment authentication headers:
    // 1. Authorization: x402 txId=...,challengeId=...
    // 2. X-402-Authorization: ...
    // 3. X-Payment-Signature: <txId>
    const authHeader = req.headers['authorization'] || req.headers['x-402-authorization'] || req.headers['x-payment-signature'] as string;

    let providedTxId: string | null = null;
    let providedChallengeId: string | null = null;

    if (authHeader) {
      const authStr = Array.isArray(authHeader) ? authHeader[0] : authHeader;
      if (authStr.startsWith('x402 ') || authStr.startsWith('Bearer x402:')) {
        const parts = authStr.replace(/^(x402 |Bearer x402:)/, '').split(',');
        for (const p of parts) {
          const [k, v] = p.trim().split('=');
          if (k === 'txId') providedTxId = v;
          if (k === 'challengeId') providedChallengeId = v;
        }
      } else if (authStr.length >= 32) {
        providedTxId = authStr;
      }
    }

    // Also check body payload fallback if passed directly
    if (!providedTxId && req.body.paymentTxId) {
      providedTxId = req.body.paymentTxId;
      providedChallengeId = req.body.challengeId;
    }

    // IF NO PAYMENT PROOF -> RETURN STRICT HTTP 402 PAYMENT REQUIRED!
    if (!providedTxId) {
      const challengeId = `ch_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const challenge: X402Challenge = {
        challengeId,
        resource: '/api/infrastructure/submit-ticket',
        payTo: escrowAddr,
        amountAlgo: algoAmount,
        amountMicroAlgos: microAlgos,
        assetId: 0,
        network: 'algorand-testnet',
        facilitatorUrl: X402_FACILITATOR_URL,
        note: `x402:autoshield:bounty:${challengeId}`,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
        createdAt: Date.now(),
      };

      activeChallenges.set(challengeId, challenge);

      // Construct x402-avm standard headers
      const authenticateHeader = `x402 realm="AutoShield Escrow Gate", network="algorand-testnet", address="${escrowAddr}", amount="${microAlgos}", asset_id="0", facilitator="${X402_FACILITATOR_URL}", challenge_id="${challengeId}", memo="${challenge.note}"`;
      
      res.setHeader('WWW-Authenticate', authenticateHeader);
      res.setHeader('X-402-Payment-Request', JSON.stringify(challenge));
      res.setHeader('Access-Control-Expose-Headers', 'WWW-Authenticate, X-402-Payment-Request');

      return res.status(402).json({
        error: 'Payment Required',
        status: 402,
        message: 'x402 Autonomous Gate: Initializing on-chain Escrow Bounty requires micro-payment authorization on Algorand Testnet.',
        challenge,
        rawHeaders: {
          'WWW-Authenticate': authenticateHeader,
          'X-402-Payment-Request': JSON.stringify(challenge),
        },
      });
    }

    // IF PAYMENT HEADER IS PRESENT -> VERIFY ON-CHAIN
    console.log(`🔍 Verifying x402 payment TxId: ${providedTxId} for amount: ${microAlgos} microAlgos`);
    const verification = await verifyOnChainTransaction(providedTxId, escrowAddr, microAlgos);

    if (!verification.verified) {
      return res.status(402).json({
        error: 'Payment Verification Failed',
        status: 402,
        message: verification.error || 'Provided Algorand transaction hash is invalid or unconfirmed.',
      });
    }

    // Payment Verified! Generate the official Bounty Ticket
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: BountyTicket = {
      id: ticketId,
      title: title || 'Reported Infrastructure Defect',
      category: category || 'POTHOLE',
      description: description || 'Hazard analyzed and secured by x402 escrow payment.',
      severityLevel: severityLevel || 'HIGH',
      severityScore: Number(severityScore || 75),
      location: location || { address: 'Urban Sector 7, Civic Center', lat: 37.7749, lng: -122.4194 },
      beforeImageUrl: beforeImageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      bountyAlgo: algoAmount,
      bountyMicroAlgos: microAlgos,
      reporterAddress: reporterAddress || 'PERA-CONNECTED-USER-ADDRESS',
      status: 'ESCROW_LOCKED',
      creationTxId: providedTxId,
      creationRound: verification.round || 42891250,
      createdAt: Date.now(),
    };

    tickets.unshift(newTicket);

    // Record in transaction ledger
    const txRecord: AlgorandTransactionRecord = {
      txId: providedTxId,
      type: 'ESCROW_DEPOSIT',
      sender: reporterAddress || 'COMMUNITY_REPORTER',
      receiver: escrowAddr,
      amountAlgo: algoAmount,
      amountMicroAlgos: microAlgos,
      feeMicroAlgos: 1000,
      confirmedRound: verification.round || 42891250,
      timestamp: Date.now(),
      note: `x402:autoshield:deposit:${ticketId}`,
      loraExplorerUrl: getLoraTransactionUrl(providedTxId),
      ticketId,
    };
    transactionLedger.unshift(txRecord);

    return res.status(200).json({
      success: true,
      status: 200,
      message: 'x402 Payment Verified! Escrow bounty locked on Algorand Testnet.',
      ticket: newTicket,
      loraExplorerUrl: getLoraTransactionUrl(providedTxId),
      transaction: txRecord,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Server error processing ticket' });
  }
});

// GoPlausible Facilitator Settlement Endpoint (Simulated / Facilitator Relay)
app.post('/api/facilitator/settle', async (req, res) => {
  try {
    const { challengeId, payerAddress, signedTxnBytes } = req.body;
    const challenge = activeChallenges.get(challengeId);
    const escrowAddr = String(getEscrowAccount().addr);

    const randomTxId = Array.from({ length: 52 }, () => Math.floor(Math.random() * 36).toString(36).toUpperCase()).join('').slice(0, 52);
    const round = 42891300 + Math.floor(Math.random() * 50);

    const txRecord: AlgorandTransactionRecord = {
      txId: randomTxId,
      type: 'FACILITATOR_SETTLEMENT',
      sender: payerAddress || '0xGOPLAUSIBLE_FACILITATOR_RELAY',
      receiver: challenge ? String(challenge.payTo) : escrowAddr,
      amountAlgo: challenge?.amountAlgo || 1.5,
      amountMicroAlgos: challenge?.amountMicroAlgos || 1500000,
      feeMicroAlgos: 1000,
      confirmedRound: round,
      timestamp: Date.now(),
      note: `x402:goplausible:settlement:${challengeId}`,
      loraExplorerUrl: getLoraTransactionUrl(randomTxId),
    };

    transactionLedger.unshift(txRecord);

    res.json({
      success: true,
      facilitator: 'GoPlausible x402 Facilitator (Algorand Testnet)',
      txId: randomTxId,
      round,
      loraExplorerUrl: getLoraTransactionUrl(randomTxId),
      status: 'CONFIRMED',
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Facilitator settlement failed' });
  }
});

// Get all tickets
app.get('/api/bounties', (req, res) => {
  res.json({
    bounties: tickets,
    totalCount: tickets.length,
    activeCount: tickets.filter(t => t.status === 'ESCROW_LOCKED').length,
    completedCount: tickets.filter(t => t.status === 'RESOLVED_AND_PAID').length,
  });
});

// Autonomous Escrow Verification and Payout Loop
app.post('/api/escrow/verify-and-release', async (req, res) => {
  try {
    const { ticketId, workerAddress, afterImageUrl } = req.body;

    if (!ticketId || !workerAddress || !afterImageUrl) {
      return res.status(400).json({ error: 'ticketId, workerAddress, and afterImageUrl are required' });
    }

    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.status === 'RESOLVED_AND_PAID') {
      return res.status(400).json({ error: 'Bounty has already been resolved and paid.' });
    }

    // Run AI Agentic Repair Inspection
    const verificationReport = await verifyRepairCompletion(
      ticket.beforeImageUrl,
      afterImageUrl,
      ticket.title,
      ticket.category
    );

    if (!verificationReport.passed) {
      return res.status(422).json({
        success: false,
        message: 'Repair quality did not satisfy agentic verification standards (Score < 80).',
        verificationReport,
      });
    }

    // Trigger Autonomous Escrow Payout on Algorand Testnet!
    const payoutResult = await releaseEscrowPayout(workerAddress, ticket.bountyMicroAlgos, ticket.id);

    // Update ticket state
    ticket.status = 'RESOLVED_AND_PAID';
    ticket.workerAddress = workerAddress;
    ticket.afterImageUrl = afterImageUrl;
    ticket.releaseTxId = payoutResult.txId;
    ticket.releaseRound = payoutResult.round;
    ticket.resolvedAt = Date.now();
    ticket.verificationReport = verificationReport;

    // Record in ledger
    const escrowAddr = String(getEscrowAccount().addr);
    const txRecord: AlgorandTransactionRecord = {
      txId: payoutResult.txId,
      type: 'BOUNTY_RELEASE_PAYOUT',
      sender: escrowAddr,
      receiver: workerAddress,
      amountAlgo: ticket.bountyAlgo,
      amountMicroAlgos: ticket.bountyMicroAlgos,
      feeMicroAlgos: 1000,
      confirmedRound: payoutResult.round,
      timestamp: Date.now(),
      note: `x402:autoshield:release:${ticket.id}`,
      loraExplorerUrl: payoutResult.loraUrl,
      ticketId: ticket.id,
    };
    transactionLedger.unshift(txRecord);

    res.json({
      success: true,
      message: 'Agentic Verification Passed! Escrow bounty released to worker on Algorand Testnet.',
      verificationReport,
      payout: {
        txId: payoutResult.txId,
        round: payoutResult.round,
        amountAlgo: ticket.bountyAlgo,
        workerAddress,
        loraExplorerUrl: payoutResult.loraUrl,
      },
      ticket,
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Escrow release failed' });
  }
});

// Transaction explorer endpoint
app.get('/api/explorer/transactions', (req, res) => {
  res.json({
    transactions: transactionLedger,
    totalCount: transactionLedger.length,
    testnetExplorer: 'https://lora.algokit.io/testnet',
  });
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛡️ AutoShield Backend active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
