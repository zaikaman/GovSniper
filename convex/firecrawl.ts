import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { api } from "./_generated/api";

/**
 * Action to scrape an RFP portal URL via Firecrawl and ingest into Convex
 */
export const scrapeAndIngestPortal = action({
  args: {
    url: v.string(),
    categoryOverride: v.optional(v.string()),
    budgetOverride: v.optional(v.number()),
  },
  handler: async (ctx: any, args: any) => {
    const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const openaiBaseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

    let markdownContent = "";
    let pageTitle = "";

    // 1. Scrape URL via Firecrawl API or direct fetch
    if (firecrawlApiKey) {
      try {
        const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firecrawlApiKey}`,
          },
          body: JSON.stringify({
            url: args.url,
            formats: ["markdown"],
            onlyMainContent: true,
          }),
        });

        if (response.ok) {
          const result: any = await response.json();
          markdownContent = result.data?.markdown || "";
          pageTitle = result.data?.metadata?.title || "";
        } else {
          console.warn(`Firecrawl API returned ${response.status}, falling back to direct fetch.`);
        }
      } catch (err) {
        console.warn("Firecrawl scrape request failed, falling back to direct fetch:", err);
      }
    }

    // Fallback direct fetch if Firecrawl didn't return markdown
    if (!markdownContent) {
      try {
        const directRes = await fetch(args.url, {
          headers: {
            "User-Agent": "GovSniper-Procurement-Agent/1.0",
          },
        });
        const rawText = await directRes.text();
        // Basic HTML cleanup to text
        markdownContent = rawText
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        pageTitle = args.url.split("/").filter(Boolean).pop() || "Procurement Opportunity";
      } catch (directErr) {
        throw new Error(`Failed to fetch content from URL: ${args.url}. Error: ${directErr}`);
      }
    }

    // 2. Extract structured metadata using OpenAI Structured Outputs
    let tenderData = {
      tenderNumber: `RFP-${Date.now().toString().slice(-6)}`,
      title: pageTitle || "Procurement Opportunity",
      agency: "Public Contracting Agency",
      category: args.categoryOverride || "IT & Cloud",
      estimatedBudgetUsd: args.budgetOverride || 5000000,
      submissionDeadline: Date.now() + 30 * 24 * 60 * 60 * 1000, // +30 days default
      summary: markdownContent.slice(0, 300) + "...",
      riskLevel: "medium" as const,
      officerName: "Contracting Officer",
      officerEmail: "procurement@agency.gov",
    };

    if (openaiApiKey) {
      try {
        const openai = new OpenAI({
          apiKey: openaiApiKey,
          baseURL: openaiBaseUrl,
        });

        const prompt = `Analyze this procurement/RFP document and extract structured metadata:
Document Content (first 10,000 characters):
${markdownContent.slice(0, 10000)}

Source URL: ${args.url}`;

        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "You are an expert government procurement analyst. Extract metadata strictly adhering to the JSON schema.",
            },
            { role: "user", content: prompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "tender_metadata",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  tenderNumber: { type: "string", description: "Official solicitation/RFP number" },
                  title: { type: "string", description: "Clear descriptive opportunity title" },
                  agency: { type: "string", description: "Issuing government agency or enterprise" },
                  category: {
                    type: "string",
                    enum: ["Energy", "IT & Cloud", "Infrastructure", "Defense", "Public Safety"],
                  },
                  estimatedBudgetUsd: { type: "number", description: "Estimated ceiling budget in USD" },
                  submissionDeadlineDays: {
                    type: "number",
                    description: "Estimated days until submission deadline from today",
                  },
                  summary: { type: "string", description: "2-3 sentence executive synopsis of requirements" },
                  riskLevel: { type: "string", enum: ["low", "medium", "high"] },
                  officerName: { type: "string" },
                  officerEmail: { type: "string" },
                },
                required: [
                  "tenderNumber",
                  "title",
                  "agency",
                  "category",
                  "estimatedBudgetUsd",
                  "submissionDeadlineDays",
                  "summary",
                  "riskLevel",
                  "officerName",
                  "officerEmail",
                ],
                additionalProperties: false,
              },
            },
          },
        });

        const rawJson = completion.choices[0].message.content;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          tenderData = {
            tenderNumber: parsed.tenderNumber || tenderData.tenderNumber,
            title: parsed.title || tenderData.title,
            agency: parsed.agency || tenderData.agency,
            category: args.categoryOverride || parsed.category || tenderData.category,
            estimatedBudgetUsd: args.budgetOverride || parsed.estimatedBudgetUsd || tenderData.estimatedBudgetUsd,
            submissionDeadline:
              Date.now() + (parsed.submissionDeadlineDays || 30) * 24 * 60 * 60 * 1000,
            summary: parsed.summary || tenderData.summary,
            riskLevel: parsed.riskLevel || "medium",
            officerName: parsed.officerName || tenderData.officerName,
            officerEmail: parsed.officerEmail || tenderData.officerEmail,
          };
        }
      } catch (aiErr) {
        console.warn("OpenAI metadata extraction encountered an issue, using heuristic defaults:", aiErr);
      }
    }

    // 3. Generate unique dedicated AgentMail inbox address
    const cleanSlug = tenderData.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 20);
    const assignedAgentEmail = `rfp-${cleanSlug}-${Math.floor(Math.random() * 900 + 100)}@govsniper.agentmail.com`;

    // 4. Save into Convex database via mutation
    const tenderId = await ctx.runMutation(api.tenders.create, {
      tenderNumber: tenderData.tenderNumber,
      title: tenderData.title,
      agency: tenderData.agency,
      category: tenderData.category,
      estimatedBudgetUsd: tenderData.estimatedBudgetUsd,
      status: "discovered",
      sourceUrl: args.url,
      submissionDeadline: tenderData.submissionDeadline,
      specsMarkdown: markdownContent,
      summary: tenderData.summary,
      winScore: 50, // Initial default score before compliance analysis
      riskLevel: tenderData.riskLevel,
      assignedAgentEmail,
      officerName: tenderData.officerName,
      officerEmail: tenderData.officerEmail,
    });

    return {
      tenderId,
      tenderNumber: tenderData.tenderNumber,
      title: tenderData.title,
      agency: tenderData.agency,
      assignedAgentEmail,
    };
  },
});
