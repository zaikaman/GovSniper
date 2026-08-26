import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  DollarSign,
  ArrowRight
} from 'lucide-react';

interface IngestTenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngest: (url: string, category?: string, budget?: number) => Promise<any>;
  onSuccess?: (tenderId: string) => void;
}

export const IngestTenderModal: React.FC<IngestTenderModalProps> = ({
  isOpen,
  onClose,
  onIngest,
  onSuccess,
}) => {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Energy');
  const [budgetUsd, setBudgetUsd] = useState<number | undefined>(undefined);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessResult(null);

    try {
      setCurrentStep('1/3: Scraping portal content via Firecrawl...');
      const result = await onIngest(url.trim(), category, budgetUsd);
      
      setCurrentStep('2/3: Extracting structured RFP metadata & clause specs...');
      setCurrentStep('3/3: Provisioning AgentMail inbox & reactive indexing...');
      
      setSuccessResult(result);
      if (onSuccess && result?.tenderId) {
        setTimeout(() => {
          onSuccess(result.tenderId);
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      console.error('Ingestion failed:', err);
      setErrorMsg(err.message || 'Failed to ingest opportunity from URL. Check network or URL access.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-cyber-panel border border-cyber-cyan/40 rounded-2xl p-6 shadow-cyan-glow space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyber-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold text-white">
                Ingest Real Procurement Opportunity
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Firecrawl live crawling & Markdown ingestion engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-cyber-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ingestion Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target URL */}
          <div>
            <label className="block font-mono font-bold text-slate-300 uppercase mb-1.5 flex items-center justify-between">
              <span>Procurement Portal URL / Document Link</span>
              <span className="text-cyber-cyan font-mono">Live Web / PDF</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://procurement.agency.gov/solicitations/rfp-2026-grid"
              required
              disabled={isProcessing}
              className="w-full px-3 py-2.5 bg-cyber-card border border-cyber-border rounded-xl text-white font-mono focus:outline-none focus:border-cyber-cyan transition-colors"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Provide any real government or enterprise RFP link. Firecrawl will bypass JS rendering and extract clean markdown.
            </p>
          </div>

          {/* Optional Sector & Budget Override */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyber-cyan" />
                <span>Sector Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isProcessing}
                className="w-full px-3 py-2 bg-cyber-card border border-cyber-border rounded-xl text-slate-200 font-mono focus:outline-none focus:border-cyber-cyan cursor-pointer"
              >
                <option value="Energy">Energy</option>
                <option value="IT & Cloud">IT & Cloud</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Defense">Defense</option>
                <option value="Public Safety">Public Safety</option>
              </select>
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-cyber-emerald" />
                <span>Estimated Budget (USD)</span>
              </label>
              <input
                type="number"
                value={budgetUsd || ''}
                onChange={(e) => setBudgetUsd(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Auto-extracted if blank"
                disabled={isProcessing}
                min={0}
                step={100000}
                className="w-full px-3 py-2 bg-cyber-card border border-cyber-border rounded-xl text-white font-mono focus:outline-none focus:border-cyber-emerald"
              />
            </div>
          </div>

          {/* Status / Steps feedback */}
          {isProcessing && (
            <div className="p-3 rounded-xl bg-cyber-surface/70 border border-cyber-cyan/30 space-y-2 animate-pulse">
              <div className="flex items-center gap-2 text-cyber-cyan font-mono font-semibold">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Ingesting from Live Portal...</span>
              </div>
              <p className="text-[11px] font-mono text-slate-300">{currentStep}</p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold">Ingestion Error</div>
                <div className="text-[11px] leading-relaxed">{errorMsg}</div>
              </div>
            </div>
          )}

          {successResult && (
            <div className="p-3 rounded-xl bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <div className="font-bold">Opportunity Ingested Successfully!</div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Assigned Inbox: {successResult.assignedAgentEmail}
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-cyber-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="cyber-button-secondary px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || !url.trim()}
              className="cyber-button-primary px-5 py-2 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>Ingest Opportunity</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
