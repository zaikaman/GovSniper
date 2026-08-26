# Implementation Plan: Autonomous Public & Enterprise Procurement Command Center

**Branch**: `main` | **Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/001-procurement-command-center/spec.md`

---

## Summary

GovSniper is an autonomous procurement command center built for the Convex "All Gas" Hackathon. It enables businesses to discover government and enterprise RFPs via Firecrawl ingestion, automatically extracts multi-category compliance matrices and computes win probabilities with OpenAI, manages dedicated email inboxes and inbound addendums via AgentMail, provides a collaborative real-time Bid Studio for citation-backed proposal authoring, and features a 1-click deterministic 15-second Judge Simulation Mode.

---

## Technical Context

**Language/Version**: TypeScript 5.5+ / Node.js 20+  
**Primary Dependencies**: 
- Frontend: React 19, Vite, TailwindCSS, Lucide React, Canvas Confetti
- Backend: Convex (`convex/react`, `convex/server`, `convex/values`)
- External Integrations: `openai`, `@mendable/firecrawl-js`, `agentmail`
**Storage**: Convex Real-time Document Database + Native Vector Search Indices  
**Testing**: Vitest for unit/contract tests + Deterministic 15-Second End-to-End Simulation Harness (`convex/simulation.ts`)  
**Target Platform**: Modern Web Browsers (Chrome, Safari, Firefox, Edge) deployed on Convex Static Hosting (`convex.site`)  
**Project Type**: Reactive Full-Stack Web Application (Convex Backend + Vite/React Frontend)  
**Performance Goals**: Sub-100ms UI reactive query synchronization; <15s full 5-stage simulation pipeline; sub-5s compliance extraction  
**Constraints**: Zero client-side polling; non-blocking background orchestration via Convex scheduler/actions; Mission Control dark-mode palette (`#0a0d14`, obsidian cards, `#00f0ff` cyan, `#10b981` emerald, `#f59e0b` amber)  
**Scale/Scope**: Multi-tender radar feeds, 100+ page RFP document parsing, collaborative live bidding studio, full audit trail  

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Gate | Status | Verification Detail |
| :--- | :---: | :--- |
| **I. Code Quality & Strict Type Safety** | ✅ PASS | Strict TypeScript across frontend and backend; all models and validators strictly declared in `convex/schema.ts`. |
| **II. Testing Standards & Simulation Harness** | ✅ PASS | Deterministic 15s Simulation Harness (`convex/simulation.ts`) provides instantaneous validation for judges and devs. |
| **III. Mission Control UX Consistency** | ✅ PASS | Dark-mode design system (`#0a0d14` background, obsidian cards, cyan `#00f0ff`, emerald `#10b981`, amber `#f59e0b`) + real-time `useQuery`. |
| **IV. Performance & Real-Time Reactivity** | ✅ PASS | Heavy scraping, LLM analysis, and embedding generation delegated to Convex actions/scheduler; zero client polling. |
| **V. Autonomous Agent Reliability & Boundaries** | ✅ PASS | Idempotent email processing via unique message IDs; structured JSON outputs with citation verification for OpenAI. |

---

## Project Structure

### Documentation (this feature)

```text
specs/001-procurement-command-center/
├── spec.md              # Feature specification
├── plan.md              # This file (Implementation Plan)
├── research.md          # Phase 0 output (Technical research & decisions)
├── data-model.md        # Phase 1 output (Schema and state transitions)
├── contracts/           # Phase 1 output (Convex API contracts)
│   └── convex-api.md
├── quickstart.md        # Phase 1 output (Setup & developer guide)
├── checklists/          # Quality checklists
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
convex/
├── schema.ts            # Convex database schema, indexes & vector indexes
├── tenders.ts           # Tender discovery queries, mutations & filtering
├── compliance.ts        # Compliance matrix extraction & checklist queries
├── proposals.ts         # Collaborative bid studio mutations & proposal queries
├── emails.ts            # Dedicated opportunity inboxes & message queries
├── vendors.ts           # Vendor profile & live capability embedding management
├── audit.ts             # Chronological audit log queries & mutations
├── pipeline.ts          # 1-click live autonomous pipeline orchestrator
├── ai.ts                # OpenAI actions (compliance extraction, win scoring, proposal drafting)
├── firecrawl.ts         # Firecrawl portal crawling & spec ingestion actions
├── agentmail.ts         # AgentMail inbox provisioning & outbound RFI dispatch actions
├── http.ts              # HTTP router for AgentMail inbound email webhooks
└── _generated/          # Auto-generated Convex types

src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Mission Control navigation, live trigger & status
│   │   └── Sidebar.tsx          # Navigation between Radar, War Room, Bid Studio, Inboxes, Audit Log
│   ├── vendor/
│   │   └── VendorProfileModal.tsx # Live vendor credentials & capability embedding manager
│   ├── radar/
│   │   ├── RadarFeed.tsx        # Live streaming opportunity cards with real-time pulse
│   │   ├── IngestTenderModal.tsx # User URL / document portal live ingestion modal
│   │   ├── TenderFilterBar.tsx  # Multi-dimensional filter (budget, sector, status)
│   │   └── TenderCard.tsx       # Individual opportunity card with win score gauge preview
│   ├── warroom/
│   │   ├── TenderWarRoom.tsx    # Detailed opportunity inspection center
│   │   ├── WinScoreGauge.tsx    # Radial visualizer for win probability (0-100%)
│   │   ├── ComplianceGrid.tsx   # Categorized interactive compliance checklist with citations
│   │   └── SpecViewer.tsx       # Source document viewer with citation highlighting
│   ├── inboxes/
│   │   ├── AgentMailHub.tsx     # Dedicated opportunity email conversation pane
│   │   ├── AddendumBanner.tsx   # Redline diff alert banner for new amendments
│   │   └── RfiDraftModal.tsx    # 1-click AI clarification inquiry composer
│   ├── studio/
│   │   ├── BidStudio.tsx        # Collaborative rich-text / markdown proposal editor
│   │   ├── PresenceBar.tsx      # Real-time multi-user cursor presence indicators
│   │   ├── AiProposalHelper.tsx # AI sidebar for section generation & citation injection
│   │   └── ExportModal.tsx      # Export to formatted bid package (PDF / Markdown)
│   ├── pipeline/
│   │   └── PipelineModal.tsx    # Live progress visualizer for the autonomous execution pipeline
│   ├── audit/
│   │   └── AuditTimeline.tsx    # Chronological immutable event stream
│   └── ui/                      # Glassmorphic dark-theme buttons, badges, modals, inputs
├── hooks/                       # Custom hooks for presence, pipeline timer, and filters
├── lib/
│   └── utils.ts                 # Formatting helpers for currency, dates, citations
├── App.tsx                      # Root component with view routing
├── main.tsx                     # React entry point with ConvexProvider
└── index.css                    # Tailwind design system tokens & Mission Control dark theme

public/                          # Static assets and icons
package.json                     # NPM dependencies & scripts
vite.config.ts                   # Vite configuration
tailwind.config.js               # Mission Control color palette & theme extensions
tsconfig.json                   # Strict TypeScript compiler options
```

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| :--- | :--- | :--- |
| *None* | All architecture adheres directly to the 5 core principles of the Project Constitution. | N/A |
