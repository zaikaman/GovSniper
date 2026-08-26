import React, { useState, useMemo } from 'react';
import { 
  Radar, 
  PlusCircle, 
  Globe
} from 'lucide-react';
import type { Tender, TenderFilters } from '@/types';
import { TenderCard } from './TenderCard';
import { TenderFilterBar } from './TenderFilterBar';

interface RadarFeedProps {
  tenders: Tender[];
  onSelectTender: (tender: Tender) => void;
  onOpenWarRoom: (tender: Tender) => void;
  onOpenBidStudio: (tender: Tender) => void;
  onOpenIngestModal: () => void;
  onDeleteTender?: (id: string) => void;
  selectedTenderId?: string | null;
}

export const RadarFeed: React.FC<RadarFeedProps> = ({
  tenders,
  onSelectTender,
  onOpenWarRoom,
  onOpenBidStudio,
  onOpenIngestModal,
  onDeleteTender,
  selectedTenderId,
}) => {
  const [filters, setFilters] = useState<TenderFilters>({
    search: '',
    category: '',
    status: 'all',
    minBudget: 0,
    maxBudget: 0,
    sortBy: 'recent',
  });

  // Filter and sort tenders
  const filteredTenders = useMemo(() => {
    let list = [...tenders];

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.tenderNumber.toLowerCase().includes(q) ||
          t.agency.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      list = list.filter((t) => t.category.toLowerCase() === filters.category.toLowerCase());
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      list = list.filter((t) => t.status === filters.status);
    }

    // Sort order
    list.sort((a, b) => {
      switch (filters.sortBy) {
        case 'winScore':
          return b.winScore - a.winScore;
        case 'deadline':
          return a.submissionDeadline - b.submissionDeadline;
        case 'budget':
          return b.estimatedBudgetUsd - a.estimatedBudgetUsd;
        case 'recent':
        default:
          return b.scrapedAt - a.scrapedAt;
      }
    });

    return list;
  }, [tenders, filters]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-white tracking-wide flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <Radar className="w-7 h-7 text-cyber-cyan animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan"></span>
              </span>
            </div>
            Live Opportunity Radar
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Autonomous procurement discovery stream powered by Firecrawl & reactive Convex storage.
          </p>
        </div>

        {/* Live Ingestion Action Trigger */}
        <button
          onClick={onOpenIngestModal}
          className="cyber-button-primary gap-2 text-xs shadow-cyan-glow self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-black" />
          <span>Ingest Real Opportunity</span>
        </button>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <TenderFilterBar
        filters={filters}
        onFilterChange={setFilters}
        totalCount={tenders.length}
        filteredCount={filteredTenders.length}
      />

      {/* Opportunities Feed / Grid */}
      {filteredTenders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTenders.map((tender) => (
            <TenderCard
              key={tender._id}
              tender={tender}
              onSelectTender={onSelectTender}
              onOpenWarRoom={onOpenWarRoom}
              onOpenBidStudio={onOpenBidStudio}
              onDeleteTender={onDeleteTender}
              isSelected={selectedTenderId === tender._id}
            />
          ))}
        </div>
      ) : (
        <div className="cyber-card p-12 text-center max-w-xl mx-auto space-y-4 my-10 border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-cyber-surface border border-cyber-cyan/30 mx-auto flex items-center justify-center shadow-cyan-glow">
            <Globe className="w-8 h-8 text-cyber-cyan animate-pulse" />
          </div>
          <h3 className="text-lg font-display font-bold text-white">
            {tenders.length === 0 ? 'Radar Stream Ready' : 'No Opportunities Match Current Filters'}
          </h3>
          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            {tenders.length === 0
              ? 'No pre-seeded data. Ingest any real-world government or enterprise RFP URL to trigger live Firecrawl scraping and AI compliance analysis.'
              : 'Try adjusting your search keywords, sector category, or status filters.'}
          </p>
          {tenders.length === 0 ? (
            <button
              onClick={onOpenIngestModal}
              className="cyber-button-primary text-xs mx-auto px-5 py-2.5 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-black" />
              <span>Ingest Real Procurement Opportunity</span>
            </button>
          ) : (
            <button
              onClick={() =>
                setFilters({
                  search: '',
                  category: '',
                  status: 'all',
                  minBudget: 0,
                  maxBudget: 0,
                  sortBy: 'recent',
                })
              }
              className="cyber-button-secondary text-xs mx-auto px-4 py-2"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
