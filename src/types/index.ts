/**
 * Domain types and models for GovSniper Procurement Command Center
 */

export type TenderStatus = 'discovered' | 'analyzing' | 'bidding' | 'submitted' | 'won' | 'lost';
export type RiskLevel = 'low' | 'medium' | 'high';
export type ComplianceCategory = 'Legal' | 'Technical' | 'Financial' | 'Insurance' | 'Operational';
export type ComplianceStatus = 'passed' | 'warning' | 'disqualified';
export type ProposalStatus = 'drafting' | 'in_review' | 'approved' | 'exported';
export type EmailDirection = 'inbound' | 'outbound';
export type AuditActionType =
  | 'crawl_discovered'
  | 'analysis_started'
  | 'analysis_completed'
  | 'score_updated'
  | 'addendum_received'
  | 'rfi_dispatched'
  | 'proposal_generated'
  | 'proposal_edited'
  | 'simulation_step'
  | 'pipeline_step'
  | 'vendor_profile_updated';

export interface PastPerformanceItem {
  title: string;
  client: string;
  valueUsd: number;
  year: number;
  summary: string;
}

export interface VendorProfile {
  _id?: string;
  name: string;
  industry: string;
  capabilities: string[];
  certifications: string[];
  bondingLimitUsd: number;
  pastPerformance: PastPerformanceItem[];
  capabilityEmbedding?: number[];
  updatedAt: number;
}

export interface Tender {
  _id: string;
  tenderNumber: string;
  title: string;
  agency: string;
  category: string;
  estimatedBudgetUsd: number;
  status: TenderStatus;
  sourceUrl: string;
  submissionDeadline: number;
  scrapedAt: number;
  specsMarkdown: string;
  summary: string;
  winScore: number;
  riskLevel: RiskLevel;
  assignedAgentEmail: string;
  officerName?: string;
  officerEmail?: string;
  specEmbedding?: number[];
}

export interface ComplianceCheck {
  _id: string;
  tenderId: string;
  category: ComplianceCategory;
  requirementText: string;
  status: ComplianceStatus;
  citation: string;
  notes: string;
  isDisqualifier: boolean;
}

export interface Proposal {
  _id: string;
  tenderId: string;
  version: number;
  title: string;
  executiveSummary: string;
  technicalApproach: string;
  pricingStrategy: string;
  teamQualifications: string;
  liveContent: string;
  lastEditedBy: string;
  status: ProposalStatus;
  updatedAt: number;
}

export interface EmailThread {
  _id: string;
  tenderId: string;
  subject: string;
  agentEmail: string;
  officerEmail: string;
  officerName: string;
  lastMessageAt: number;
}

export interface EmailMessage {
  _id: string;
  threadId: string;
  tenderId: string;
  messageId: string;
  direction: EmailDirection;
  sender: string;
  recipient: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
  isAddendum: boolean;
  redlineDiff?: string;
  createdAt: number;
}

export interface AuditLog {
  _id: string;
  tenderId?: string;
  actionType: AuditActionType;
  actor: string;
  details: string;
  metadata?: string;
  timestamp: number;
}

export type NavView = 'radar' | 'warroom' | 'studio' | 'inboxes' | 'audit';

export interface TenderFilters {
  search: string;
  category: string;
  status: string;
  minBudget: number;
  maxBudget: number;
  sortBy: 'deadline' | 'winScore' | 'budget' | 'recent';
}
