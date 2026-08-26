# Quickstart Guide: GovSniper

**Feature**: Autonomous Public & Enterprise Procurement Command Center  
**Branch**: `001-procurement-command-center`  

---

## 1. Prerequisites

- **Node.js**: `v18.x` or `v20.x+`
- **npm** or **pnpm**
- **Convex Account**: [convex.dev](https://convex.dev)
- **API Keys (Optional / Fallback provided in Simulation Mode)**:
  - `OPENAI_API_KEY`, `OPENAI_BASE_URL` (optional), `OPENAI_MODEL`
  - `FIRECRAWL_API_KEY` (optional for live crawl)
  - `AGENTMAIL_API_KEY` (optional for live inboxes)

---

## 2. Environment Configuration

Create or update `.env.local` in the project root:

```bash
# Convex Deployment (configured automatically via npx convex dev)
CONVEX_DEPLOYMENT=dev:govsniper-dev-xxxx
VITE_CONVEX_URL=https://govsniper-dev-xxxx.convex.cloud

# OpenAI / Custom Gateway (Optional, built-in realistic simulation fallbacks available)
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o

# Firecrawl API (Optional for live scraping)
FIRECRAWL_API_KEY=fc-...

# AgentMail API (Optional for live email inboxes)
AGENTMAIL_API_KEY=am-...
```

---

## 3. Installation & Local Development

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Convex Backend
In terminal 1:
```bash
npx convex dev
```

### Step 3: Start Vite Frontend
In terminal 2:
```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 4. Verifying the 15-Second Judge Simulation Mode

1. Open `http://localhost:5173` in your browser.
2. Click the glowing cyan **"Run Live Simulation"** button in the top navigation bar.
3. Observe the full 5-stage procurement pipeline execute deterministically:
   - **Stage 1 (0–3s)**: Radar discovers and ingests the "Smart City Grid Modernization" RFP.
   - **Stage 2 (3–6s)**: Evaluates compliance matrix and computes 92% Win Probability.
   - **Stage 3 (6–9s)**: Auto-drafts cited technical proposal in the Bid Studio.
   - **Stage 4 (9–12s)**: Ingests simulated AgentMail addendum email, highlighting redline diffs.
   - **Stage 5 (12–15s)**: Chronological Audit Trail records every step.
