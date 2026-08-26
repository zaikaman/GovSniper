import React, { useState } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { RadarFeed } from '@/components/radar/RadarFeed';
import { IngestTenderModal } from '@/components/radar/IngestTenderModal';
import { VendorProfileModal } from '@/components/vendor/VendorProfileModal';
import type { NavView, Tender, VendorProfile } from '@/types';
import { 
  Crosshair, 
  PenTool, 
  Mail, 
  History, 
  Zap,
  ArrowRight
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<NavView>('radar');
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);

  // Modals
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);

  // Convex Reactive Queries & Mutations
  const rawTenders = useQuery(api.tenders.list, {}) || [];
  const vendorProfile = useQuery(api.vendors.getProfile, {});
  const deleteTenderMutation = useMutation(api.tenders.deleteTender);
  const saveVendorProfileMutation = useMutation(api.vendors.saveProfile);
  const scrapeAndIngestAction = useAction(api.firecrawl.scrapeAndIngestPortal);

  // Convert raw DB docs to typed Tenders
  const tenders: Tender[] = rawTenders as Tender[];

  const handleSelectTender = (tender: Tender) => {
    setSelectedTender(tender);
  };

  const handleOpenWarRoom = (tender: Tender) => {
    setSelectedTender(tender);
    setCurrentView('warroom');
  };

  const handleOpenBidStudio = (tender: Tender) => {
    setSelectedTender(tender);
    setCurrentView('studio');
  };

  const handleDeleteTender = async (id: string) => {
    try {
      await deleteTenderMutation({ id: id as any });
      if (selectedTender?._id === id) {
        setSelectedTender(null);
      }
    } catch (err) {
      console.error('Failed to delete tender:', err);
    }
  };

  const handleIngestUrl = async (url: string, category?: string, budget?: number) => {
    return await scrapeAndIngestAction({
      url,
      categoryOverride: category,
      budgetOverride: budget,
    });
  };

  const handleSaveVendorProfile = async (profile: Omit<VendorProfile, '_id' | 'updatedAt' | 'capabilityEmbedding'>) => {
    await saveVendorProfileMutation(profile);
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col font-sans selection:bg-cyber-cyan selection:text-black">
      {/* Mission Control Navigation Header */}
      <Header
        onOpenIngestModal={() => setIsIngestModalOpen(true)}
        onOpenVendorModal={() => setIsVendorModalOpen(true)}
        onOpenPipelineModal={() => setIsPipelineModalOpen(true)}
        activeTenderCount={tenders.length}
        hasSelectedTender={!!selectedTender}
      />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Operations Matrix Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={(view) => setCurrentView(view)}
          hasActiveTender={!!selectedTender}
          unreadEmailCount={0}
        />

        {/* Center Stage Panel */}
        <main className="flex-1 overflow-y-auto p-6 bg-cyber-bg radar-grid min-h-[calc(100vh-61px)]">
          {currentView === 'radar' && (
            <RadarFeed
              tenders={tenders}
              onSelectTender={handleSelectTender}
              onOpenWarRoom={handleOpenWarRoom}
              onOpenBidStudio={handleOpenBidStudio}
              onOpenIngestModal={() => setIsIngestModalOpen(true)}
              onDeleteTender={handleDeleteTender}
              selectedTenderId={selectedTender?._id}
            />
          )}

          {currentView === 'warroom' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-cyber-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30">
                    <Crosshair className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-xl font-display font-bold text-white">
                      Tender War Room {selectedTender && `// ${selectedTender.tenderNumber}`}
                    </h1>
                    <p className="text-xs font-mono text-slate-400">
                      {selectedTender ? selectedTender.title : 'Select an opportunity from Radar Discovery to begin analysis'}
                    </p>
                  </div>
                </div>

                {selectedTender && (
                  <button
                    onClick={() => setCurrentView('studio')}
                    className="cyber-button-primary text-xs gap-1.5"
                  >
                    <span>Proceed to Bid Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {!selectedTender ? (
                <div className="cyber-card p-10 text-center text-slate-400 font-mono text-xs max-w-lg mx-auto my-12 space-y-3">
                  <p>No tender currently selected for inspection.</p>
                  <button
                    onClick={() => setCurrentView('radar')}
                    className="cyber-button-secondary text-xs px-4 py-2"
                  >
                    Browse Radar Discovery
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Summary card */}
                  <div className="cyber-card p-5 space-y-3 lg:col-span-2">
                    <h3 className="text-sm font-mono font-bold text-cyber-cyan uppercase">
                      Opportunity Overview
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedTender.summary}
                    </p>
                    <div className="pt-2 text-xs font-mono text-slate-400 space-y-1">
                      <div>Agency: <span className="text-white">{selectedTender.agency}</span></div>
                      <div>Assigned Inbox: <span className="text-cyber-cyan">{selectedTender.assignedAgentEmail}</span></div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="cyber-card p-5 space-y-3">
                    <h3 className="text-sm font-mono font-bold text-white uppercase">
                      Telemetry
                    </h3>
                    <div className="text-xs font-mono space-y-2">
                      <div className="flex justify-between py-1 border-b border-cyber-border">
                        <span className="text-slate-400">Win Probability:</span>
                        <span className="text-cyber-cyan font-bold">{selectedTender.winScore}%</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-cyber-border">
                        <span className="text-slate-400">Risk Assessment:</span>
                        <span className="text-cyber-amber uppercase font-bold">{selectedTender.riskLevel}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Sector Category:</span>
                        <span className="text-white">{selectedTender.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === 'studio' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-cyber-border">
                <div className="p-2 rounded-xl bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30">
                  <PenTool className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold text-white">
                    Collaborative Bid Studio
                  </h1>
                  <p className="text-xs font-mono text-slate-400">
                    Real-time Citation-Backed Proposal Authoring & AI Generation
                  </p>
                </div>
              </div>
              <div className="cyber-card p-8 text-center text-slate-400 font-mono text-xs">
                Collaborative proposal editor will be wired in Phase 6.
              </div>
            </div>
          )}

          {currentView === 'inboxes' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-cyber-border">
                <div className="p-2 rounded-xl bg-cyber-amber/10 text-cyber-amber border border-cyber-amber/30">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold text-white">
                    AgentMail Communications Hub
                  </h1>
                  <p className="text-xs font-mono text-slate-400">
                    Dedicated RFP Inboxes & Inbound Addendum Diff Engine
                  </p>
                </div>
              </div>
              <div className="cyber-card p-8 text-center text-slate-400 font-mono text-xs">
                AgentMail autonomous inbox management will be wired in Phase 5.
              </div>
            </div>
          )}

          {currentView === 'audit' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-cyber-border">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold text-white">
                    Immutable Audit Trace
                  </h1>
                  <p className="text-xs font-mono text-slate-400">
                    Chronological Ledger of Autonomous Agent Actions & Decisions
                  </p>
                </div>
              </div>
              <div className="cyber-card p-8 text-center text-slate-400 font-mono text-xs">
                Chronological audit timeline stream will be wired in Phase 7.
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Real RFP Portal Ingestion Modal */}
      <IngestTenderModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        onIngest={handleIngestUrl}
        onSuccess={(tenderId) => {
          console.log('Successfully ingested tender with ID:', tenderId);
        }}
      />

      {/* Vendor Profile Configuration Modal */}
      <VendorProfileModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        onSaveProfile={handleSaveVendorProfile}
        currentProfile={vendorProfile}
      />

      {/* Autonomous Pipeline Modal */}
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
