import React from 'react';
import { 
  Building, 
  Calendar, 
  DollarSign, 
  Mail, 
  ExternalLink, 
  Trash2,
  Crosshair,
  PenTool
} from 'lucide-react';
import type { Tender } from '@/types';
import { 
  formatCompactCurrency, 
  formatDate, 
  formatDeadlineCountdown, 
  getWinScoreVisuals, 
  getStatusBadge 
} from '@/lib/utils';

interface TenderCardProps {
  tender: Tender;
  onSelectTender: (tender: Tender) => void;
  onOpenWarRoom: (tender: Tender) => void;
  onOpenBidStudio: (tender: Tender) => void;
  onDeleteTender?: (id: string) => void;
  isSelected?: boolean;
}

export const TenderCard: React.FC<TenderCardProps> = ({
  tender,
  onSelectTender,
  onOpenWarRoom,
  onOpenBidStudio,
  onDeleteTender,
  isSelected = false,
}) => {
  const winVisuals = getWinScoreVisuals(tender.winScore);
  const statusBadge = getStatusBadge(tender.status);
  const deadline = formatDeadlineCountdown(tender.submissionDeadline);

  return (
    <div
      onClick={() => onSelectTender(tender)}
      className={`group relative cyber-card p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
        isSelected ? 'cyber-card-active ring-1 ring-cyber-cyan' : ''
      }`}
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-cyan"></span>
            </span>
            <span className="text-xs font-mono font-bold text-cyber-cyan tracking-wider">
              {tender.tenderNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={statusBadge.badgeClass}>
              {statusBadge.label}
            </span>
            {onDeleteTender && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTender(tender._id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded transition-all"
                title="Delete opportunity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Opportunity Title */}
        <h3 className="text-base font-display font-bold text-white group-hover:text-cyber-cyan transition-colors line-clamp-2 mb-1.5">
          {tender.title}
        </h3>

        {/* Issuing Agency & Category */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-3">
          <Building className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate max-w-[200px]">{tender.agency}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300 bg-cyber-surface px-2 py-0.5 rounded text-[10px]">
            {tender.category}
          </span>
        </div>

        {/* Synopsis / Summary */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {tender.summary}
        </p>
      </div>

      {/* Metrics & Action Footer */}
      <div className="space-y-3 pt-3 border-t border-cyber-border/60">
        <div className="grid grid-cols-3 gap-2 py-1">
          {/* Budget */}
          <div className="bg-cyber-surface/40 p-2 rounded-lg border border-cyber-border">
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-slate-400" />
              <span>BUDGET</span>
            </div>
            <div className="text-xs font-mono font-bold text-white mt-0.5">
              {formatCompactCurrency(tender.estimatedBudgetUsd)}
            </div>
          </div>

          {/* Deadline */}
          <div className="bg-cyber-surface/40 p-2 rounded-lg border border-cyber-border">
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>DUE</span>
            </div>
            <div
              className={`text-xs font-mono font-bold mt-0.5 ${
                deadline.isUrgent ? 'text-cyber-amber' : deadline.isExpired ? 'text-red-400' : 'text-slate-200'
              }`}
              title={formatDate(tender.submissionDeadline)}
            >
              {deadline.text}
            </div>
          </div>

          {/* Win Probability Score */}
          <div className={`p-2 rounded-lg border ${winVisuals.bgColor} ${winVisuals.borderColor}`}>
            <div className="text-[10px] font-mono text-slate-400">WIN PROB</div>
            <div className={`text-xs font-mono font-black mt-0.5 ${winVisuals.textColor}`}>
              {tender.winScore}%
            </div>
          </div>
        </div>

        {/* Dedicated AgentMail preview */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-cyber-bg/60 px-2.5 py-1.5 rounded border border-cyber-border">
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="w-3.5 h-3.5 text-cyber-cyan" />
            <span className="truncate">{tender.assignedAgentEmail}</span>
          </div>
          {tender.sourceUrl && (
            <a
              href={tender.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-slate-500 hover:text-cyber-cyan transition-colors"
              title="Open source portal link"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenWarRoom(tender);
            }}
            className="cyber-button-secondary py-1.5 text-xs gap-1.5 justify-center"
          >
            <Crosshair className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>War Room</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenBidStudio(tender);
            }}
            className="cyber-button-secondary py-1.5 text-xs gap-1.5 justify-center hover:border-cyber-emerald/40 hover:text-cyber-emerald"
          >
            <PenTool className="w-3.5 h-3.5 text-cyber-emerald" />
            <span>Bid Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
