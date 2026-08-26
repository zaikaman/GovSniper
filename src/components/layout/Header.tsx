import React from 'react';
import { 
  Radio, 
  PlusCircle, 
  Building2, 
  Zap, 
  Activity,
  Cpu
} from 'lucide-react';

interface HeaderProps {
  onOpenIngestModal: () => void;
  onOpenVendorModal: () => void;
  onOpenPipelineModal: () => void;
  activeTenderCount?: number;
  hasSelectedTender?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenIngestModal,
  onOpenVendorModal,
  onOpenPipelineModal,
  activeTenderCount = 0,
  hasSelectedTender = false,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-cyber-bg/90 backdrop-blur-md border-b border-cyber-border px-6 py-3.5 flex items-center justify-between">
      {/* Brand & Mission Control ID */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyber-panel border border-cyber-cyan/30 shadow-cyan-glow">
            <Radio className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-cyan"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black tracking-wider text-lg text-white">
                GOV<span className="text-cyber-cyan">SNIPER</span>
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan">
                Autonomous Ops v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>PROCUREMENT COMMAND CENTER</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyber-emerald flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyber-emerald animate-pulse"></span>
                CONVEX REACTIVE
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Center Live Telemetry Bar */}
      <div className="hidden md:flex items-center gap-6 px-4 py-1.5 rounded-lg bg-cyber-panel/60 border border-cyber-border text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>RADAR FEED:</span>
          <span className="font-bold text-white">{activeTenderCount} ACTIVE</span>
        </div>
        <div className="h-3 w-px bg-slate-700"></div>
        <div className="flex items-center gap-2 text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-cyber-emerald" />
          <span>INTELLIGENCE:</span>
          <span className="font-bold text-cyber-emerald">ONLINE (GPT-4O)</span>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-3">
        {/* Vendor Profile Configuration */}
        <button
          onClick={onOpenVendorModal}
          className="cyber-button-secondary gap-2 text-xs"
          title="Configure company capabilities and vector embeddings"
        >
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Vendor Profile</span>
        </button>

        {/* Live Ingest Real Portal URL */}
        <button
          onClick={onOpenIngestModal}
          className="cyber-button-secondary gap-2 text-xs border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10"
        >
          <PlusCircle className="w-3.5 h-3.5 text-cyber-cyan" />
          <span>Ingest Real RFP</span>
        </button>

        {/* Autonomous Pipeline Run Trigger */}
        <button
          onClick={onOpenPipelineModal}
          className="cyber-button-primary gap-2 text-xs shadow-cyan-glow"
          title={hasSelectedTender ? 'Run autonomous pipeline on selected RFP' : 'Run autonomous procurement pipeline'}
        >
          <Zap className="w-3.5 h-3.5 fill-black" />
          <span>Run Live Pipeline</span>
        </button>
      </div>
    </header>
  );
};
