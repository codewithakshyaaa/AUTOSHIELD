import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ExternalLink, 
  RefreshCw, 
  Search, 
  Shield, 
  CheckCircle2, 
  ArrowUpRight, 
  Copy, 
  Check, 
  Lock, 
  Zap,
  Clock
} from 'lucide-react';
import { AlgorandTransactionRecord } from '../types.js';
import { getLoraTransactionUrl, getLoraAccountUrl } from '../services/algorand.js';

interface LoraExplorerFeedProps {
  onRefresh: () => void;
}

export const LoraExplorerFeed: React.FC<LoraExplorerFeedProps> = ({ onRefresh }) => {
  const [transactions, setTransactions] = useState<AlgorandTransactionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/explorer/transactions');
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTxs = transactions.filter((tx) => {
    const query = searchQuery.toLowerCase();
    return (
      tx.txId.toLowerCase().includes(query) ||
      tx.sender.toLowerCase().includes(query) ||
      tx.receiver.toLowerCase().includes(query) ||
      (tx.ticketId && tx.ticketId.toLowerCase().includes(query)) ||
      tx.note.toLowerCase().includes(query)
    );
  });

  const getTxTypeBadge = (type: string) => {
    switch (type) {
      case 'BOUNTY_RELEASE_PAYOUT':
        return {
          label: 'ESCROW RELEASE',
          color: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
          icon: CheckCircle2,
        };
      case 'FACILITATOR_SETTLEMENT':
        return {
          label: 'GOPLAUSIBLE SETTLE',
          color: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
          icon: Zap,
        };
      default:
        return {
          label: 'x402 DEPOSIT',
          color: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
          icon: Lock,
        };
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span className="font-mono-code text-xs uppercase tracking-widest text-purple-400 font-bold">
              STEP 4: LORA EXPLORER ON-CHAIN AUDIT TRAIL
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live Algorand Testnet Ledger
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl font-light">
            Immutable transaction record for every x402 challenge, escrow deposit, and agentic payout. All transactions are verifiable on the LoRA Algorand Testnet explorer.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://lora.algokit.io/testnet"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-200 text-xs font-mono-code font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]"
          >
            <span>Open LoRA Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => {
              fetchTransactions();
              onRefresh();
            }}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/5"
            title="Refresh transaction stream"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-3xl bg-[#0c0e15] border border-white/5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by TxId, Address, or Ticket..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs font-mono-code text-slate-200 outline-none focus:border-purple-500"
          />
        </div>

        <div className="text-xs font-mono-code text-slate-400 flex items-center gap-2">
          <span>Total Transactions: <strong className="text-purple-300">{transactions.length}</strong></span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTxs.map((tx) => {
          const badge = getTxTypeBadge(tx.type);
          const BadgeIcon = badge.icon;

          return (
            <div
              key={tx.txId}
              className="p-4 sm:p-5 rounded-2xl bg-[#0c0e15] border border-white/5 hover:border-purple-500/30 transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              
              {/* Left Info: Type & TxID */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold border flex items-center gap-1.5 ${badge.color}`}>
                    <BadgeIcon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>

                  <span className="text-xs font-mono-code text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </span>

                  <span className="text-xs font-mono-code text-purple-400/90">
                    Round #{tx.confirmedRound}
                  </span>

                  {tx.ticketId && (
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono-code text-[10px]">
                      {tx.ticketId}
                    </span>
                  )}
                </div>

                {/* TxID with Copy & LoRA direct link */}
                <div className="flex items-center gap-2 font-mono-code text-xs">
                  <span className="text-slate-500 text-[11px]">TxID:</span>
                  <span className="text-purple-200 truncate max-w-xs sm:max-w-md">
                    {tx.txId}
                  </span>
                  <button
                    onClick={() => handleCopy(tx.txId)}
                    className="p-1 rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                  >
                    {copiedId === tx.txId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                {/* Note payload */}
                <div className="text-[11px] font-mono-code text-slate-400">
                  <span className="text-slate-600">Note: </span>
                  <span className="text-slate-300">{tx.note}</span>
                </div>
              </div>

              {/* Right: Amount & LoRA Action */}
              <div className="flex sm:flex-row lg:flex-col lg:items-end justify-between items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
                <div className="text-left lg:text-right font-mono-code">
                  <span className="text-[10px] text-slate-500 block uppercase">Amount</span>
                  <span className="text-lg font-bold text-white">
                    {tx.amountAlgo.toFixed(2)} <span className="text-purple-400 text-xs">ALGO</span>
                  </span>
                </div>

                <a
                  href={getLoraTransactionUrl(tx.txId)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-300 hover:text-purple-200 text-xs font-mono-code transition-all"
                >
                  <span>LoRA Proof</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};
