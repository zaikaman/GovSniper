import React from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  X,
  Layers
} from 'lucide-react';
import type { TenderFilters } from '@/types';

interface TenderFilterBarProps {
  filters: TenderFilters;
  onFilterChange: (filters: TenderFilters) => void;
  totalCount: number;
  filteredCount: number;
}

const CATEGORIES = [
  'All',
  'Energy',
  'IT & Cloud',
  'Infrastructure',
  'Defense',
  'Public Safety',
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'discovered', label: 'Discovered' },
  { value: 'analyzing', label: 'Analyzing' },
  { value: 'bidding', label: 'Active Bidding' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'won', label: 'Awarded Won' },
  { value: 'lost', label: 'Closed / Lost' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Ingested' },
  { value: 'winScore', label: 'Highest Win Probability' },
  { value: 'deadline', label: 'Nearest Deadline' },
  { value: 'budget', label: 'Highest Budget' },
];

export const TenderFilterBar: React.FC<TenderFilterBarProps> = ({
  filters,
  onFilterChange,
  totalCount,
  filteredCount,
}) => {
  const handleCategorySelect = (category: string) => {
    onFilterChange({
      ...filters,
      category: category === 'All' ? '' : category,
    });
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      category: '',
      status: 'all',
      minBudget: 0,
      maxBudget: 0,
      sortBy: 'recent',
    });
  };

  const hasActiveFilters = filters.search || filters.category || (filters.status && filters.status !== 'all');

  return (
    <div className="cyber-card p-4 space-y-4">
      {/* Top Search & Dropdowns Row */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search tenders by keyword, agency, title, or RFP number..."
            className="w-full pl-9 pr-8 py-2 bg-cyber-card border border-cyber-border rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyber-cyan transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-44">
            <Filter className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="w-full pl-8 pr-6 py-2 bg-cyber-card border border-cyber-border rounded-xl text-slate-200 text-xs font-mono appearance-none focus:outline-none focus:border-cyber-cyan cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-cyber-panel text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative flex-1 md:w-48">
            <ArrowUpDown className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="w-full pl-8 pr-6 py-2 bg-cyber-card border border-cyber-border rounded-xl text-slate-200 text-xs font-mono appearance-none focus:outline-none focus:border-cyber-cyan cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-cyber-panel text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills & Count Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-cyber-border/60 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mr-1">
            <Layers className="w-3 h-3 text-cyber-cyan" />
            Sector:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = (!filters.category && cat === 'All') || filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40 shadow-sm'
                    : 'bg-cyber-surface/60 text-slate-400 hover:text-slate-200 border border-cyber-border'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Counter and Reset */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-slate-400">
            Showing <strong className="text-white">{filteredCount}</strong> of <strong className="text-slate-400">{totalCount}</strong>
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-cyber-cyan hover:underline flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
