import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Wallet, 
  Menu, 
  X, 
  Layers, 
  Camera, 
  AlertTriangle, 
  Hammer, 
  Cpu, 
  Radio, 
  CheckCircle2, 
  ChevronDown
} from 'lucide-react';
import { ConnectedWallet } from '../types.js';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wallet: ConnectedWallet;
  onOpenWalletModal: () => void;
  onConnectPera?: () => void;
  testnetRound: number;
  isNodeOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  wallet,
  onOpenWalletModal,
  onConnectPera,
  testnetRound,
  isNodeOnline,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navPages = [
    { id: 'overview', label: 'Home', icon: Layers },
    { id: 'report', label: 'Report Hazard', icon: Camera },
    { id: 'bounties', label: 'Civic Grid', icon: AlertTriangle },
    { id: 'worker', label: 'Worker Station', icon: Hammer },
    { id: 'explorer', label: 'Ledger', icon: Radio },
    { id: 'architecture', label: 'How It Works', icon: Cpu },
  ];

  // Close drawer on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  const truncatedAddress = wallet.address
    ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
    : '';

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07080c]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Clean Brand Logo */}
            <div 
              id="brand-logo-btn"
              onClick={() => handleSelectTab('overview')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 group-hover:border-purple-400/60 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <Shield className="w-4.5 h-4.5 text-purple-400 group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-bold tracking-tight text-white group-hover:text-purple-200 transition-colors">
                  AUTOSHIELD
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono-code font-bold tracking-wider bg-purple-950/60 text-purple-300 border border-purple-500/30 rounded-md">
                  CIVIC AI
                </span>
              </div>
            </div>

            {/* Middle: Clean Segmented Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
              {navPages.map((page) => {
                const isActive = activeTab === page.id;
                const Icon = page.icon;
                return (
                  <button
                    key={page.id}
                    onClick={() => handleSelectTab(page.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-600/30 text-white border border-purple-500/40 shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-300' : 'text-slate-500'}`} />
                    <span>{page.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Clean Wallet Button */}
            <div className="flex items-center gap-3">
              {/* Wallet Button */}
              {wallet.isConnected ? (
                <button
                  id="connected-wallet-btn"
                  onClick={onOpenWalletModal}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 hover:border-purple-400/50 text-slate-200 text-xs font-mono-code transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-purple-300">{wallet.balanceAlgo.toFixed(2)} ALGO</span>
                  <span className="hidden md:inline text-slate-400 text-[11px]">({truncatedAddress})</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ) : (
                <button
                  id="connect-pera-wallet-btn"
                  onClick={onOpenWalletModal}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 hover:text-white text-xs font-semibold border border-purple-500/40 hover:border-purple-400 transition-all cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5 text-purple-300" />
                  <span>Connect Wallet</span>
                </button>
              )}

              {/* Hamburger Menu Toggle for Mobile */}
              <button
                id="hamburger-menu-toggle-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Open Navigation Menu"
                className="lg:hidden p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 transition-colors cursor-pointer"
              >
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Slide-Over Navigation Drawer for Mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />
          
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#0c0e15] border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl z-10 animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="font-display font-bold text-white text-sm">AUTOSHIELD</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {navPages.map((page) => {
                  const isActive = activeTab === page.id;
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.id}
                      onClick={() => handleSelectTab(page.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                      <span>{page.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px] font-mono-code text-slate-400">
                <span>Algorand Testnet</span>
                <span className="text-emerald-400">Online #{testnetRound}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
