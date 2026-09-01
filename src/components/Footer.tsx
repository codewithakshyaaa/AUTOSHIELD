import React from 'react';
import { 
  Shield, 
  Radio, 
  ExternalLink, 
  Heart, 
  Zap, 
  Lock, 
  Layers, 
  Cpu, 
  Hammer,
  ArrowUpRight
} from 'lucide-react';
import { getLoraAccountUrl } from '../services/algorand.js';

interface FooterProps {
  onNavigate: (tab: string) => void;
  testnetRound: number;
  isNodeOnline: boolean;
  totalAlgoLocked: number;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  testnetRound,
  isNodeOnline,
  totalAlgoLocked,
}) => {
  return (
    <footer className="w-full bg-[#050608] border-t border-white/10 text-slate-400 text-xs transition-colors">
      
      {/* Top Banner / Quick Slogan */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Slogan */}
          <div className="space-y-3 md:col-span-1">
            <div 
              onClick={() => onNavigate('overview')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-white text-base tracking-wide">
                AUTOSHIELD
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono-code font-bold bg-purple-950 text-purple-300 border border-purple-500/30 rounded">
                x402
              </span>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed">
              Fixing broken roads and city issues with instant AI checks and crypto cash rewards on Algorand.
            </p>

            <div className="flex items-center gap-2 pt-1 font-mono-code text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Algorand Testnet Active (Round #{testnetRound})</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200 font-mono-code">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('overview')} 
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5"
                >
                  <span>🏠 Home & Overview</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('report')} 
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5"
                >
                  <span>📸 Report Broken Issue</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('bounties')} 
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5"
                >
                  <span>🎯 View City Bounties</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('worker')} 
                  className="hover:text-purple-300 transition-colors flex items-center gap-1.5"
                >
                  <span>🛠️ Worker Fix & Earn</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Technology & Protocols */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200 font-mono-code">
              Tech Stack
            </h4>
            <ul className="space-y-2 text-xs font-mono-code">
              <li>
                <button 
                  onClick={() => onNavigate('architecture')}
                  className="hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  <Cpu className="w-3 h-3 text-purple-400" />
                  <span>HTTP 402 Payment Spec</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('explorer')}
                  className="hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  <Radio className="w-3 h-3 text-purple-400" />
                  <span>LoRA Algorand Explorer</span>
                </button>
              </li>
              <li>
                <a 
                  href="https://perawallet.app/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Pera Mobile Wallet</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://lora.algokit.io/testnet" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Escrow Smart Vault ({totalAlgoLocked.toFixed(1)} ALGO)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Simple How it works summary */}
          <div className="space-y-2.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-300 font-mono-code">
              How It Works
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-300 font-light">
              1. <strong className="text-white">Snap photo</strong> of pothole/leak.<br />
              2. <strong className="text-white">AI prices reward</strong> in ALGO.<br />
              3. <strong className="text-white">Worker fixes it</strong> & gets paid instantly on Algorand!
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} AutoShield x402 — Decentralized Civic Bounty Network.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Powered by Algorand Testnet & Gemini 2.5 Flash</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
