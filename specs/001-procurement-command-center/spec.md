# Feature Specification: Autonomous Public & Enterprise Procurement Command Center

**Feature Branch**: `main`  
**Created**: 2026-08-26  
**Status**: Draft  
**Input**: User description from IDEA.md: Autonomous public and enterprise procurement command center for discovering tenders, extracting compliance matrices, auto-drafting bids, and orchestrating email communications with contracting officers.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Live Tender Discovery & Radar Triage (Priority: P1)

As a procurement specialist or bid manager, I want an autonomous real-time radar feed that constantly discovers, ingests, and standardizes opportunities from municipal and enterprise portals, so that our team never misses high-value RFPs and can instantly filter opportunities by budget, category, and deadline.

**Why this priority**: Discovering and aggregating incoming opportunities in a standardized format is the entry gateway for the entire procurement lifecycle. Without opportunities in the radar, no downstream compliance or bidding can occur.

**Independent Test**: The user can view a live streaming list of opportunities, filter by category/budget, and view core metadata (issuing agency, estimated value, submission deadline, status) without any manual data entry.

**Acceptance Scenarios**:
1. **Given** new tenders have been published or ingested, **When** the user opens the Radar Discovery Center, **Then** the opportunities appear dynamically in the feed sorted by recency and urgency with visible status badges (`Discovered`, `Analyzing`, `Bidding`).
2. **Given** a feed of multiple tenders across different sectors, **When** the user applies filters for category, minimum budget, and deadline range, **Then** the list updates instantly to display only matching opportunities.
3. **Given** an opportunity in the radar, **When** the user selects it, **Then** the system presents detailed metadata, source links, and full specification text.

---

### User Story 2 - Automated Compliance Matrix & Win Probability Scoring (Priority: P2)

As a proposal director, I want the system to automatically analyze complex RFP specification documents against our company profile, extract hard disqualifiers and compliance items, and compute a Win Probability Score (0–100%), so that we can make rapid "Go / No-Go" bidding decisions with full confidence.

**Why this priority**: Vetting 100+ page specs manually takes days and carries severe risk of missing fine-print disqualifiers (e.g., bonding limits, mandatory ISO/SOC certifications). Automating compliance analysis unlocks massive operational efficiency.

**Independent Test**: The user can open any ingested opportunity and immediately inspect a structured compliance matrix with categorized requirements (Legal, Technical, Financial, Insurance), each marked with status (`Passed`, `Warning`, `Disqualified`) and backed by direct clause citations from the source document.

**Acceptance Scenarios**:
1. **Given** an opportunity with complete specification text, **When** compliance analysis runs, **Then** a structured checklist of requirements is generated, categorizing items by domain and highlighting any critical disqualifiers.
2. **Given** an active vendor capability profile and past project portfolio, **When** the system evaluates the opportunity, **Then** a dynamic Win Probability Score (0–100%) and risk tier (`Low`, `Medium`, `High`) are calculated and visually displayed.
3. **Given** an extracted compliance item, **When** the user clicks on the citation link, **Then** the exact source paragraph/clause from the original RFP document is highlighted.

---

### User Story 3 - Autonomous Opportunity Inboxes & Addendum Diffing (Priority: P3)

As a bid manager, I want each tracked procurement opportunity to have a dedicated, autonomous email address that receives official addendums from contracting officers and drafts formal clarification questions (RFIs), so that all critical communications are captured, redlined, and addressed without human inbox clutter.

**Why this priority**: Official amendments and Q&A addendums arrive via email and frequently alter specifications or deadlines. Missing an email addendum leads to immediate disqualification.

**Independent Test**: The user can view a dedicated communication hub for a tender, see inbound messages and redline changes when an addendum arrives, and trigger AI-assisted drafting of clarification inquiries to contracting officers.

**Acceptance Scenarios**:
1. **Given** a tracked opportunity, **When** the opportunity is opened, **Then** a unique dedicated agent email address (e.g., `rfp-austin-grid-44@govsniper.agentmail.com`) is assigned and visible for official correspondence.
2. **Given** an incoming email containing an official addendum or deadline revision, **When** the email is received, **Then** the system logs the message, highlights spec modifications/redlines, updates the opportunity deadline/status, and notifies the team.
3. **Given** an ambiguous clause in the compliance matrix, **When** the user requests a clarification letter, **Then** the system auto-drafts a formal Request for Information (RFI) email addressed to the procurement officer citing the exact clause.

---

### User Story 4 - Collaborative Bid Studio & Cited Proposal Drafting (Priority: P4)

As a proposal writer, I want to collaboratively draft and refine complete technical proposals with AI assistance that directly cites source requirements and company capabilities, so that our team can assemble compliant, winning bid packages in hours instead of weeks.

**Why this priority**: Proposal authoring requires synthesizing RFP requirements, past performance, and technical methodology into a unified, compliant document under strict time constraints.

**Independent Test**: The user can open the Bid Studio, generate complete proposal sections (Executive Summary, Technical Approach, Pricing Strategy, Team Qualifications) with verifiable source citations, edit content in real-time alongside team members, and export the bid package.

**Acceptance Scenarios**:
1. **Given** a verified opportunity and compliance matrix, **When** the user requests proposal generation, **Then** the system drafts complete narrative sections with inline citations to RFP requirements and vendor capabilities.
2. **Given** multiple team members viewing the same proposal, **When** one user edits or navigates, **Then** changes and active presence are updated seamlessly for all viewers in real time.
3. **Given** a finalized proposal draft, **When** the user triggers export, **Then** a clean, formatted bid package is produced ready for official submission.

---

### User Story 5 - Instant End-to-End Simulation & Audit Traceability (Priority: P5)

As an evaluator, judge, or administrator, I want a 1-click interactive simulation harness that executes the entire end-to-end procurement workflow in under 15 seconds, with a chronological audit log of all system decisions and agent interactions.

**Why this priority**: Hackathon judges and enterprise stakeholders need a rapid, deterministic way to verify every capability without waiting for external multi-hour crawl cycles.

**Independent Test**: Clicking the "Run Live Simulation" button triggers a sequential execution of discovery, compliance extraction, win scoring, proposal drafting, and simulated inbound addendum reception, showing live visual updates and audit trail entries in real-time.

**Acceptance Scenarios**:
1. **Given** the application in any state, **When** the user clicks "Run Live Simulation", **Then** the system initiates and steps through all 5 workflow stages within 15 seconds with visual progress indicators.
2. **Given** completed agent actions (crawl, compliance parse, scoring, proposal generation, email receipt), **When** inspecting the Audit Log, **Then** every event is recorded with timestamps, action types, and execution details.

---

### Edge Cases

- **Corrupted or Image-Only RFP PDFs**: If an opportunity document contains scanned images or unparseable tables, the system flags the document as `Analysis Warning` and prompts the user for manual upload or OCR review without crashing the radar feed.
- **Urgent Addendum Received During Final Drafting**: If an inbound addendum revises requirements or moves the deadline while a proposal is in active editing, the system displays a prominent banner, highlights affected sections, and prompts for re-evaluation.
- **Missing Vendor Capabilities for Hard Requirements**: When a hard disqualifier is detected (e.g., requirement for a $20M surety bond while profile maximum is $5M), the compliance check immediately sets status to `Disqualified` and win score to `0%` with clear diagnostic reasoning.
- **Simultaneous Collaborative Edits**: If multiple users edit the same proposal section concurrently, real-time synchronization preserves document consistency without overwriting conflicting blocks.
- **External Network Outage During Crawl / Mail Dispatch**: If external APIs fail or timeout, the action logs a retryable failure in `auditLogs` and displays an actionable retry button in the UI.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a real-time Radar Discovery feed that displays all discovered public and enterprise opportunities with filtering by category, estimated budget, status, and submission deadline.
- **FR-002**: System MUST standardize raw opportunity specifications into structured metadata including agency, title, category, budget range, deadline, and full spec content.
- **FR-003**: System MUST analyze RFP specifications against the active vendor profile to extract a categorized compliance matrix (Legal, Technical, Financial, Insurance).
- **FR-004**: System MUST assign each compliance item an explicit status (`Passed`, `Warning`, `Disqualified`) and link every requirement to its verbatim clause citation in the source document.
- **FR-005**: System MUST compute a dynamic Win Probability Score (0–100%) and risk tier (`Low`, `Medium`, `High`) based on semantic capability matching and past performance history.
- **FR-006**: System MUST provision a unique dedicated email address for every tracked opportunity to isolate procurement communications.
- **FR-007**: System MUST ingest incoming email messages sent to opportunity inboxes, detect addendums/amendments, and automatically flag redline changes to deadlines or specifications.
- **FR-008**: System MUST support 1-click drafting of formal clarification / Request for Information (RFI) emails addressed to contracting officers citing relevant requirement clauses.
- **FR-009**: System MUST provide a collaborative Bid Studio allowing real-time proposal authoring, multi-user presence indicators, and synchronized document state.
- **FR-010**: System MUST auto-draft structured technical proposals (Executive Summary, Technical Approach, Pricing Strategy, Past Performance) with verifiable citations back to the source RFP.
- **FR-011**: System MUST provide an export function to download completed proposal packages in clean formatted format.
- **FR-012**: System MUST maintain an immutable, chronological Audit Log recording all automated discoveries, compliance evaluations, score changes, email events, and user edits.
- **FR-013**: System MUST provide a 1-click Live Simulation Harness capable of executing the end-to-end procurement pipeline (discovery $\rightarrow$ analysis $\rightarrow$ scoring $\rightarrow$ drafting $\rightarrow$ addendum receipt) in under 15 seconds.
- **FR-014**: System MUST enforce dark-mode Mission Control visual standards (`#0a0d14` background, obsidian cards, electric cyan `#00f0ff` highlights, emerald `#10b981` badges, amber `#f59e0b` warnings) across all views.
- **FR-015**: System MUST deliver all state changes to the UI via real-time reactive subscriptions without manual page refreshes or polling.
- **FR-016**: System MUST manage vendor capability profiles including certifications, bonding limits, domain capabilities, and past project case studies.

### Key Entities

- **Vendor Profile**: Represents the bidding company; includes company name, industry domains, certifications (ISO, SOC2, security clearances), financial bonding limits, and past performance case studies.
- **Tender (Opportunity)**: Represents a single procurement RFP/bid; includes title, issuing agency, category, budget, status (`Discovered`, `Analyzing`, `Bidding`, `Submitted`, `Won`, `Lost`), source URL, deadline, full specification text, Win Probability Score, risk level, and assigned agent email.
- **Compliance Check**: Represents an extracted atomic requirement; belongs to a Tender; includes category (Legal, Technical, Financial, Insurance), requirement text, status (`Passed`, `Warning`, `Disqualified`), source clause citation, and evaluation notes.
- **Proposal**: Represents the bid document for a Tender; includes version, section breakdown (Executive Summary, Technical Approach, Pricing, Team Qualifications), live markdown content, last editor, and compilation status.
- **Email Thread & Message**: Represents communication with contracting officers; belongs to a Tender; includes dedicated agent inbox, officer contact info, subject, direction (`Inbound` / `Outbound`), body content, addendum indicators, and timestamps.
- **Audit Log Event**: Represents a traceable event; includes tender association, action type, timestamp, triggered actor (system, agent, user), and event payload summary.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can evaluate a 100+ page RFP specification and review an extracted 10+ point compliance matrix in under 5 seconds from ingestion.
- **SC-002**: The 1-click End-to-End Simulation Mode completes the full 5-stage procurement cycle within 15 seconds from trigger to completion.
- **SC-003**: 100% of extracted compliance items and generated proposal sections include direct verifiable citations linking to original specification clauses.
- **SC-004**: Real-time multi-user edits and incoming email notifications reflect on connected client screens within 100ms without manual page refresh.
- **SC-005**: Critical disqualifiers (e.g. insufficient bonding or missing mandatory certification) are flagged with 100% accuracy during compliance evaluation.
- **SC-006**: Proposal writers can generate an initial complete, structured first-draft bid proposal package in under 30 seconds.

---

## Assumptions

- **Vendor Profile Availability**: A production vendor profile with enterprise IT / infrastructure credentials and vector capability embeddings is configured in the database to enable instant matching and win probability calculations.
- **Production RFP Dataset Ingestion**: Real municipal and enterprise RFP specifications (e.g., Smart Grid Modernization, Municipal Cloud Migration, Wastewater SCADA System) are ingested and indexed in Convex with full semantic vector embeddings.
- **AgentMail Autonomous Communications**: Dedicated inboxes are provisioned dynamically via AgentMail with real webhook event handlers in `convex/http.ts`.
- **Single Currency & Language Standard**: Monetary amounts are standardized in USD ($) and specifications are processed in English for international hackathon presentation.
