import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Lock, 
  ArrowRight 
} from 'lucide-react';

export const ArchitectureDocs: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const curlChallengeSnippet = `curl -i -X POST http://localhost:3000/api/infrastructure/submit-ticket \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Grade-4 Arterial Road Pothole",
    "category": "POTHOLE",
    "bountyAlgo": 1.50,
    "bountyMicroAlgos": 1500000
  }'

# Response:
# HTTP/1.1 402 Payment Required
# WWW-Authenticate: x402 realm="AutoShield Escrow Gate", network="algorand-testnet", address="4K7VZY...", amount="1500000", asset_id="0", facilitator="https://facilitator.goplausible.xyz"
# X-402-Payment-Request: {"challengeId":"ch_172518...","payTo":"4K7VZY...","amountMicroAlgos":1500000,"network":"algorand-testnet"}`;

  const curlUnlockSnippet = `curl -i -X POST http://localhost:3000/api/infrastructure/submit-ticket \\
  -H "Content-Type: application/json" \\
  -H "Authorization: x402 txId=2H7K4J5L8M9N0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9J,challengeId=ch_172518..." \\
  -d '{
    "title": "Grade-4 Arterial Road Pothole",
    "category": "POTHOLE",
    "bountyAlgo": 1.50
  }'

# Response:
# HTTP/1.1 200 OK
# {"success":true,"message":"x402 Payment Verified! Escrow bounty locked on Algorand Testnet.","ticket":{"id":"TKT-8902","status":"ESCROW_LOCKED"}}`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="font-mono-code text-xs uppercase tracking-widest text-purple-400 font-bold">
            SYSTEM ARCHITECTURE & PROTOCOL
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How AutoShield Works
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl font-light mt-1">
          Technical overview of the automated civic hazard triaging pipeline, cryptographic escrow locking, and verified repair payouts.
        </p>
      </div>

      {/* Protocol Architecture Flow Diagram (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Step 1 Card */}
        <div className="p-6 rounded-3xl bg-[#0c0e15] border border-purple-500/30 space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center font-mono-code font-bold text-purple-300 text-sm">
            01
          </div>
          <h3 className="font-display text-base font-bold text-white">
            AI Vision & 402 Intercept
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed font-light">
            Multimodal Gemini 2.5 analyzes civil defect imagery, assigns severity (0-100), and calculates ALGO bounty. Submission without payment triggers strict HTTP 402 with <code className="text-purple-300">WWW-Authenticate: x402</code>.
          </p>
        </div>

        {/* Step 2 Card */}
        <div className="p-6 rounded-3xl bg-[#0c0e15] border border-purple-500/30 space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center font-mono-code font-bold text-purple-300 text-sm">
            02
          </div>
          <h3 className="font-display text-base font-bold text-white">
            GoPlausible & Pera Settlement
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed font-light">
            Frontend intercepts the 402 challenge and routes payment via Pera Wallet or GoPlausible Facilitator relay on Algorand Testnet. Resubmitting with payment header unlocks ticket and locks escrow.
          </p>
        </div>

        {/* Step 3 Card */}
        <div className="p-6 rounded-3xl bg-[#0c0e15] border border-purple-500/30 space-y-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center font-mono-code font-bold text-purple-300 text-sm">
            03
          </div>
          <h3 className="font-display text-base font-bold text-white">
            Agentic Escrow Release & LoRA Proof
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed font-light">
            Repair worker uploads after-fix photo. Gemini vision compares Before vs After. If restoration score &ge; 80, escrow smart contract autonomously pays worker on Algorand with LoRA verification.
          </p>
        </div>

      </div>

      {/* Terminal & Code Walkthrough */}
      <div className="space-y-6">
        
        {/* CLI Snippet 1: 402 Challenge */}
        <div className="rounded-3xl bg-[#08090d] border border-white/10 overflow-hidden shadow-2xl">
          <div className="px-5 py-3 bg-black/60 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>1. Triggering HTTP 402 Challenge via cURL</span>
            </div>
            <button
              onClick={() => handleCopy(curlChallengeSnippet, 'curl-402')}
              className="flex items-center gap-1 text-[11px] font-mono-code text-purple-400 hover:text-purple-300"
            >
              {copiedSection === 'curl-402' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'curl-402' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-5 font-mono-code text-xs text-purple-200/90 overflow-x-auto leading-relaxed">
            {curlChallengeSnippet}
          </pre>
        </div>

        {/* CLI Snippet 2: 200 OK Unlock */}
        <div className="rounded-3xl bg-[#08090d] border border-emerald-500/20 overflow-hidden shadow-2xl">
          <div className="px-5 py-3 bg-black/60 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>2. Unlocking Protected Resource with x402 Payment Header</span>
            </div>
            <button
              onClick={() => handleCopy(curlUnlockSnippet, 'curl-200')}
              className="flex items-center gap-1 text-[11px] font-mono-code text-emerald-400 hover:text-emerald-300"
            >
              {copiedSection === 'curl-200' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'curl-200' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-5 font-mono-code text-xs text-emerald-200/90 overflow-x-auto leading-relaxed">
            {curlUnlockSnippet}
          </pre>
        </div>

      </div>

    </section>
  );
};
