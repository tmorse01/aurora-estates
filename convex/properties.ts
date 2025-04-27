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
    // Start with a basic query
    let propertiesQuery = ctx.db.query("properties");
    
    // Apply price filters if provided
    if (args.minPrice !== undefined) {
      propertiesQuery = propertiesQuery.filter(q => 
        q.gte(q.field("price"), args.minPrice!)
      );
    }
    
    if (args.maxPrice !== undefined) {
      propertiesQuery = propertiesQuery.filter(q => 
        q.lte(q.field("price"), args.maxPrice!)
      );
    }
    
    // Apply bedroom filters if provided
    if (args.minBeds !== undefined) {
      propertiesQuery = propertiesQuery.filter(q => 
        q.gte(q.field("bedrooms"), args.minBeds!)
      );
    }
    
    if (args.maxBeds !== undefined) {
      propertiesQuery = propertiesQuery.filter(q => 
        q.lte(q.field("bedrooms"), args.maxBeds!)
      );
    }
    
    // Apply bathroom filters if provided
    if (args.minBaths !== undefined) {
      propertiesQuery = propertiesQuery.filter(q => 
        q.gte(q.field("bathrooms"), args.minBaths!)
      );
    }
    
    if (args.maxBaths !== undefined) {
      propertiesQuery = propertiesQuery.filter(q => 
        q.lte(q.field("bathrooms"), args.maxBaths!)
      );
    }
    
    // Apply square feet filters if provided
    if (args.minSqFt !== undefined) {
      propertiesQuery = propertiesQuery.filter(q => 
        q.gte(q.field("squareFeet"), args.minSqFt!)
      );
    }
    
    if (args.maxSqFt !== undefined) {
      propertiesQuery = propertiesQuery.filter(q => 
        q.lte(q.field("squareFeet"), args.maxSqFt!)
      );
    }
    
    return await propertiesQuery.collect();
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
    // First, get a sample user ID to use for properties
    const sampleUser = await ctx.db
      .query("users")
      .filter(q => q.eq(q.field("email"), "john.doe@example.com"))
      .first();
    
    // If no sample user exists, we need to create one
    let userId;
    if (sampleUser) {
      userId = sampleUser._id;
    } else {
      // Create a sample user if none exists
      userId = await ctx.db.insert("users", {
        name: "John Doe",
        email: "john.doe@example.com",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        isAnonymous: false
      });
    }

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
        userId: userId, // Using our sample user ID
      },
      // ... Add 19 more sample properties with similar structure but different details
    ];

    for (const property of sampleProperties) {
      await ctx.db.insert("properties", property);
    }
  },
});
