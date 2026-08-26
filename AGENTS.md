<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:
specs/001-procurement-command-center/plan.md
<!-- SPECKIT END -->

# Agent Behavior & Project Guidelines

## 1. Language Policy (Quy Định Ngôn Ngữ)
- **Communication (Giao tiếp)**: Luôn trao đổi, giải thích, báo cáo và trả lời người dùng bằng **Tiếng Việt**.
- **Code & Technical Assets**: Write all source code, identifiers, types, schemas, comments, commit messages, PR descriptions, test cases, and technical specifications exclusively in **English**.
- **UI Content**: Default application UI copy, labels, and mock data must be in **English** (tailored for the international hackathon judges).

## 2. Project Architecture & Standards
- **Project**: GovSniper (Autonomous Procurement Command Center)
- **Core Stack**:
  - Backend: Convex (Real-time DB, Queries, Mutations, Crons, Vector Search)
  - Data Ingestion: Firecrawl (Crawling & Spec Extraction)
  - Communications: AgentMail (Autonomous Inbound/Outbound Inboxes)
  - Intelligence: OpenAI (Compliance Extraction & Bid Proposal Generation)
  - Frontend: React / TypeScript / Vite / TailwindCSS with High-Tech Dark-Mode Theme
- **Build Log**: Keep `hackathon.md` updated after meaningful build sessions using the `/hackathon` skill.
- **Frontend Host**: Convex static hosting (`convex.site`).

