import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  Wallet, 
  ArrowRight,
  Check,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { BountyTicket, ConnectedWallet } from '../types.js';
import { handleImageError } from '../utils/imageFallback.js';

interface WorkerVerificationProps {
  bounties: BountyTicket[];
  selectedTicket: BountyTicket | null;
  onSelectTicket: (ticket: BountyTicket | null) => void;
  wallet: ConnectedWallet;
  onOpenWalletModal: () => void;
  onBountyResolved: (updatedTicket: BountyTicket) => void;
  onNavigateBounties?: () => void;
}

const REPAIR_PRESETS = [
  {
    id: 'fix-pothole',
    name: 'Asphalt Filled & Compacted Flat',
    imageUrl: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=800&q=80',
    description: 'Hot asphalt poured, flattened level with the street, and edges sealed.',
  },
  {
    id: 'fix-streetlight',
    name: 'New LED Street Light Bulb',
    imageUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
    description: 'New high-efficiency LED bulb installed and safety wiring checked.',
  },
  {
    id: 'fix-water',
    name: 'New Pipe Clamp & Paved Road',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'Underground water pipe securely clamped and road resealed.',
  },
];

export const WorkerVerification: React.FC<WorkerVerificationProps> = ({
  bounties,
  selectedTicket,
  onSelectTicket,
  wallet,
  onOpenWalletModal,
  onBountyResolved,
  onNavigateBounties,
}) => {
  const activeBounties = bounties.filter(b => b.status === 'ESCROW_LOCKED');
  const currentTicket = selectedTicket || activeBounties[0] || null;

  const [afterImage, setAfterImage] = useState<string>(REPAIR_PRESETS[0].imageUrl);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(REPAIR_PRESETS[0].id);
  const [workerAddress, setWorkerAddress] = useState<string>(wallet.address || '7M8K9L0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9J0K1L2M');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync worker address when wallet connects
  useEffect(() => {
    if (wallet.address) {
      setWorkerAddress(wallet.address);
    }
  }, [wallet.address]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAfterImage(reader.result);
        setSelectedPresetId('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof REPAIR_PRESETS[0]) => {
    setAfterImage(preset.imageUrl);
    setSelectedPresetId(preset.id);
  };

  // Run AI Verification & Release Escrow
  const handleVerifyAndRelease = async () => {
    if (!currentTicket) return;
    if (!workerAddress) {
      setErrorMessage('Please enter or connect your Algorand address to receive your payout.');
      return;
    }

    setIsAuditing(true);
    setErrorMessage('');
    setAuditResult(null);

    try {
      const response = await fetch('/api/escrow/verify-and-release', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: currentTicket.id,
          workerAddress,
          afterImageUrl: afterImage,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Verification failed. Please ensure the repair is completed.');
      }

      setAuditResult(data);
      onBountyResolved(data.ticket);

      // Confetti Celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#10b981', '#34d399', '#a855f7', '#fbbf24'],
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Verification and payout failed');
    } finally {
      setIsAuditing(false);
    }
  };

  if (!currentTicket) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 rounded-3xl bg-[#0c0e15] border border-white/5 text-center space-y-4 shadow-xl"
        >
          <Wrench className="w-12 h-12 text-purple-400 mx-auto" />
          <h2 className="font-display text-2xl font-bold text-white">No Open Bounties Right Now</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            All current issues have been fixed and paid out! Report a new issue to create the next reward.
          </p>
          {onNavigateBounties && (
            <button
              onClick={onNavigateBounties}
              className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              Browse All Bounties
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  const beforeImg = currentTicket.beforeImageUrl || (currentTicket as any).imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono-code text-xs uppercase tracking-widest text-emerald-400 font-bold">
            WORKER PAYOUT STATION
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Submit Repair & Get Paid
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl font-light mt-1">
          Upload photo proof of the finished repair. Google Gemini AI inspects the quality, and Algorand automatically releases the cash bounty to your wallet!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Ticket Selection & Before vs After Comparison (7 cols) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7 space-y-6"
        >
          
          {/* Active Ticket Selector Bar */}
          <div className="p-4 rounded-3xl bg-[#0c0e15] border border-white/5 space-y-3 shadow-md">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Choose Issue to Fix:</span>
              <span className="font-mono-code text-xs text-purple-300 font-bold">
                Reward: {currentTicket.bountyAlgo.toFixed(2)} ALGO
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {activeBounties.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    onSelectTicket(b);
                    setAuditResult(null);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-mono-code whitespace-nowrap transition-all border cursor-pointer ${
                    b.id === currentTicket.id
                      ? 'bg-purple-950/70 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{b.id} • {b.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dual Visual Inspection Box: BEFORE vs AFTER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* BEFORE PHOTO CARD */}
            <div className="rounded-3xl bg-[#0c0e15] border border-white/10 p-4 space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> 1. BEFORE (Broken)
                </span>
                <span className="text-slate-400">Score {currentTicket.severityScore}/100</span>
              </div>

              <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={beforeImg}
                  alt="Before repair"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, currentTicket.title, currentTicket.category, false)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 text-[10px] font-mono-code bg-black/80 px-2 py-0.5 rounded text-rose-300">
                  {currentTicket.title}
                </div>
              </div>

              <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                {currentTicket.description}
              </p>
            </div>

            {/* AFTER PHOTO CARD */}
            <div className="rounded-3xl bg-[#0c0e15] border border-emerald-500/30 p-4 space-y-3 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 2. AFTER (Repaired)
                </span>
                <span className="text-emerald-400 font-semibold">Proof Photo</span>
              </div>

              <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-900 group">
                <img
                  src={afterImage}
                  alt="After repair"
                  referrerPolicy="no-referrer"
                  onError={(e) => handleImageError(e, 'Completed Repair', currentTicket.category, true)}
                  className="w-full h-full object-cover"
                />

                {/* Upload Button */}
                <label
                  htmlFor="worker-proof-upload"
                  className="absolute bottom-2 right-2 px-3 py-1.5 rounded-xl bg-black/80 hover:bg-black text-[11px] font-semibold text-white backdrop-blur-md cursor-pointer border border-white/15 transition-all flex items-center gap-1.5 shadow"
                >
                  <Upload className="w-3 h-3 text-emerald-400" />
                  <span>Upload Photo</span>
                </label>
                <input
                  id="worker-proof-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <p className="text-slate-400 text-xs line-clamp-2 font-light leading-relaxed">
                Repaired flush to surface, safe for pedestrians & drivers.
              </p>
            </div>

          </div>

          {/* Quick Repair Proof Presets */}
          <div className="p-4 rounded-3xl bg-[#0c0e15] border border-white/5 space-y-3 shadow-md">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Or Choose a Sample Fixed Photo to Test:</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {REPAIR_PRESETS.map((p) => {
                const isSelected = selectedPresetId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/50 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs font-bold block truncate text-slate-200">
                      {p.name}
                    </span>
                    <span className="text-[10px] font-mono-code text-emerald-400/90 mt-0.5 block">
                      Click to Test
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </motion.div>

        {/* Right Column: Worker Address & Autonomous Escrow Release (5 cols) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-5 space-y-6"
        >
          
          <div className="p-6 rounded-3xl bg-[#0c0e15] border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.25)] space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-white">
                    Payout Destination
                  </h3>
                  <span className="text-[10px] font-mono-code text-purple-400">
                    Direct Algorand Escrow Release
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40">
                {currentTicket.id}
              </span>
            </div>

            {/* Payout Recipient Address */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Your Algorand Payout Wallet:</span>
                {wallet.isConnected && (
                  <span className="text-[10px] font-mono-code text-emerald-400 flex items-center gap-1 font-bold">
                    <Check className="w-3 h-3" /> Pera Connected
                  </span>
                )}
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={workerAddress}
                  onChange={(e) => setWorkerAddress(e.target.value)}
                  placeholder="Algorand testnet address..."
                  className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-emerald-500 font-mono-code text-xs text-slate-200 outline-none truncate transition-colors"
                />
              </div>

              {!wallet.isConnected && (
                <button
                  type="button"
                  onClick={onOpenWalletModal}
                  className="text-[11px] font-mono-code text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Wallet className="w-3 h-3" />
                  <span>Connect Pera Wallet</span>
                </button>
              )}
            </div>

            {/* Escrow Release Summary Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0e1217] to-[#0a0b10] border border-emerald-500/30 space-y-2 font-mono-code text-xs">
              <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">
                Cash Bounty to Receive:
              </span>

              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-white">
                  {currentTicket.bountyAlgo.toFixed(2)} <span className="text-emerald-400 text-base">ALGO</span>
                </span>
                <span className="text-xs text-slate-400">
                  ≈ {currentTicket.bountyMicroAlgos.toLocaleString()} µAlgo
                </span>
              </div>

              <div className="text-[10px] text-slate-400 border-t border-white/5 pt-2 flex items-center justify-between">
                <span>Passing Quality Score: 80/100</span>
                <span className="text-emerald-400">Instant Release (~3.2s)</span>
              </div>
            </div>

            {/* Audit Trigger Button */}
            {!auditResult ? (
              <button
                id="run-worker-audit-btn"
                type="button"
                onClick={handleVerifyAndRelease}
                disabled={isAuditing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAuditing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Gemini AI Checking Repair Quality...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Verify Repair & Claim Cashout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              /* Success Payout Outcome */
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 shadow-lg"
              >
                
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono-code">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Success! {auditResult.payout?.amountAlgo || currentTicket.bountyAlgo} ALGO Sent to Wallet</span>
                </div>

                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {auditResult.verificationReport?.verdict || 'Repair verified and approved by Gemini AI.'}
                </p>

                {/* Score gauge */}
                <div className="flex items-center justify-between text-xs font-mono-code p-2.5 rounded-xl bg-black/60">
                  <span className="text-slate-400">Quality Score:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {auditResult.verificationReport?.score || 94} / 100
                  </span>
                </div>

                {/* Payout LoRA link */}
                {auditResult.payout?.loraExplorerUrl && (
                  <a
                    href={auditResult.payout.loraExplorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-900/50 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 text-xs font-mono-code font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                  >
                    <span>View Payout on LoRA Explorer</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

              </motion.div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

          </div>

        </motion.div>

      </div>

    </div>
  );
};
