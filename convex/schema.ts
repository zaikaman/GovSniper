import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  vendorProfiles: defineTable({
    name: v.string(),
    industry: v.string(),
    capabilities: v.array(v.string()),
    certifications: v.array(v.string()),
    bondingLimitUsd: v.number(),
    pastPerformance: v.array(
      v.object({
        title: v.string(),
        client: v.string(),
        valueUsd: v.number(),
        year: v.number(),
        summary: v.string(),
      })
    ),
    capabilityEmbedding: v.optional(v.array(v.float64())),
    updatedAt: v.number(),
  }).vectorIndex("by_capability_embedding", {
    vectorField: "capabilityEmbedding",
    dimensions: 1536,
  }),

  tenders: defineTable({
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
    scrapedAt: v.number(),
    specsMarkdown: v.string(),
    summary: v.string(),
    winScore: v.number(),
    riskLevel: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    assignedAgentEmail: v.string(),
    officerName: v.optional(v.string()),
    officerEmail: v.optional(v.string()),
    specEmbedding: v.optional(v.array(v.float64())),
  })
    .index("by_status", ["status"])
    .index("by_deadline", ["submissionDeadline"])
    .index("by_win_score", ["winScore"])
    .index("by_agent_email", ["assignedAgentEmail"])
    .vectorIndex("by_spec_embedding", {
      vectorField: "specEmbedding",
      dimensions: 1536,
    }),

  complianceChecks: defineTable({
    tenderId: v.id("tenders"),
    category: v.union(
      v.literal("Legal"),
      v.literal("Technical"),
      v.literal("Financial"),
      v.literal("Insurance"),
      v.literal("Operational")
    ),
    requirementText: v.string(),
    status: v.union(
      v.literal("passed"),
      v.literal("warning"),
      v.literal("disqualified")
    ),
    citation: v.string(),
    notes: v.string(),
    isDisqualifier: v.boolean(),
  })
    .index("by_tender", ["tenderId"])
    .index("by_tender_status", ["tenderId", "status"]),

  proposals: defineTable({
    tenderId: v.id("tenders"),
    version: v.number(),
    title: v.string(),
    executiveSummary: v.string(),
    technicalApproach: v.string(),
    pricingStrategy: v.string(),
    teamQualifications: v.string(),
    liveContent: v.string(),
    lastEditedBy: v.string(),
    status: v.union(
      v.literal("drafting"),
      v.literal("in_review"),
      v.literal("approved"),
      v.literal("exported")
    ),
    updatedAt: v.number(),
  }).index("by_tender", ["tenderId"]),

  emailThreads: defineTable({
    tenderId: v.id("tenders"),
    subject: v.string(),
    agentEmail: v.string(),
    officerEmail: v.string(),
    officerName: v.string(),
    lastMessageAt: v.number(),
  })
    .index("by_tender", ["tenderId"])
    .index("by_agent_email", ["agentEmail"]),

  emailMessages: defineTable({
    threadId: v.id("emailThreads"),
    tenderId: v.id("tenders"),
    messageId: v.string(),
    direction: v.union(v.literal("inbound"), v.literal("outbound")),
    sender: v.string(),
    recipient: v.string(),
    subject: v.string(),
    bodyText: v.string(),
    bodyHtml: v.optional(v.string()),
    isAddendum: v.boolean(),
    redlineDiff: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_thread", ["threadId"])
    .index("by_tender", ["tenderId"])
    .index("by_message_id", ["messageId"]),

  auditLogs: defineTable({
    tenderId: v.optional(v.id("tenders")),
    actionType: v.union(
      v.literal("crawl_discovered"),
      v.literal("analysis_started"),
      v.literal("analysis_completed"),
      v.literal("score_updated"),
      v.literal("addendum_received"),
      v.literal("rfi_dispatched"),
      v.literal("proposal_generated"),
      v.literal("proposal_edited"),
      v.literal("simulation_step"),
      v.literal("pipeline_step"),
      v.literal("vendor_profile_updated")
    ),
    actor: v.string(),
    details: v.string(),
    metadata: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_tender", ["tenderId"])
    .index("by_timestamp", ["timestamp"]),
});
