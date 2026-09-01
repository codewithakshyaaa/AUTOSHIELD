import React from 'react';
import { 
  Shield, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  Zap, 
  Activity, 
  Radio, 
  Hammer, 
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Clock,
  XCircle,
  Star,
  Users,
  Check,
  Building2,
  PhoneOff,
  Flame,
  Droplets,
  Camera
} from 'lucide-react';
import { motion } from 'motion/react';
import { BountyTicket } from '../types.js';
import { handleImageError } from '../utils/imageFallback.js';
import { ThreeHeroAnimation } from './ThreeHeroAnimation.js';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onSelectForRepair: (ticket: BountyTicket) => void;
  totalAlgoLocked: number;
  activeBounties: BountyTicket[];
  testnetRound: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onSelectForRepair,
  totalAlgoLocked,
  activeBounties,
  testnetRound,
}) => {
  const lockedBounties = activeBounties.filter(b => b.status === 'ESCROW_LOCKED');

  return (
    <div className="relative overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH 3D INTERACTIVE THREE.JS CANVAS                       */}
      {/* ========================================================================= */}
      <section className="relative pt-10 pb-20 border-b border-white/5">
        
        {/* Ambient 3D background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-sky-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
        
        {/* Cyber Grid background */}
        <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none -z-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Display Typography (Focused on 1-Click City Safety) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative text-center max-w-5xl mx-auto"
          >
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 leading-[1.1] select-none">
              SAVE YOUR CITY
              <br />
              <span className="tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-sky-400">
                IN JUST ONE CLICK.
              </span>
            </h1>

            <p className="mt-6 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-10">
              Spot a dangerous road pothole, bursting water pipe, or broken safety light? Snap a quick photo. Google Gemini AI instantly scans the hazard severity, notifies emergency repair teams in seconds, and verifies the fix with zero municipal red tape.
            </p>

            {/* Primary Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <button
                id="hero-launch-report-btn"
                onClick={() => onNavigate('report')}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-sm tracking-wide transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 border border-purple-300/30 group cursor-pointer"
              >
                <Camera className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
                <span>Snap Photo & Report Hazard</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-claim-bounties-btn"
                onClick={() => onNavigate('bounties')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.10] text-slate-200 hover:text-white font-semibold text-sm tracking-wide border border-white/10 hover:border-purple-500/40 transition-all backdrop-blur-md hover:-translate-y-0.5 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Explore City Hazards ({lockedBounties.length})</span>
              </button>

              <button
                id="hero-worker-verify-btn"
                onClick={() => onNavigate('worker')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-purple-950/30 hover:bg-purple-950/60 text-purple-300 hover:text-purple-200 text-xs font-semibold border border-purple-500/30 hover:border-purple-500/50 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <Hammer className="w-4 h-4 text-purple-400" />
                <span>Worker Station (Submit Fix Proof)</span>
              </button>
            </div>

          </motion.div>

          {/* REAL 3D THREE.JS INTERACTIVE HERO CANVAS */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative max-w-5xl mx-auto mt-4"
          >
            <div className="relative rounded-3xl p-4 sm:p-6 bg-[#0c0e15]/90 border border-purple-500/30 shadow-[0_20px_70px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden hover:border-purple-400/50 transition-all">
              
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* Top Bar inside 3D Card */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-2 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono-code text-xs uppercase tracking-widest text-emerald-400 font-bold">
                    LIVE 3D CIVIC SHIELD GRID
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono-code text-slate-400">
                  <span>AI VISION: ACTIVE</span>
                  <span className="text-purple-400">|</span>
                  <span>DISPATCH SPEED: &lt; 10s</span>
                  <span className="text-purple-400">|</span>
                  <span className="text-emerald-400">ROUND #{testnetRound}</span>
                </div>
              </div>

              {/* The Three.js 3D Canvas */}
              <ThreeHeroAnimation />

              {/* Bottom Quick Feature Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">1-Click Reporting</span>
                    <span className="text-[11px] text-slate-400">Zero apps or lengthy forms</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-950/60 border border-sky-500/30 flex items-center justify-center text-sky-300 shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Gemini AI Triaging</span>
                    <span className="text-[11px] text-slate-400">Instant damage severity score</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Photo-Audited Fixes</span>
                    <span className="text-[11px] text-slate-400">100% public proof of repair</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HOW AUTOSHIELD IS DIFFERENT FROM EXISTING SOLUTIONS (311 / PORTALS)   */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-white/5 bg-[#080a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 font-mono-code text-xs font-bold uppercase tracking-wider">
              Comparison Matrix
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How AutoShield Beats Traditional City Helplines
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Compare standard 311 call centers and municipal web portals against our autonomous, AI-driven civic engine.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* TRADITIONAL MUNICIPAL 311 CARD */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 sm:p-8 rounded-3xl bg-[#0f1118]/80 border border-rose-500/20 shadow-lg space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-950/50 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <PhoneOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">
                      Traditional 311 & Web Portals
                    </h3>
                    <p className="text-xs text-rose-400 font-mono-code">
                      Slow, Bureaucratic & Frustrating
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-rose-950/80 text-rose-300 text-[10px] font-mono-code font-bold">
                  Legacy 311
                </span>
              </div>

              <ul className="space-y-4 text-xs text-slate-300">
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">30-45 Minute Hold Times</strong>
                    Citizens must navigate phone trees, wait on hold, or fill out 15-field online forms.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Weeks to Months of Delay</strong>
                    Reports sit in municipal backlogs waiting for manual human inspectors to schedule a visit.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Black Box Ticket Status</strong>
                    Tickets are closed without photographic proof, leaving citizens guessing if anything was actually fixed.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">High Citizen Friction</strong>
                    Requires registration, passwords, CAPTCHAs, and manual street address lookups.
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* AUTOSHIELD 1-CLICK AI SHIELD CARD */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#12101e] via-[#0d0f17] to-[#0a0c10] border border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.25)] space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-400 flex items-center justify-center text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    <Shield className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg">
                      AutoShield 1-Click AI Defense
                    </h3>
                    <p className="text-xs text-emerald-400 font-mono-code">
                      Instant, Autonomous & 100% Transparent
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-purple-900/80 text-purple-200 text-[10px] font-mono-code font-bold border border-purple-500/40">
                  AutoShield AI
                </span>
              </div>

              <ul className="space-y-4 text-xs text-slate-200">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">1-Click Snap & AI Analysis (&lt; 3 Seconds)</strong>
                    Take a photo from your phone. GPS and Gemini AI automatically identify the hazard, category, and severity score.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Instant Autonomous Dispatch</strong>
                    High-severity hazards trigger immediate work orders for verified contractors and municipal teams.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Cryptographic Before/After Proof</strong>
                    Repairs are visually audited by Gemini Vision AI and recorded permanently on the public blockchain ledger.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Zero Friction Citizen Empowerment</strong>
                    No logins or forms needed. Any resident can safeguard their street with a single tap.
                  </div>
                </li>
              </ul>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS: THE 3 SIMPLE STEPS                                       */}
      {/* ========================================================================= */}
      <section className="py-20 border-b border-white/5 bg-[#07080a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 font-mono-code text-xs font-bold uppercase tracking-wider">
              3-Step Solution
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Broken Hazard to Fully Repaired
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
              Empowering citizens and municipal workers to keep city streets safe in three autonomous steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="relative p-6 rounded-3xl bg-[#0e1017] border border-white/10 hover:border-purple-500/40 transition-all group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="font-mono-code text-2xl font-black text-slate-600 group-hover:text-purple-400 transition-colors">
                    01
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-white mb-2">
                  1. Snap Photo in 1-Click
                </h3>

                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Point your phone at a pothole, leaking pipe, or dark street lamp. Gemini AI measures the damage severity (0–100) and maps the hazard instantly.
                </p>
              </div>

              <button
                onClick={() => onNavigate('report')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-purple-600/20 text-purple-300 hover:text-white border border-white/10 hover:border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Report an Issue Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="relative p-6 rounded-3xl bg-[#0e1017] border border-white/10 hover:border-purple-500/40 transition-all group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="font-mono-code text-2xl font-black text-slate-600 group-hover:text-amber-400 transition-colors">
                    02
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-white mb-2">
                  2. Automated Dispatch & Lock
                </h3>

                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  The hazard is published to the public city grid and emergency repair crews are notified. Work escrow is locked safely until the job is verified.
                </p>
              </div>

              <button
                onClick={() => onNavigate('bounties')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-amber-600/20 text-amber-300 hover:text-white border border-white/10 hover:border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>View City Grid Hazards</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="relative p-6 rounded-3xl bg-[#0e1017] border border-white/10 hover:border-purple-500/40 transition-all group flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="font-mono-code text-2xl font-black text-slate-600 group-hover:text-emerald-400 transition-colors">
                    03
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-white mb-2">
                  3. AI Verification & Safe City
                </h3>

                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Workers upload a photo of the completed repair. Gemini AI conducts a structural audit to ensure the road is safe and logs the proof permanently.
                </p>
              </div>

              <button
                onClick={() => onNavigate('worker')}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-emerald-600/20 text-emerald-300 hover:text-white border border-white/10 hover:border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Worker Verification Station</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BOTTOM CALL TO ACTION                                                  */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-b from-[#0a0c12] to-[#06070a]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-purple-950/40 via-violet-950/20 to-black border border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.2)] backdrop-blur-xl"
          >
            <h3 className="font-display text-3xl sm:text-4xl font-black text-white mb-4">
              Help Protect Your Neighborhood Today
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Take one photo of a broken street hazard and let our AI engine mobilize emergency repairs immediately.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('report')}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl hover:shadow-purple-500/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Report an Issue in 1 Click</span>
              </button>
              <button
                onClick={() => onNavigate('bounties')}
                className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-semibold border border-white/10 transition-all cursor-pointer"
              >
                <span>Browse City Safety Grid</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
