import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  MapPin, 
  ExternalLink, 
  CheckCircle2, 
  Wrench, 
  Search,
  Zap,
  ArrowUpRight,
  Sparkles,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';
import { BountyTicket, SeverityLevel } from '../types.js';
import { getLoraTransactionUrl } from '../services/algorand.js';
import { handleImageError } from '../utils/imageFallback.js';

interface ActiveBountiesProps {
  bounties: BountyTicket[];
  onSelectForRepair: (ticket: BountyTicket) => void;
  onRefresh: () => void;
  onNavigateReport?: () => void;
}

export const ActiveBounties: React.FC<ActiveBountiesProps> = ({
  bounties,
  onSelectForRepair,
  onRefresh,
  onNavigateReport,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredBounties = bounties.filter((b) => {
    const matchesSeverity = selectedSeverity === 'ALL' || b.severityLevel === selectedSeverity;
    const matchesStatus = selectedStatus === 'ALL' || b.status === selectedStatus;
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesStatus && matchesSearch;
  });

  const getSeverityBadge = (level: SeverityLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header with Scroll Reveal */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono-code text-xs uppercase tracking-widest text-emerald-300 font-bold">
              CIVIC SAFETY GRID
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Active City Issues & Fix Tracking
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl font-light mt-1">
            Browse all reported broken roads, potholes, and water leaks. Inspect threat severity scores and submit verified repair photos to resolve them.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search street, issue..."
              className="pl-8 pr-3 py-2 rounded-xl bg-[#0c0e15] border border-white/10 text-xs font-mono-code text-slate-200 outline-none focus:border-purple-500 w-44 sm:w-56 transition-colors"
            />
          </div>

          {/* Severity selector */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#0c0e15] border border-white/10 text-xs font-mono-code text-slate-200 outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">All Urgencies</option>
            <option value="CRITICAL">🔴 Critical (Emergency)</option>
            <option value="HIGH">🟠 High Urgency</option>
            <option value="MEDIUM">🔵 Medium Urgency</option>
            <option value="LOW">🟢 Low Urgency</option>
          </select>
        </div>
      </motion.div>

      {/* Grid of Bounties with 3D Tilt Card Effects */}
      {filteredBounties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBounties.map((bounty, index) => {
            const isResolved = bounty.status === 'RESOLVED_AND_PAID';
            const imgSource = bounty.beforeImageUrl || (bounty as any).imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';

            return (
              <motion.div
                key={bounty.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 6) * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative rounded-3xl bg-[#0c0e15] border border-white/5 hover:border-purple-500/40 p-5 shadow-[0_0_20px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_40px_rgba(168,85,247,0.2)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Image Section */}
                <div className="space-y-4">
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-900">
                    <img
                      src={imgSource}
                      alt={bounty.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, bounty.title, bounty.category, false)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Severity Pill */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold border shadow-md ${getSeverityBadge(bounty.severityLevel)}`}>
                        {bounty.severityLevel} • Score {bounty.severityScore}/100
                      </span>
                    </div>

                    {/* Status Pill */}
                    <div className="absolute top-3 right-3 z-10">
                      {isResolved ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>RESOLVED & PAID</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-purple-950/90 text-purple-300 border border-purple-500/40 flex items-center gap-1 shadow-md">
                          <Lock className="w-3 h-3 text-purple-400" />
                          <span>REWARD LOCKED</span>
                        </span>
                      )}
                    </div>

                    {/* Category overlay */}
                    <div className="absolute bottom-2 left-3 text-[10px] font-mono-code text-slate-200 bg-black/80 px-2.5 py-0.5 rounded backdrop-blur-sm shadow">
                      {bounty.category.replace('_', ' ')}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{bounty.location.address}</span>
                    </div>

                    <h3 className="font-display text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                      {bounty.title}
                    </h3>

                    <p className="text-slate-400 text-xs mt-1.5 line-clamp-2 font-light leading-relaxed">
                      {bounty.description}
                    </p>
                  </div>
                </div>

                {/* Footer Section: Reward & Action */}
                <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                  
                  {/* Reward & TX proof */}
                  <div className="flex items-baseline justify-between font-mono-code">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Bounty Reward</span>
                      <span className="text-xl font-bold text-white">
                        {bounty.bountyAlgo.toFixed(2)} <span className="text-purple-400 text-xs font-semibold">ALGO</span>
                      </span>
                    </div>

                    <a
                      href={getLoraTransactionUrl(bounty.creationTxId)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                      title="View blockchain record on LoRA explorer"
                    >
                      <span>LoRA Proof</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Claim Button */}
                  {!isResolved ? (
                    <button
                      id={`claim-bounty-${bounty.id}`}
                      type="button"
                      onClick={() => onSelectForRepair(bounty)}
                      className="w-full py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-600 border border-purple-500/30 hover:border-purple-400 text-purple-200 hover:text-white font-semibold text-xs tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5 text-purple-400 group-hover:text-white" />
                      <span>Claim & Submit Repair Proof</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-[11px] font-mono-code text-emerald-300 text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Completed & Paid Out</span>
                    </div>
                  )}

                </div>

              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-12 rounded-3xl bg-[#0c0e15] border border-white/5 text-center space-y-4 shadow-lg"
        >
          <Shield className="w-12 h-12 text-purple-400/50 mx-auto" />
          <h4 className="font-display text-lg font-bold text-white">No Issues Match Your Filter</h4>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            Try adjusting your search query or severity level, or report a new issue to create the next bounty!
          </p>
          {onNavigateReport && (
            <button
              onClick={onNavigateReport}
              className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              📸 Report an Issue
            </button>
          )}
        </motion.div>
      )}

    </div>
  );
};
