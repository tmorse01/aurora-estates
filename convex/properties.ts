import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

export const add = mutation({
  args: {
    title: v.string(),
    address: v.string(),
    price: v.number(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    squareFeet: v.number(),
    description: v.string(),
    imageUrl: v.string(),
    features: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to add properties");
    }
    
    await ctx.db.insert("properties", {
      ...args,
      userId,
    });
  },
});

export const get = query({
  args: { id: v.id("properties") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const list = query({
  args: {
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    minBeds: v.optional(v.number()),
    maxBeds: v.optional(v.number()),
    minBaths: v.optional(v.number()),
    maxBaths: v.optional(v.number()),
    minSqFt: v.optional(v.number()),
    maxSqFt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("properties");
    
    if (args.minPrice !== undefined || args.maxPrice !== undefined) {
      query = query.withIndex("by_price", q => {
        if (args.minPrice !== undefined) q = q.gte("price", args.minPrice);
        if (args.maxPrice !== undefined) q = q.lte("price", args.maxPrice);
        return q;
      });
    }
    
    if (args.minBeds !== undefined || args.maxBeds !== undefined) {
      query = query.withIndex("by_bedrooms", q => {
        if (args.minBeds !== undefined) q = q.gte("bedrooms", args.minBeds);
        if (args.maxBeds !== undefined) q = q.lte("bedrooms", args.maxBeds);
        return q;
      });
    }
    
    if (args.minBaths !== undefined || args.maxBaths !== undefined) {
      query = query.withIndex("by_bathrooms", q => {
        if (args.minBaths !== undefined) q = q.gte("bathrooms", args.minBaths);
        if (args.maxBaths !== undefined) q = q.lte("bathrooms", args.maxBaths);
        return q;
      });
    }
    
    if (args.minSqFt !== undefined || args.maxSqFt !== undefined) {
      query = query.withIndex("by_square_feet", q => {
        if (args.minSqFt !== undefined) q = q.gte("squareFeet", args.minSqFt);
        if (args.maxSqFt !== undefined) q = q.lte("squareFeet", args.maxSqFt);
        return q;
      });
    }
    
    return await query.collect();
  },
});

export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("properties")
      .withSearchIndex("search_content", q => 
        q.search("description", args.searchTerm)
      )
      .collect();
  },
});

export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("properties")
      .order("desc")
      .take(6);
  },
});

export const addSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    const sampleProperties = [
      {
        title: "Luxury Waterfront Estate",
        address: "123 Lake Washington Blvd, Seattle, WA",
        price: 5500000,
        bedrooms: 6,
        bathrooms: 7.5,
        squareFeet: 8500,
        description: "Stunning waterfront estate with panoramic lake and mountain views. Features include a private dock, wine cellar, home theater, and guest house.",
        imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227",
        features: ["Waterfront", "Private Dock", "Wine Cellar", "Home Theater", "Guest House", "Smart Home System"],
        userId: await getAuthUserId(ctx),
      },
      // ... Add 19 more sample properties with similar structure but different details
    ];

    for (const property of sampleProperties) {
      await ctx.db.insert("properties", property);
    }
  },
});
