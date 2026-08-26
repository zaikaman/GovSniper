import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { api } from "./_generated/api";

/**
 * Query to retrieve current vendor profile
 */
export const getProfile = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("vendorProfiles").order("desc").first();
  },
});

/**
 * Mutation to save or update vendor profile
 */
export const saveProfile = mutation({
  args: {
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
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db.query("vendorProfiles").first();
    const now = Date.now();

    let profileId;
    if (existing) {
      profileId = existing._id;
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
    } else {
      profileId = await ctx.db.insert("vendorProfiles", {
        ...args,
        updatedAt: now,
      });
    }

    // Record audit log
    await ctx.db.insert("auditLogs", {
      actionType: "vendor_profile_updated",
      actor: "User",
      details: `Updated vendor profile credentials for ${args.name} (${args.industry})`,
      timestamp: now,
    });

    return profileId;
  },
});

/**
 * Mutation to save computed capability embedding
 */
export const updateCapabilityEmbedding = mutation({
  args: {
    profileId: v.id("vendorProfiles"),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx: any, args: any) => {
    await ctx.db.patch(args.profileId, {
      capabilityEmbedding: args.embedding,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Action to generate OpenAI vector embeddings for vendor capabilities
 */
export const generateCapabilityEmbedding = action({
  args: {
    profileId: v.id("vendorProfiles"),
    name: v.string(),
    industry: v.string(),
    capabilities: v.array(v.string()),
    certifications: v.array(v.string()),
    pastPerformanceSummaries: v.array(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const baseURL = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

    if (!apiKey) {
      console.warn("OPENAI_API_KEY not configured, skipping vector embedding generation.");
      return null;
    }

    const openai = new OpenAI({
      apiKey,
      baseURL,
    });

    const capabilityText = [
      `Company: ${args.name}`,
      `Industry: ${args.industry}`,
      `Core Capabilities: ${args.capabilities.join(", ")}`,
      `Certifications: ${args.certifications.join(", ")}`,
      `Track Record:\n${args.pastPerformanceSummaries.join("\n")}`,
    ].join("\n\n");

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: capabilityText,
    });

    const embedding = response.data[0].embedding;

    // Save vector embedding into Convex
    await ctx.runMutation(api.vendors.updateCapabilityEmbedding, {
      profileId: args.profileId,
      embedding,
    });

    return embedding;
  },
});
