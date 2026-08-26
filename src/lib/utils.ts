import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { RiskLevel, TenderStatus } from '@/types';

/**
 * Merge multiple Tailwind and conditional class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency as standard USD string (e.g. $14,500,000)
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format currency compactly (e.g. $14.5M, $750K)
 */
export function formatCompactCurrency(amount: number): string {
  if (isNaN(amount) || amount === 0) return '$0';
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return formatCurrency(amount);
}

/**
 * Format timestamp as human-readable date string
 */
export function formatDate(timestamp: number): string {
  if (!timestamp) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp));
}

/**
 * Format relative deadline/time countdown
 */
export function formatDeadlineCountdown(deadlineTimestamp: number): {
  text: string;
  isUrgent: boolean;
  isExpired: boolean;
} {
  if (!deadlineTimestamp) return { text: 'No deadline', isUrgent: false, isExpired: false };
  
  const diffMs = deadlineTimestamp - Date.now();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) {
    return { text: 'Closed', isUrgent: false, isExpired: true };
  }
  if (diffDays === 1) {
    return { text: '1 day left', isUrgent: true, isExpired: false };
  }
  if (diffDays <= 7) {
    return { text: `${diffDays} days left`, isUrgent: true, isExpired: false };
  }
  return { text: `${diffDays} days left`, isUrgent: false, isExpired: false };
}

/**
 * Calculate win probability rating visual properties
 */
export function getWinScoreVisuals(score: number): {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  strokeColor: string;
} {
  if (score >= 75) {
    return {
      label: 'High Probability',
      textColor: 'text-cyber-emerald',
      bgColor: 'bg-cyber-emerald/10',
      borderColor: 'border-cyber-emerald/40',
      glowColor: 'shadow-emerald-glow',
      strokeColor: '#10b981',
    };
  }
  if (score >= 50) {
    return {
      label: 'Viable Opportunity',
      textColor: 'text-cyber-cyan',
      bgColor: 'bg-cyber-cyan/10',
      borderColor: 'border-cyber-cyan/40',
      glowColor: 'shadow-cyan-glow',
      strokeColor: '#00f0ff',
    };
  }
  if (score >= 30) {
    return {
      label: 'Elevated Risk',
      textColor: 'text-cyber-amber',
      bgColor: 'bg-cyber-amber/10',
      borderColor: 'border-cyber-amber/40',
      glowColor: 'shadow-amber-glow',
      strokeColor: '#f59e0b',
    };
  }
  return {
    label: 'Low Match',
    textColor: 'text-cyber-crimson',
    bgColor: 'bg-cyber-crimson/10',
    borderColor: 'border-cyber-crimson/40',
    glowColor: 'shadow-red-500/30',
    strokeColor: '#ef4444',
  };
}

/**
 * Get visual badge colors for tender lifecycle status
 */
export function getStatusBadge(status: TenderStatus): {
  label: string;
  badgeClass: string;
} {
  switch (status) {
    case 'discovered':
      return { label: 'Discovered', badgeClass: 'cyber-badge-cyan' };
    case 'analyzing':
      return { label: 'Analyzing', badgeClass: 'cyber-badge-amber' };
    case 'bidding':
      return { label: 'Active Bidding', badgeClass: 'cyber-badge-emerald' };
    case 'submitted':
      return { label: 'Submitted', badgeClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30 border inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full font-mono' };
    case 'won':
      return { label: 'Awarded Won', badgeClass: 'cyber-badge-emerald' };
    case 'lost':
      return { label: 'Closed / Lost', badgeClass: 'cyber-badge-crimson' };
  }
}

/**
 * Get risk badge visual properties
 */
export function getRiskBadge(risk: RiskLevel): {
  label: string;
  badgeClass: string;
} {
  switch (risk) {
    case 'low':
      return { label: 'Low Risk', badgeClass: 'cyber-badge-emerald' };
    case 'medium':
      return { label: 'Medium Risk', badgeClass: 'cyber-badge-amber' };
    case 'high':
      return { label: 'High Risk', badgeClass: 'cyber-badge-crimson' };
  }
}
