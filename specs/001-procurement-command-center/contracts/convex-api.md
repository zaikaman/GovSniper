# Convex API Contract: GovSniper Backend

**Feature**: Autonomous Public & Enterprise Procurement Command Center  
**Branch**: `001-procurement-command-center`  
**Location**: `convex/`

---

## 1. Opportunities & Radar (`convex/tenders.ts`)

### `queries.listTenders`
Returns real-time list of all tenders with optional filtering.
- **Args**:
  - `status?: string` (`"discovered" | "analyzing" | "bidding" | "submitted" | "won" | "lost"`)
  - `category?: string`
  - `minBudget?: number`
  - `maxBudget?: number`
  - `search?: string`
- **Returns**: `Array<Doc<"tenders">>`

### `queries.getTenderById`
Fetches a single tender with all associated compliance matrix checks, active proposal, and email threads.
- **Args**: `id: v.id("tenders")`
- **Returns**: `Doc<"tenders"> | null`

### `mutations.createTender`
Creates a newly discovered tender.
- **Args**:
  - `tenderNumber: v.string()`
  - `title: v.string()`
  - `agency: v.string()`
  - `category: v.string()`
  - `estimatedBudgetUsd: v.number()`
  - `submissionDeadline: v.number()`
  - `sourceUrl: v.string()`
  - `specsMarkdown: v.string()`
  - `summary: v.string()`
  - `assignedAgentEmail: v.string()`
  - `officerName?: v.string()`
  - `officerEmail?: v.string()`
- **Returns**: `Id<"tenders">`

### `mutations.updateTenderStatus`
Updates the lifecycle stage of a tender.
- **Args**:
  - `id: v.id("tenders")`
  - `status: v.union(v.literal("discovered"), v.literal("analyzing"), v.literal("bidding"), v.literal("submitted"), v.literal("won"), v.literal("lost"))`
- **Returns**: `null`

---

## 2. Compliance Matrix & AI Intelligence (`convex/compliance.ts`, `convex/ai.ts`)

### `queries.getComplianceChecks`
Returns all extracted compliance items for a specific tender.
- **Args**: `tenderId: v.id("tenders")`
- **Returns**: `Array<Doc<"complianceChecks">>`

### `actions.analyzeTenderCompliance`
Executes OpenAI analysis over the RFP specifications and compares against the active vendor profile.
- **Args**: `tenderId: v.id("tenders")`
- **Returns**:
  ```ts
  {
    winScore: number;
    riskLevel: "low" | "medium" | "high";
    checksCount: number;
    disqualifiedCount: number;
  }
  ```

---

## 3. Collaborative Bid Studio & Proposals (`convex/proposals.ts`)

### `queries.getProposalByTender`
Returns the active proposal for a tender.
- **Args**: `tenderId: v.id("tenders")`
- **Returns**: `Doc<"proposals"> | null`

### `mutations.updateProposalContent`
Real-time mutation to update live markdown proposal text and record editor presence.
- **Args**:
  - `proposalId: v.id("proposals")`
  - `liveContent: v.string()`
  - `editedBy: v.string()`
- **Returns**: `null`

### `actions.generateProposalDraft`
Executes OpenAI prompt to auto-draft structured technical proposals with citations.
- **Args**:
  - `tenderId: v.id("tenders")`
  - `sectionKey?: "all" | "executiveSummary" | "technicalApproach" | "pricingStrategy" | "teamQualifications"`
- **Returns**: `Id<"proposals">`

---

## 4. Autonomous Inboxes & Email (`convex/emails.ts`, `convex/agentmail.ts`)

### `queries.getThreadsByTender`
Returns all email threads and messages for a tender.
- **Args**: `tenderId: v.id("tenders")`
- **Returns**: `Array<{ thread: Doc<"emailThreads">; messages: Array<Doc<"emailMessages">> }>`

### `actions.sendClarificationRfi`
Drafts and dispatches an official Request for Information inquiry to the contracting officer via AgentMail.
- **Args**:
  - `tenderId: v.id("tenders")`
  - `officerEmail: v.string()`
  - `subject: v.string()`
  - `bodyText: v.string()`
  - `citedClause?: v.string()`
- **Returns**: `{ success: boolean; messageId: string }`

### `httpAction` (`convex/http.ts`)
Webhook receiver for inbound emails from AgentMail.
- **Endpoint**: `POST /api/agentmail-webhook`
- **Payload**: JSON payload with `messageId`, `sender`, `recipient`, `subject`, `text`, `html`
- **Behavior**: Idempotent insertion into `emailMessages`, detects addendums, triggers spec diff analysis.

---

## 5. Live Judge Simulation Harness (`convex/simulation.ts`)

### `actions.runFullJudgeSimulation`
Executes end-to-end multi-step workflow in $\le 15$ seconds:
1. Seeds/crawls a realistic RFP (e.g. Smart City Grid Modernization).
2. Performs compliance extraction and win probability scoring.
3. Auto-drafts proposal in the Bid Studio.
4. Triggers simulated inbound AgentMail addendum with redline diff.
5. Updates audit logs sequentially.
- **Args**: `{ scenarioKey?: "smart_grid" | "scada_water" | "cloud_migration" }`
- **Returns**: `{ success: boolean; tenderId: Id<"tenders">; stepsCompleted: number }`

---

## 6. Audit Trail (`convex/audit.ts`)

### `queries.listAuditLogs`
Returns chronological stream of audit log entries.
- **Args**:
  - `tenderId?: v.id("tenders")`
  - `limit?: number`
- **Returns**: `Array<Doc<"auditLogs">>`
