<!--
Sync Impact Report
==================
Version Change: None -> 1.0.0
Ratified Date: 2026-08-26
Last Amended Date: 2026-08-26

Added Principles:
- I. Code Quality & Strict Type Safety
- II. Testing Standards & Simulation Verification Harness
- III. User Experience Consistency & Mission Control Aesthetic
- IV. Performance, Latency & Real-Time Reactivity
- V. Autonomous Agent Reliability & Integration Boundaries

Added Sections:
- Architecture & Technical Constraints
- Development Workflow & Quality Gates
- Governance

Templates Requiring Updates:
- ✅ .specify/templates/plan-template.md (Constitution gates aligned)
- ✅ .specify/templates/spec-template.md (Requirements & acceptance criteria aligned)
- ✅ .specify/templates/tasks-template.md (Quality & testing phases aligned)

Follow-up TODOs: None
-->

# GovSniper Project Constitution

## Core Principles

### I. Code Quality & Strict Type Safety
- **Strict TypeScript Enforcement**: Every frontend and Convex backend file MUST be written in strict TypeScript. The use of `any`, `unknown` without type narrowing, or `@ts-ignore` / `@eslint-disable` is strictly prohibited unless formally justified.
- **Convex Schema Discipline**: All database models, indexes, vector configurations, and query/mutation validators MUST be explicitly declared in `convex/schema.ts` using Convex validators (`v.string()`, `v.id()`, `v.object()`, etc.).
- **Modular Component Isolation**: Separate concerns cleanly between presentation components, stateful controllers, and Convex backend functions (`queries`, `mutations`, `actions`, `crons`, `httpAction`).

### II. Testing Standards & Simulation Verification Harness
- **End-to-End Simulation Mode**: A deterministic, standalone Judge & Developer Simulation Harness MUST be maintained. It allows running an end-to-end workflow (crawling mock RFP -> extracting compliance matrix -> computing win score -> generating cited proposal -> receiving AgentMail addendum) within 15 seconds.
- **Contract & Mutation Testing**: All critical Convex mutations, background actions, and LLM output parsing pipelines must be covered by verifiable automated test cases and reproducible schema validations.
- **Verification Gates**: No feature branch or task increment is marked complete without passing TypeScript compilation, linting, and manual/automated verification.

### III. User Experience Consistency & Mission Control Aesthetic
- **High-Tech Dark-Mode Design System**: All UI surfaces MUST adhere to the Mission Control theme: deep obsidian background (`#0a0d14`), elevated card surfaces (`#111726`), electric cyan accents (`#00f0ff`), cyber amber warnings (`#f59e0b`), and emerald win badges (`#10b981`).
- **Zero Generic AI Aesthetics**: Use distinctive, high-legibility typography (such as clean geometric sans paired with monospaced figures/timestamps), custom visual gauges (e.g., radial Win Probability meter), and crisp contrast. Avoid overused generic templates or plain unstyled containers.
- **Immediate Reactive Feedback**: The UI MUST leverage Convex real-time reactive subscriptions (`useQuery`) with zero client-side polling. All mutations MUST provide instant feedback (loading states, optimistic updates, or non-blocking notifications).

### IV. Performance, Latency & Real-Time Reactivity
- **Non-Blocking Background Orchestration**: Heavy compute tasks (Firecrawl web scraping, OpenAI reasoning and compliance matrix extraction, document embeddings generation, PDF parsing) MUST run inside Convex scheduled actions or crons, never blocking interactive client requests.
- **Sub-100ms UI Reactivity**: Real-time queries and client interactions must render and update within 100ms. Large lists (e.g., radar tender feeds) must use pagination or virtualized rendering.
- **Vector Search Optimization**: Vector index queries for win probability calculation must be scoped efficiently and cached where appropriate to prevent redundant LLM embedding calls.

### V. Autonomous Agent Reliability & Integration Boundaries
- **Idempotent Ingestion & Webhooks**: Inbound emails from AgentMail and scraped payloads from Firecrawl MUST be processed idempotently using unique message IDs and SHA hashes to prevent duplicate addendums or tender records.
- **Structured LLM Outputs & Citation Grounding**: All OpenAI extraction and bid proposal generation calls MUST enforce structured JSON schema validation. Every compliance requirement and drafted proposal section MUST retain direct citation links back to the source RFP document.
- **Graceful Error Handling & Circuit Breaking**: External API failures (Firecrawl down, LLM rate limits, AgentMail dispatch errors) must be trapped, logged to `auditLogs`, and surfaced gracefully to the user with actionable retry mechanisms.

---

## Architecture & Technical Constraints

### 1. Technology Stack
- **Backend & Database**: Convex (Real-time Database, Queries, Mutations, Actions, Crons, Vector Search, HTTP Actions).
- **Ingestion & Senses**: Firecrawl API (Portal web crawling, RFP table/PDF scraping to clean Markdown).
- **Communication Voice**: AgentMail API (Autonomous dedicated inboxes per opportunity, inbound webhook ingestion, outbound clarification letters).
- **Intelligence**: OpenAI API (Compliance matrix extraction, win scoring, cited proposal drafting).
- **Frontend**: Vite + React + TypeScript + TailwindCSS.
- **Hosting**: Convex Static Hosting (`convex.site`).

### 2. Security & Data Integrity
- No secrets, API keys, or private tokens may be committed or stored in client-exposed files. All sensitive integration keys reside in Convex Environment Variables (`.env.local` / Convex dashboard).
- User and opportunity data must maintain strict relational integrity across tables (`tenders`, `complianceChecks`, `proposals`, `emailThreads`, `auditLogs`).

---

## Development Workflow & Quality Gates

1. **Specification First**: Features begin with clear problem statements, prioritized user stories (P1/P2/P3), and concrete acceptance criteria in `spec.md`.
2. **Architecture & Plan**: Implementation details, database schemas, and integration contracts are documented in `plan.md` before coding.
3. **Task Breakdown**: Work is decomposed into dependency-ordered, testable tasks in `tasks.md`.
4. **Iterative Build & Verification**: Tasks are implemented sequentially; each increment is verified against this Constitution before merging.
5. **Build Log Updates**: Keep `hackathon.md` continuously refreshed with evidence-backed progress using the `convex-hackathon-skill`.

---

## Governance

- **Supremacy**: This Constitution represents the highest-priority architectural and quality contract for the GovSniper project. All code, PRs, and agent workflows must strictly conform to these rules.
- **Amendment Policy**: Amending this Constitution requires a formal review, semantic version increment, and updates to all downstream templates and documentation.
  - **MAJOR**: Removal or incompatible redefinition of core principles or architecture constraints.
  - **MINOR**: Addition of new principles, architectural standards, or expanded quality gates.
  - **PATCH**: Non-semantic clarifications, wording improvements, and typo corrections.

---

**Version**: 1.0.0 | **Ratified**: 2026-08-26 | **Last Amended**: 2026-08-26
