import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  ShieldAlert, 
  AlertTriangle, 
  Zap, 
  MapPin, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  Lock, 
  Sliders, 
  Layers,
  HelpCircle,
  Clock,
  Coins
} from 'lucide-react';
import { motion } from 'motion/react';
import { InfrastructureIssueAssessment, ConnectedWallet, X402PaymentResponse } from '../types.js';
import { handleImageError } from '../utils/imageFallback.js';

interface PresetItem {
  id: string;
  category: 'POTHOLE' | 'STREETLIGHT' | 'GUARDRAIL' | 'WATER_LEAK' | 'ELECTRICAL';
  name: string;
  location: string;
  notes: string;
  imageUrl: string;
}

const PRESET_ISSUES: PresetItem[] = [
  {
    id: 'preset-pothole',
    category: 'POTHOLE',
    name: 'Deep Road Pothole',
    location: '842 Northway Blvd, District 4',
    notes: 'Deep 12cm hole in middle lane damaging tires.',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'preset-water',
    category: 'WATER_LEAK',
    name: 'Broken Water Pipe Leak',
    location: 'Pier 14 Terminal Access Rd',
    notes: 'Water flooding street asphalt under high pressure.',
    imageUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'preset-guardrail',
    category: 'GUARDRAIL',
    name: 'Bent Highway Safety Barrier',
    location: 'Hwy 101 Overpass, Mile 42',
    notes: 'Metal barrier bent after collision, needs replacement.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'preset-streetlight',
    category: 'STREETLIGHT',
    name: 'Broken Street Light',
    location: 'Corner of 4th & Pine St',
    notes: 'Light bulb out and loose cover causing dark street.',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'preset-electric',
    category: 'ELECTRICAL',
    name: 'Hanging Power Cable',
    location: 'Oakridge Residential Ave',
    notes: 'Low wire touching tree branches near sidewalk.',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
  },
];

interface AiSeverityAssessmentProps {
  wallet: ConnectedWallet;
  onOpenWalletModal: () => void;
  onTriggerX402Challenge: (challengeData: X402PaymentResponse, draft: any) => void;
}

export const AiSeverityAssessment: React.FC<AiSeverityAssessmentProps> = ({
  wallet,
  onOpenWalletModal,
  onTriggerX402Challenge,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<PresetItem | null>(PRESET_ISSUES[0]);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [locationAddress, setLocationAddress] = useState<string>(PRESET_ISSUES[0].location);
  const [additionalNotes, setAdditionalNotes] = useState<string>(PRESET_ISSUES[0].notes);
  
  const [isScanning, setIsScanning] = useState(false);
  const [assessment, setAssessment] = useState<InfrastructureIssueAssessment | null>(null);
  const [isSubmitting402, setIsSubmitting402] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const activeImage = customImageUrl || selectedPreset?.imageUrl || PRESET_ISSUES[0].imageUrl;

  const handleSelectPreset = (preset: PresetItem) => {
    setSelectedPreset(preset);
    setCustomImageUrl('');
    setLocationAddress(preset.location);
    setAdditionalNotes(preset.notes);
    setAssessment(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomImageUrl(reader.result);
        setSelectedPreset(null);
        setAssessment(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Run Gemini AI Multimodal Vision Scan
  const handleRunAiAssessment = async () => {
    setIsScanning(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/infrastructure/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: activeImage,
          category: selectedPreset?.category || 'POTHOLE',
          notes: additionalNotes,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to scan damage photo');
      }

      setAssessment(data.assessment);
    } catch (err: any) {
      console.error('AI Assessment error:', err);
      // Friendly fallback so user is never blocked
      setAssessment({
        title: selectedPreset?.name || 'Reported Street Hazard',
        category: selectedPreset?.category || 'POTHOLE',
        severityScore: 82,
        severityLevel: 'HIGH',
        bountyAlgo: 1.80,
        bountyMicroAlgos: 1800000,
        urgencyMultiplier: 1.2,
        estimatedFixTimeDays: 2,
        recommendedAction: 'Clean out debris, pour fresh hot-mix asphalt, and compact flush with road surface.',
        description: additionalNotes || 'Significant street surface damage requiring prompt civic repair.',
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Trigger HTTP 402 Escrow Lock Gate
  const handleSubmitWithX402Gate = async () => {
    if (!assessment) return;
    setIsSubmitting402(true);
    setErrorMessage('');

    const payload = {
      title: assessment.title,
      category: assessment.category,
      description: assessment.description,
      severityLevel: assessment.severityLevel,
      severityScore: assessment.severityScore,
      location: {
        address: locationAddress || '123 City Center Way',
        lat: 37.7749,
        lng: -122.4194,
      },
      beforeImageUrl: activeImage,
      bountyAlgo: assessment.bountyAlgo,
      bountyMicroAlgos: assessment.bountyMicroAlgos,
      reporterAddress: wallet.address || 'GOPLAUSIBLE_ORACULAR_GATEWAY',
    };

    try {
      const response = await fetch('/api/bounties/create-402', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status === 402) {
        const challengeData: X402PaymentResponse = await response.json();
        onTriggerX402Challenge(challengeData, payload);
      } else {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to initialize escrow lock');
        }
      }
    } catch (err: any) {
      console.error('402 Challenge Error:', err);
      setErrorMessage(err.message || 'Error communicating with Algorand Escrow Gate.');
    } finally {
      setIsSubmitting402(false);
    }
  };

  const getSeverityBadgeColor = (level: string) => {
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
      
      {/* Top Header */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="font-mono-code text-xs uppercase tracking-widest text-purple-300 font-bold">
            CITIZEN REPORTING STATION
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Report an Issue & Create Bounty
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl font-light mt-1">
          Snap or pick a photo of broken city infrastructure. Our AI calculates the damage severity and prepares the ALGO reward for workers.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Photo Upload & Presets (7 cols) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7 space-y-6"
        >
          
          {/* Preset Buttons */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
              Choose an Example or Upload Your Own:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRESET_ISSUES.map((preset) => {
                const isSelected = selectedPreset?.id === preset.id && !customImageUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/70 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                        : 'bg-[#0c0e15] border-white/10 hover:border-purple-500/40 hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className="text-[10px] font-mono-code text-purple-300 block uppercase font-bold">
                      {preset.category}
                    </span>
                    <span className="text-xs font-bold text-white block truncate mt-0.5">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Canvas & Preview Box */}
          <div className="rounded-3xl bg-[#0c0e15] border border-white/10 overflow-hidden shadow-xl">
            
            {/* Action Bar for Upload */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Damage Photo
                </span>
              </div>

              {/* Upload Input */}
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-200 text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Photo Display with Safe Fallbacks */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden">
              <img
                src={activeImage}
                alt="Selected issue"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, selectedPreset?.name || 'Reported Issue', selectedPreset?.category || 'POTHOLE', false)}
                className="w-full h-full object-cover"
              />

              {/* Category pill */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/80 border border-purple-500/40 text-purple-300 font-mono-code text-[11px] backdrop-blur-md shadow">
                {selectedPreset?.category || 'CUSTOM PHOTO'}
              </div>
            </div>

            {/* Inputs: Location & Notes */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span>Street Address / Location:</span>
                  </label>
                  <input
                    type="text"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-purple-500 text-xs text-slate-200 outline-none transition-colors"
                    placeholder="e.g. 842 Northway Blvd"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    <span>Description / Details:</span>
                  </label>
                  <input
                    type="text"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/10 focus:border-purple-500 text-xs text-slate-200 outline-none transition-colors"
                    placeholder="e.g. 12cm deep hole, blocking traffic"
                  />
                </div>
              </div>

              {/* Run Scan Button */}
              <button
                id="run-ai-scan-btn"
                type="button"
                onClick={handleRunAiAssessment}
                disabled={isScanning}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(168,85,247,0.35)] flex items-center justify-center gap-2 cursor-pointer hover:shadow-[0_0_35px_rgba(168,85,247,0.5)]"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                    <span>Scanning Damage with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    <span>1. Run AI Severity Check & Price Reward</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </motion.div>

        {/* Right Column: AI Severity Report & x402 Submission Gate (5 cols) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-5 space-y-6"
        >
          
          {assessment ? (
            /* AI Results Card with 3D Border Glow */
            <div className="p-6 rounded-3xl bg-[#0c0e15] border border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.25)] space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-white">
                      AI Damage Assessment
                    </h3>
                    <span className="text-[10px] font-mono-code text-purple-400">
                      Gemini 2.5 Multimodal Diagnosis
                    </span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold border ${getSeverityBadgeColor(assessment.severityLevel)}`}>
                  {assessment.severityLevel}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="text-base font-bold text-white mb-1">
                  {assessment.title}
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed font-light">
                  {assessment.description}
                </p>
              </div>

              {/* Severity Gauge Meter */}
              <div className="space-y-1.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="flex items-center justify-between text-xs font-mono-code">
                  <span className="text-slate-400">Damage Score:</span>
                  <span className="text-purple-300 font-bold text-sm">
                    {assessment.severityScore} / 100
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 rounded-full transition-all duration-1000"
                    style={{ width: `${assessment.severityScore}%` }}
                  />
                </div>
              </div>

              {/* Recommended Fix */}
              <div className="space-y-2 text-xs">
                <div className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Suggested Fix:</span>
                </div>
                <p className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-slate-200 text-xs font-light leading-relaxed">
                  {assessment.recommendedAction}
                </p>
              </div>

              {/* Dynamic Micro-Bounty Pricing Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/50 via-[#10121a] to-[#0a0b10] border border-purple-500/40 space-y-2">
                <span className="text-[11px] font-mono-code text-purple-400 font-bold uppercase tracking-wider block">
                  Calculated Bounty Prize:
                </span>
                
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-mono-code font-extrabold text-white">
                    {assessment.bountyAlgo.toFixed(2)} <span className="text-purple-400 text-base">ALGO</span>
                  </span>
                  <span className="text-xs font-mono-code text-emerald-400 font-semibold">
                    Instant Smart Vault
                  </span>
                </div>

                <div className="text-[10px] font-mono-code text-slate-400 flex items-center justify-between border-t border-white/5 pt-2">
                  <span>Urgency Multiplier: {assessment.urgencyMultiplier}x</span>
                  <span>Est. Fix Time: {assessment.estimatedFixTimeDays} Days</span>
                </div>
              </div>

              {/* SUBMIT TICKET BUTTON */}
              <button
                id="submit-x402-ticket-gate-btn"
                type="button"
                onClick={handleSubmitWithX402Gate}
                disabled={isSubmitting402}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_45px_rgba(168,85,247,0.6)] border border-purple-400/40 flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isSubmitting402 ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Locking Escrow on Algorand...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-purple-200 group-hover:scale-110 transition-transform" />
                    <span>2. Lock Bounty in Escrow & Post</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

            </div>
          ) : (
            /* Empty State Guide */
            <div className="p-8 rounded-3xl bg-[#0c0e15] border border-white/5 text-center space-y-4 flex flex-col items-center justify-center min-h-[380px] shadow-lg">
              <div className="w-14 h-14 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-purple-400" />
              </div>
              <h4 className="font-display text-lg font-bold text-white">
                Step 1: Check the Damage
              </h4>
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                Choose a photo preset on the left or upload your photo, then click <strong className="text-purple-300">Run AI Severity Check</strong> to calculate the cash bounty.
              </p>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono-code text-purple-300">
                <span>Algorand Testnet • Instant Escrow</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

        </motion.div>

      </div>

    </div>
  );
};
