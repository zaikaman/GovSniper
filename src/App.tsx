import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { VendorProfileModal } from '@/components/vendor/VendorProfileModal';
import type { NavView, Tender } from '@/types';
import { 
  Radar, 
  Crosshair, 
  PenTool, 
  Mail, 
  History, 
  PlusCircle, 
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<NavView>('radar');
  const [selectedTender] = useState<Tender | null>(null);
  
  // Modals
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);

  // Ingestion input state for live portal scraping
  const [portalUrl, setPortalUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  const handleIngestPortal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalUrl.trim()) return;

    setIsScraping(true);
    try {
      // Live Firecrawl ingestion will be invoked here (Phase 3)
      console.log('Ingesting live portal URL:', portalUrl);
      setTimeout(() => {
        setIsScraping(false);
        setIsIngestModalOpen(false);
        setPortalUrl('');
      }, 1500);
    } catch (err) {
      console.error('Failed to ingest portal:', err);
      setIsScraping(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col font-sans selection:bg-cyber-cyan selection:text-black">
      {/* Top Mission Control Header */}
      <Header
        onOpenIngestModal={() => setIsIngestModalOpen(true)}
        onOpenVendorModal={() => setIsVendorModalOpen(true)}
        onOpenPipelineModal={() => setIsPipelineModalOpen(true)}
        activeTenderCount={selectedTender ? 1 : 0}
        hasSelectedTender={!!selectedTender}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={(view) => setCurrentView(view)}
          hasActiveTender={!!selectedTender}
          unreadEmailCount={0}
        />

        {/* Dynamic Center Stage Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-bg radar-grid min-h-[calc(100vh-61px)]">
          {currentView === 'radar' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Radar Feed Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-display font-extrabold text-white flex items-center gap-3">
                    <Radar className="w-7 h-7 text-cyber-cyan animate-pulse" />
                    Live Opportunity Radar
                  </h1>
                  <p className="text-xs font-mono text-slate-400 mt-1">
                    Real-time ingestion feed from public portals, enterprise procurement feeds, and Firecrawl scraping.
                  </p>
                </div>
                <button
                  onClick={() => setIsIngestModalOpen(true)}
                  className="cyber-button-primary gap-2 text-xs"
                >
                  <PlusCircle className="w-4 h-4 text-black" />
                  <span>Ingest Real Opportunity</span>
                </button>
              </div>

              {/* Empty state or tender list placeholder */}
              <div className="cyber-card p-12 text-center max-w-xl mx-auto space-y-4 my-12 border-dashed">
                <div className="w-16 h-16 rounded-2xl bg-cyber-surface border border-cyber-cyan/30 mx-auto flex items-center justify-center shadow-cyan-glow">
                  <Globe className="w-8 h-8 text-cyber-cyan animate-pulse" />
                </div>
                <h3 className="text-lg font-display font-bold text-white">
                  Radar Scanning Ready
                </h3>
                <p className="text-xs text-slate-400 font-mono leading-relaxed">
                  No pre-seeded data. Paste any municipal or enterprise procurement URL (e.g. city RFP portals, SAM.gov, public tenders) to trigger live Firecrawl scraping and AI compliance analysis.
                </p>
                <button
                  onClick={() => setIsIngestModalOpen(true)}
                  className="cyber-button-primary text-xs mx-auto px-5 py-2.5 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-black" />
                  <span>Ingest Live RFP Portal</span>
                </button>
              </div>
            </div>
          )}

          {currentView === 'warroom' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-cyber-border">
                <Crosshair className="w-6 h-6 text-cyber-cyan" />
                <div>
                  <h1 className="text-xl font-display font-bold text-white">
                    Tender War Room
                  </h1>
                  <p className="text-xs font-mono text-slate-400">
                    Automated Compliance Matrix Extraction & Win Probability Scoring
                  </p>
                </div>
              </div>
              <div className="cyber-card p-8 text-center text-slate-400 font-mono text-xs">
                Select an opportunity from Radar Discovery to inspect extracted clauses, disqualifiers, and live win probability.
              </div>
            </div>
          )}

          {currentView === 'studio' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-cyber-border">
                <PenTool className="w-6 h-6 text-cyber-cyan" />
                <div>
                  <h1 className="text-xl font-display font-bold text-white">
                    Collaborative Bid Studio
                  </h1>
                  <p className="text-xs font-mono text-slate-400">
                    Real-time Proposal Authoring with Verified Clause Citations
                  </p>
                </div>
              </div>
              <div className="cyber-card p-8 text-center text-slate-400 font-mono text-xs">
                Active proposal drafting workspace with real-time multi-user cursor presence and AI section synthesis.
              </div>
            </div>
          )}

          {currentView === 'inboxes' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-cyber-border">
                <Mail className="w-6 h-6 text-cyber-cyan" />
                <div>
                  <h1 className="text-xl font-display font-bold text-white">
                    AgentMail Communications Hub
                  </h1>
                  <p className="text-xs font-mono text-slate-400">
                    Autonomous Dedicated Inboxes & Inbound Addendum Redline Alerts
                  </p>
                </div>
              </div>
              <div className="cyber-card p-8 text-center text-slate-400 font-mono text-xs">
                Dedicated RFP email inboxes provisioned on AgentMail with automatic redline diff extraction.
              </div>
            </div>
          )}

          {currentView === 'audit' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-cyber-border">
                <History className="w-6 h-6 text-cyber-cyan" />
                <div>
                  <h1 className="text-xl font-display font-bold text-white">
                    Immutable Audit Trace
                  </h1>
                  <p className="text-xs font-mono text-slate-400">
                    Chronological Ledger of Autonomous Agent Decisions & Ingestions
                  </p>
                </div>
              </div>
              <div className="cyber-card p-8 text-center text-slate-400 font-mono text-xs">
                Real-time chronological log stream recorded directly in Convex database.
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Vendor Profile Configuration Modal */}
      <VendorProfileModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
      />

      {/* Live RFP Ingestion Modal */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-cyber-panel border border-cyber-cyan/40 rounded-2xl p-6 shadow-cyan-glow space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="text-base font-display font-bold text-white">
                  Ingest Live RFP Portal
                </h3>
              </div>
              <button
                onClick={() => setIsIngestModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIngestPortal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5">
                  Procurement Portal URL / Document Link
                </label>
                <input
                  type="url"
                  value={portalUrl}
                  onChange={(e) => setPortalUrl(e.target.value)}
                  placeholder="https://procurement.austintexas.gov/tenders/rfp-2026-grid"
                  required
                  className="w-full px-3 py-2 bg-cyber-card border border-cyber-border rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyber-cyan"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Firecrawl will scrape the URL, parse specifications into clean Markdown, and extract budget/deadline metadata.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-cyber-border">
                <button
                  type="button"
                  onClick={() => setIsIngestModalOpen(false)}
                  className="cyber-button-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScraping}
                  className="cyber-button-primary text-xs px-4 py-2 flex items-center gap-2"
                >
                  {isScraping ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-black" />
                      <span>Scraping via Firecrawl...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-black" />
                      <span>Start Live Ingestion</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Pipeline Execution Modal Placeholder */}
      {isPipelineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-cyber-panel border border-cyber-cyan/40 rounded-2xl p-6 shadow-cyan-glow space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cyber-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyber-cyan/10 text-cyber-cyan">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-display font-bold text-white">
                  Autonomous Procurement Pipeline
                </h3>
              </div>
              <button
                onClick={() => setIsPipelineModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              Executes all 5 stages in sequence on live data:
              <br />1. Real Firecrawl portal scraping & Markdown ingestion
              <br />2. OpenAI Structured Compliance Matrix Extraction
              <br />3. Convex Vector Embedding & Win Probability Scoring
              <br />4. AgentMail Dedicated Opportunity Inbox Provisioning
              <br />5. Collaborative Bid Studio First-Draft Proposal Generation
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-cyber-border">
              <button
                type="button"
                onClick={() => setIsPipelineModalOpen(false)}
                className="cyber-button-secondary text-xs px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
