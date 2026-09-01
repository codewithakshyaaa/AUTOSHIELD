import React from 'react';
import { Shield, Sparkles, ArrowRight, CheckCircle2, Lock, Cpu, Eye, Zap, Activity } from 'lucide-react';

interface HeroBannerProps {
  onStartReport: () => void;
  onExploreBounties: () => void;
  onOpenSpecs: () => void;
  totalAlgoLocked: number;
  activeBountiesCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartReport,
  onExploreBounties,
  onOpenSpecs,
  totalAlgoLocked,
  activeBountiesCount,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 border-b border-white/5">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-violet-800/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-fuchsia-900/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      
      {/* Cyber Grid background */}
      <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none -z-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>Agentic Solutions Powered by x402 & Algorand</span>
            <span className="text-purple-500">•</span>
            <span className="font-mono-code text-[11px] text-purple-200">GoPlausible Facilitator</span>
          </div>
        </div>

        {/* Main Display Typography Section (Inspired by the user's reference image) */}
        <div className="relative text-center max-w-5xl mx-auto">
          
          {/* Huge Display Heading */}
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 leading-[1.05] select-none">
            AUTONOMOUS
            <br />
            <span className="tracking-wider">SHIELD</span>
          </h1>

          {/* Electric Purple Neon Cursive Accent (Matching the "MODERN ARMOR" style in the reference image) */}
          <div className="font-cursive text-5xl sm:text-7xl md:text-8xl text-purple-400/90 -mt-6 sm:-mt-10 md:-mt-14 mb-4 drop-shadow-[0_0_25px_rgba(192,132,252,0.6)] select-none rotate-[-2deg]">
            Protected by x402 Agents.
          </div>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
            Decentralized civil infrastructure protection. Edge devices report hazards, Gemini AI calculates severity, and micro-bounties lock in Algorand Testnet escrow via strict HTTP 402 payment gates.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <button
              id="hero-launch-report-btn"
              onClick={onStartReport}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-sm tracking-wide transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] border border-purple-300/30 group"
            >
              <Zap className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
              <span>Report Hazard (x402 Gate)</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-claim-bounties-btn"
              onClick={onExploreBounties}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white font-semibold text-sm tracking-wide border border-white/10 hover:border-white/20 transition-all backdrop-blur-md"
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Browse Escrow Bounties ({activeBountiesCount})</span>
            </button>

            <button
              id="hero-view-spec-btn"
              onClick={onOpenSpecs}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-purple-950/20 hover:bg-purple-950/40 text-purple-300 hover:text-purple-200 font-mono-code text-xs font-semibold border border-purple-500/20 hover:border-purple-500/40 transition-all"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>x402 Spec</span>
            </button>
          </div>

        </div>

        {/* Central Tactical Shield / Radar Showcase (Inspired by the central centerpiece in the reference image) */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Tactical Glass Container */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-[#0d0f14]/80 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden">
            
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Telemetry & Radar */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                  <span className="font-mono-code text-xs uppercase tracking-widest text-purple-400 font-bold">
                    SYSTEM STATUS: ACTIVE
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                  Autonomous Edge & Civil Escrow Matrix
                </h3>

                <p className="text-slate-400 text-xs leading-relaxed">
                  Real-time micro-payments intercepted by RFC-standard HTTP 402 headers, settled over Algorand Testnet with GoPlausible Facilitator, and verified on LoRA explorer.
                </p>

                {/* Micro metrics */}
                <div className="pt-2 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[11px] text-slate-400 block font-medium">Escrow Pool</span>
                    <span className="text-lg font-mono-code font-bold text-purple-300">
                      {totalAlgoLocked.toFixed(2)} ALGO
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[11px] text-slate-400 block font-medium">Settle Latency</span>
                    <span className="text-lg font-mono-code font-bold text-emerald-400">
                      ~3.2 sec
                    </span>
                  </div>
                </div>
              </div>

              {/* Center/Right Column: Tactical Radar Visualizer */}
              <div className="lg:col-span-7 relative flex items-center justify-center min-h-[260px] bg-gradient-to-b from-[#12141c] to-[#0a0b10] rounded-2xl border border-purple-500/20 p-6 overflow-hidden">
                
                {/* Radar Grid circles */}
                <div className="absolute w-56 h-56 rounded-full border border-purple-500/20 animate-pulse" />
                <div className="absolute w-40 h-40 rounded-full border border-purple-500/30" />
                <div className="absolute w-24 h-24 rounded-full border border-purple-400/40" />
                <div className="absolute w-64 h-[1px] bg-purple-500/30 rotate-45" />
                <div className="absolute w-64 h-[1px] bg-purple-500/30 -rotate-45" />

                {/* Central Tactical Icon */}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-900 to-violet-700 border-2 border-purple-400 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.6)]">
                  <Shield className="w-10 h-10 text-white" />
                </div>

                {/* Floating telemetry pins */}
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-lg bg-black/70 border border-purple-500/40 text-[10px] font-mono-code text-purple-300 backdrop-blur-md flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-emerald-400 animate-spin" />
                  <span>AI RADAR: SCANNING</span>
                </div>

                <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-lg bg-black/70 border border-purple-500/40 text-[10px] font-mono-code text-amber-300 backdrop-blur-md flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>ESCROW: ALGORAND TESTNET</span>
                </div>

                <div className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-lg bg-black/70 border border-purple-500/40 text-[10px] font-mono-code text-blue-300 backdrop-blur-md flex items-center gap-1.5">
                  <Cpu className="w-3 h-3 text-blue-400" />
                  <span>x402 FACILITATOR: ONLINE</span>
                </div>

              </div>

            </div>

          </div>

          {/* Floating Feature Card (Inspired by the right card in the reference image) */}
          <div className="hidden md:block absolute -right-6 -bottom-8 w-64 p-4 rounded-2xl bg-[#11131a]/95 border border-purple-500/30 shadow-[0_15px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl z-20">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-[11px] font-mono-code uppercase font-bold tracking-wider text-purple-300">
                GoPlausible x402
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-snug">
              Instant micro-payment challenge resolution without Web2 payment gateways.
            </p>
            <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono-code text-slate-400 border-t border-white/5 pt-2">
              <span>Standard: RFC 402</span>
              <span className="text-emerald-400">Verified</span>
            </div>
          </div>

        </div>

        {/* Lower Features Grid (Inspired by the 4 lower feature blocks in the reference image) */}
        <div className="mt-20">
          
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase">
              Engineered by AI Agents.
            </h2>
            <p className="font-cursive text-3xl sm:text-4xl text-purple-400/90 drop-shadow-[0_0_15px_rgba(192,132,252,0.4)]">
              Verified on Algorand Blockchain.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Feature 1 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-1">
                AI Vision Severity Radar
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Multimodal Gemini agent calculates damage severity (0-100) and computes dynamic ALGO micro-bounties in under 500ms.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-1">
                HTTP 402 Payment Gate
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Strict protocol interceptor returning standard 402 challenge payloads requiring Algorand Testnet transaction signatures.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Lock className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-1">
                Autonomous Escrow Pool
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Zero-trust escrow smart logic locks bounty funds on-chain until the repair worker submits a verified after-fix inspection.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-1">
                LoRA Explorer Audit Trail
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Every ticket creation, facilitator settlement, and worker payout generates a permanent transaction hash verifiable on LoRA.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
