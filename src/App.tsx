import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar.js';
import { LandingPage } from './components/LandingPage.js';
import { AiSeverityAssessment } from './components/AiSeverityAssessment.js';
import { ActiveBounties } from './components/ActiveBounties.js';
import { WorkerVerification } from './components/WorkerVerification.js';
import { LoraExplorerFeed } from './components/LoraExplorerFeed.js';
import { ArchitectureDocs } from './components/ArchitectureDocs.js';
import { PeraWalletModal } from './components/PeraWalletModal.js';
import { X402PaymentModal } from './components/X402PaymentModal.js';
import { Footer } from './components/Footer.js';
import { connectPeraWallet } from './services/pera.js';
import { 
  BountyTicket, 
  ConnectedWallet, 
  X402Challenge, 
  X402PaymentResponse 
} from './types.js';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [bounties, setBounties] = useState<BountyTicket[]>([]);
  const [selectedTicketForRepair, setSelectedTicketForRepair] = useState<BountyTicket | null>(null);

  // Wallet State - initially disconnected
  const [wallet, setWallet] = useState<ConnectedWallet>({
    address: '',
    balanceAlgo: 0,
    balanceMicroAlgos: 0,
    walletType: 'NONE',
    isConnected: false,
    network: 'algorand-testnet',
  });

  // Modal States
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isX402ModalOpen, setIsX402ModalOpen] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<X402Challenge | null>(null);
  const [raw402Headers, setRaw402Headers] = useState<Record<string, string>>({});
  const [pendingDraft, setPendingDraft] = useState<any>(null);

  // Algorand Testnet telemetry
  const [testnetRound, setTestnetRound] = useState<number>(42891240);
  const [isNodeOnline, setIsNodeOnline] = useState<boolean>(true);
  const [totalAlgoLocked, setTotalAlgoLocked] = useState<number>(7.20);

  // Fetch initial bounties & testnet status
  const fetchBounties = async () => {
    try {
      const res = await fetch('/api/bounties');
      const data = await res.json();
      if (data.bounties) {
        setBounties(data.bounties);
      }
    } catch (e) {
      console.warn('Failed to fetch bounties:', e);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/algorand/status');
      const data = await res.json();
      if (data.lastRound) {
        setTestnetRound(data.lastRound);
        setIsNodeOnline(data.online);
        if (data.totalAlgoLocked !== undefined) {
          setTotalAlgoLocked(data.totalAlgoLocked);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch status:', e);
    }
  };

  useEffect(() => {
    fetchBounties();
    fetchStatus();
    const interval = setInterval(() => {
      fetchStatus();
      setTestnetRound(prev => prev + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Connect Pera Wallet using the official @perawallet/connect bridge
  const handleConnectPera = async () => {
    try {
      const connected = await connectPeraWallet();
      if (connected) {
        setWallet(connected);
      }
    } catch (err) {
      console.error('Failed to connect Pera wallet:', err);
    }
  };

  // Intercept HTTP 402 Challenge from the AI Severity component
  const handleTriggerX402Challenge = (challengeResponse: X402PaymentResponse, draft: any) => {
    setActiveChallenge(challengeResponse.challenge);
    setRaw402Headers(challengeResponse.rawHeaders || {
      'WWW-Authenticate': `x402 realm="AutoShield Escrow Gate", network="algorand-testnet", address="${challengeResponse.challenge.payTo}", amount="${challengeResponse.challenge.amountMicroAlgos}"`,
      'X-402-Payment-Request': JSON.stringify(challengeResponse.challenge),
    });
    setPendingDraft(draft);
    setIsX402ModalOpen(true);
  };

  // When x402 payment completes and unlocks the ticket
  const handlePaymentSuccess = (newTicket: BountyTicket) => {
    setBounties(prev => [newTicket, ...prev]);
    fetchStatus();
  };

  // When worker claims a bounty from Bounties tab or landing page
  const handleSelectForRepair = (ticket: BountyTicket) => {
    setSelectedTicketForRepair(ticket);
    setActiveTab('worker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When bounty is resolved and paid
  const handleBountyResolved = (updatedTicket: BountyTicket) => {
    setBounties(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    fetchStatus();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07080a] text-slate-100 selection:bg-purple-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onConnectPera={handleConnectPera}
        testnetRound={testnetRound}
        isNodeOnline={isNodeOnline}
      />

      {/* Main Content Areas with Smooth Page Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <LandingPage
                onNavigate={handleTabChange}
                onSelectForRepair={handleSelectForRepair}
                totalAlgoLocked={totalAlgoLocked}
                activeBounties={bounties}
                testnetRound={testnetRound}
              />
            </motion.div>
          )}

          {activeTab === 'report' && (
            <motion.div
              key="report"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <AiSeverityAssessment
                wallet={wallet}
                onOpenWalletModal={() => setIsWalletModalOpen(true)}
                onTriggerX402Challenge={handleTriggerX402Challenge}
              />
            </motion.div>
          )}

          {activeTab === 'bounties' && (
            <motion.div
              key="bounties"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ActiveBounties
                bounties={bounties}
                onSelectForRepair={handleSelectForRepair}
                onRefresh={fetchBounties}
                onNavigateReport={() => handleTabChange('report')}
              />
            </motion.div>
          )}

          {activeTab === 'worker' && (
            <motion.div
              key="worker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <WorkerVerification
                bounties={bounties}
                selectedTicket={selectedTicketForRepair}
                onSelectTicket={setSelectedTicketForRepair}
                wallet={wallet}
                onOpenWalletModal={() => setIsWalletModalOpen(true)}
                onBountyResolved={handleBountyResolved}
                onNavigateBounties={() => handleTabChange('bounties')}
              />
            </motion.div>
          )}

          {activeTab === 'explorer' && (
            <motion.div
              key="explorer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <LoraExplorerFeed onRefresh={fetchStatus} />
            </motion.div>
          )}

          {activeTab === 'architecture' && (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <ArchitectureDocs />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Small, Clean Footer */}
      <Footer
        onNavigate={handleTabChange}
        testnetRound={testnetRound}
        isNodeOnline={isNodeOnline}
        totalAlgoLocked={totalAlgoLocked}
      />

      {/* Pera Wallet Modal */}
      <PeraWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        setWallet={setWallet}
      />

      {/* x402 HTTP 402 Payment Challenge Modal */}
      <X402PaymentModal
        isOpen={isX402ModalOpen}
        onClose={() => setIsX402ModalOpen(false)}
        challenge={activeChallenge}
        rawHeaders={raw402Headers}
        ticketDraft={pendingDraft}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
}
