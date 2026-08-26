# Technical Research: GovSniper Procurement Command Center

**Feature**: Autonomous Public & Enterprise Procurement Command Center  
**Branch**: `001-procurement-command-center`  
**Date**: 2026-08-26  

## 1. Backend Architecture: Convex as Unified Reactive Backend vs Express.js

### Decision
Use **Convex** as the single, complete, unified backend layer (Database, Queries, Mutations, Actions, Vector Search, Crons, HTTP Webhooks) without an Express.js middle-tier.

### Rationale
- **Zero-Latency Reactivity**: Convex provides native WebSocket-based live subscriptions (`useQuery`). Introducing an Express.js intermediary would turn real-time updates into traditional polling or require custom socket bridges, defeating the core advantage of Convex.
- **Unified TypeScript Fullstack**: Convex functions run TypeScript natively with auto-generated end-to-end type safety (`api.tenders.list`, `api.compliance.analyze`).
- **Built-in Node.js Actions**: External third-party API calls (Firecrawl, AgentMail, OpenAI) run in Convex `action` and `internalAction` environments with full access to `fetch` and npm modules.
- **HTTP Routing for Webhooks**: `convex/http.ts` exposes native HTTP endpoints for incoming AgentMail webhooks and Firecrawl crawl completion callbacks without requiring Express.
- **Vector Database**: Convex has native vector search indices (`.vectorIndex`), eliminating the need for Pinecone/Milvus/Qdrant.

### Alternatives Considered
- *Node.js / Express.js REST API*: Evaluated. Rejected because it adds redundant server maintenance, breaks end-to-end typed queries, and creates an extra hop between the client and Convex database.
- *Next.js API Routes*: Evaluated. Unnecessary since Vite + React + Convex static hosting provides faster HMR, smaller bundle size, and simpler deployment on `convex.site`.

---

## 2. LLM Orchestration & OpenAI Configuration

### Decision
Use the official `openai` SDK inside Convex Actions with support for custom endpoints via `OPENAI_BASE_URL`, `OPENAI_MODEL`, and `OPENAI_API_KEY`. Enforce Structured Outputs (`response_format: { type: "json_schema" }`) and generate semantic embeddings using `text-embedding-3-small`.

### Rationale
- **Configurability**: Exposing `OPENAI_BASE_URL` allows seamless switching between OpenAI direct, Azure OpenAI, OpenRouter, or local proxies/Ollama if needed.
- **Deterministic Extraction**: Using Structured Outputs guarantees that extracted compliance checklists, win probability breakdowns, and cited proposal blocks adhere strictly to TypeScript interfaces without runtime parsing errors.
- **Vector Search for Win Probability**: `text-embedding-3-small` creates 1536-dimensional vectors for vendor capabilities and RFP specs. Convex vector search calculates cosine similarity instantly.

### Alternatives Considered
- *LangChain / LlamaIndex*: Evaluated. Rejected due to heavy dependency footprints and abstraction overhead. Direct OpenAI structured calls inside Convex actions provide faster execution and simpler debugging.

---

## 3. Web Ingestion & Senses (Firecrawl Integration)

### Decision
Integrate Firecrawl via Convex actions (`convex/firecrawl.ts`) to crawl procurement portals, convert multi-page PDF/HTML specifications into clean Markdown, and extract tabular pricing/submission data.

### Rationale
- Firecrawl bypasses complex JS-rendered government portals, cleans HTML noise, and outputs structured Markdown ready for chunking and LLM analysis.
- Convex scheduled actions (`ctx.scheduler.runAfter`) handle multi-step scraping asynchronously without blocking user requests.

---

## 4. Autonomous Communications Hub (AgentMail Integration)

### Decision
Integrate AgentMail via Convex actions (`convex/agentmail.ts`) for dedicated inbox provisioning (`rfp-<id>@govsniper.agentmail.com`) and handle incoming email webhooks via `convex/http.ts`.

### Rationale
- **Opportunity Isolation**: Every tender receives a distinct email address, ensuring zero confusion between different contracting officers.
- **Idempotent Webhook Processing**: Convex HTTP actions verify webhook signatures and use email message IDs as idempotency keys to prevent duplicate addendum processing.
- **Automated Diffing**: When an inbound addendum is received, an internal action diffs the new text against existing specifications and logs redline changes.

---

## 5. High-Impact Mission Control UI / UX

### Decision
Build with **React 19 + Vite + TypeScript + TailwindCSS** utilizing a High-Tech Dark Mode palette (`#0a0d14` background, `#111726` obsidian cards, `#00f0ff` electric cyan accents, `#10b981` emerald indicators, `#f59e0b` cyber amber warnings).

### Rationale
- Fast Vite bundling with instant HMR.
- Rich interactive components (Radar streaming feed, radial Win Probability Gauge, interactive Compliance Matrix, split-pane Bid Studio).
- Adheres directly to the Project Constitution Principle III (Mission Control Aesthetic).

---

## 6. 15-Second End-to-End Simulation Harness

### Decision
Implement `convex/simulation.ts` with seeded realistic RFP datasets (e.g. Smart City Grid Modernization, SCADA Water Treatment, Enterprise Cloud Migration) that can run in full interactive simulation mode in <15 seconds.

### Rationale
- Guarantees hackathon judges can experience the live pipeline instantly without waiting for external web crawlers or real email round-trips.
