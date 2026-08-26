import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List all opportunities with reactive sorting and filtering
 */
export const list = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    let tenders = await ctx.db.query("tenders").order("desc").collect();

    if (args.status && args.status !== "all") {
      tenders = tenders.filter((t: any) => t.status === args.status);
    }

    if (args.category && args.category !== "all") {
      tenders = tenders.filter((t: any) => t.category.toLowerCase() === args.category?.toLowerCase());
    }

    return tenders;
  },
});

/**
 * Get opportunity details by ID
 */
export const getById = query({
  args: {
    id: v.id("tenders"),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * Create a new opportunity ingested via Firecrawl or direct input
 */
export const create = mutation({
  args: {
    tenderNumber: v.string(),
    title: v.string(),
    agency: v.string(),
    category: v.string(),
    estimatedBudgetUsd: v.number(),
    status: v.union(
      v.literal("discovered"),
      v.literal("analyzing"),
      v.literal("bidding"),
      v.literal("submitted"),
      v.literal("won"),
      v.literal("lost")
    ),
    sourceUrl: v.string(),
    submissionDeadline: v.number(),
    specsMarkdown: v.string(),
    summary: v.string(),
    winScore: v.number(),
    riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    assignedAgentEmail: v.string(),
    officerName: v.optional(v.string()),
    officerEmail: v.optional(v.string()),
    specEmbedding: v.optional(v.array(v.float64())),
  },
  handler: async (ctx: any, args: any) => {
    const now = Date.now();
    const tenderId = await ctx.db.insert("tenders", {
      ...args,
      scrapedAt: now,
    });

    // Record audit trace
    await ctx.db.insert("auditLogs", {
      tenderId,
      actionType: "crawl_discovered",
      actor: "Firecrawl",
      details: `Ingested new procurement opportunity: ${args.title} (${args.tenderNumber}) from ${args.agency}`,
      metadata: JSON.stringify({
        budgetUsd: args.estimatedBudgetUsd,
        deadline: args.submissionDeadline,
        url: args.sourceUrl,
      }),
      timestamp: now,
    });

    return tenderId;
  },
});

/**
 * Update opportunity lifecycle status
 */
export const updateStatus = mutation({
  args: {
    id: v.id("tenders"),
    status: v.union(
      v.literal("discovered"),
      v.literal("analyzing"),
      v.literal("bidding"),
      v.literal("submitted"),
      v.literal("won"),
      v.literal("lost")
    ),
  },
  handler: async (ctx: any, args: any) => {
    const tender = await ctx.db.get(args.id);
    if (!tender) throw new Error("Tender not found");

    await ctx.db.patch(args.id, { status: args.status });

    await ctx.db.insert("auditLogs", {
      tenderId: args.id,
      actionType: "score_updated",
      actor: "User",
      details: `Updated tender lifecycle status from ${tender.status} to ${args.status}`,
      timestamp: Date.now(),
    });
  },
});

/**
 * Update win score and risk level
 */
export const updateWinScore = mutation({
  args: {
    id: v.id("tenders"),
    winScore: v.number(),
    riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    specEmbedding: v.optional(v.array(v.float64())),
  },
  handler: async (ctx: any, args: any) => {
    const patchData: any = {
      winScore: args.winScore,
      riskLevel: args.riskLevel,
    };
    if (args.specEmbedding) {
      patchData.specEmbedding = args.specEmbedding;
    }

    await ctx.db.patch(args.id, patchData);

    await ctx.db.insert("auditLogs", {
      tenderId: args.id,
      actionType: "score_updated",
      actor: "OpenAI",
      details: `Computed new win probability: ${args.winScore}% (${args.riskLevel.toUpperCase()} risk)`,
      timestamp: Date.now(),
    });
  },
});

/**
 * Delete a tender and its associated data
 */
export const deleteTender = mutation({
  args: {
    id: v.id("tenders"),
  },
  handler: async (ctx: any, args: any) => {
    const tender = await ctx.db.get(args.id);
    if (!tender) return;

    // Delete compliance checks
    const checks = await ctx.db
      .query("complianceChecks")
      .withIndex("by_tender", (q: any) => q.eq("tenderId", args.id))
      .collect();
    for (const check of checks) {
      await ctx.db.delete(check._id);
    }

    // Delete proposals
    const proposals = await ctx.db
      .query("proposals")
      .withIndex("by_tender", (q: any) => q.eq("tenderId", args.id))
      .collect();
    for (const proposal of proposals) {
      await ctx.db.delete(proposal._id);
    }

    // Delete threads and messages
    const threads = await ctx.db
      .query("emailThreads")
      .withIndex("by_tender", (q: any) => q.eq("tenderId", args.id))
      .collect();
    for (const thread of threads) {
      await ctx.db.delete(thread._id);
    }
    const messages = await ctx.db
      .query("emailMessages")
      .withIndex("by_tender", (q: any) => q.eq("tenderId", args.id))
      .collect();
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the tender itself
    await ctx.db.delete(args.id);
  },
});
