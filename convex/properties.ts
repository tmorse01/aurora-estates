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
        title: "Luxury Penthouse Suite",
        address: "1000 1st Ave, Seattle, WA",
        price: 2850000,
        bedrooms: 3,
        bathrooms: 3.5,
        squareFeet: 3200,
        description: "Stunning penthouse with 360-degree views of the city, mountains, and water. Features include a private elevator, wraparound terrace, and designer finishes throughout.",
        imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
        features: ["Private elevator", "Wine cellar", "Smart home system", "Concierge service", "4 parking spaces"],
        userId: userId,
      },
      {
        title: "Waterfront Modern Marvel",
        address: "2200 Alki Ave SW, Seattle, WA",
        price: 3950000,
        bedrooms: 4,
        bathrooms: 4.5,
        squareFeet: 4100,
        description: "Architectural masterpiece with floor-to-ceiling windows showcasing breathtaking Puget Sound views. Private beach access and contemporary design.",
        imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
        features: ["Private beach", "Infinity pool", "Home theater", "Gourmet kitchen", "Heated floors"],
        userId: userId,
      },
      {
        title: "Historic Capitol Hill Manor",
        address: "1200 15th Ave E, Seattle, WA",
        price: 2200000,
        bedrooms: 5,
        bathrooms: 4,
        squareFeet: 4500,
        description: "Meticulously restored 1920s manor with original woodwork and modern updates. Gorgeous landscaped gardens and separate carriage house.",
        imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1600&q=80",
        features: ["Original hardwoods", "Carriage house", "Wine cellar", "Period details", "Mature gardens"],
        userId: userId,
      },
      {
        title: "Sleek Downtown Loft",
        address: "2021 Western Ave, Seattle, WA",
        price: 825000,
        bedrooms: 1,
        bathrooms: 2,
        squareFeet: 1100,
        description: "Industrial-chic loft in historic building with soaring ceilings and exposed brick. Steps from Pike Place Market.",
        imageUrl: "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1600&q=80",
        features: ["14ft ceilings", "Original brick", "Chef's kitchen", "Custom lighting", "Secure parking"],
        userId: userId,
      },
      {
        title: "Green Lake Craftsman",
        address: "7700 Green Lake Dr N, Seattle, WA",
        price: 1450000,
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2800,
        description: "Classic Craftsman charm meets modern luxury. Steps from Green Lake with a large front porch and backyard entertainment space.",
        imageUrl: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1600&q=80",
        features: ["Front porch", "Custom built-ins", "Garden suite", "Modern kitchen", "Wine room"],
        userId: userId,
      },
      {
        title: "Magnolia View Estate",
        address: "3300 Magnolia Blvd W, Seattle, WA",
        price: 4200000,
        bedrooms: 5,
        bathrooms: 5.5,
        squareFeet: 5200,
        description: "Magnificent estate with sweeping views of Puget Sound and Olympic Mountains. Resort-style grounds with pool and sport court.",
        imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80",
        features: ["Pool & spa", "Sport court", "Guest house", "5-car garage", "Home automation"],
        userId: userId,
      },
      {
        title: "Queen Anne Victorian",
        address: "2000 Queen Anne Ave N, Seattle, WA",
        price: 1950000,
        bedrooms: 6,
        bathrooms: 4.5,
        squareFeet: 4200,
        description: "Beautifully preserved Victorian with modern updates. Stunning city views from wraparound porch and primary suite.",
        imageUrl: "https://images.unsplash.com/photo-1568092775154-7fa176a29c0f?auto=format&fit=crop&w=1600&q=80",
        features: ["Period details", "Modern kitchen", "Views", "Garden", "Wine cellar"],
        userId: userId,
      },
      {
        title: "South Lake Union Penthouse",
        address: "1000 Dexter Ave N, Seattle, WA",
        price: 1750000,
        bedrooms: 2,
        bathrooms: 2.5,
        squareFeet: 1800,
        description: "Ultra-modern penthouse with private rooftop deck. Floor-to-ceiling windows and high-end finishes throughout.",
        imageUrl: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80",
        features: ["Rooftop deck", "City views", "Smart home", "Wine fridge", "Concierge"],
        userId: userId,
      },
      {
        title: "Madison Park Beach House",
        address: "1800 43rd Ave E, Seattle, WA",
        price: 3100000,
        bedrooms: 4,
        bathrooms: 3.5,
        squareFeet: 3600,
        description: "Contemporary beach house with private waterfront access. Open concept living with stunning lake views from every room.",
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
        features: ["Waterfront", "Dock", "Master suite", "Media room", "Outdoor kitchen"],
        userId: userId,
      },
      {
        title: "Fremont Modern Townhouse",
        address: "3500 Fremont Ave N, Seattle, WA",
        price: 975000,
        bedrooms: 3,
        bathrooms: 2.5,
        squareFeet: 1900,
        description: "Contemporary townhouse in the heart of Fremont. Roof deck with Space Needle views and high-end finishes throughout.",
        imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
        features: ["Roof deck", "City views", "Garage", "Smart home", "Storage"],
        userId: userId,
      },
    ];

    for (const property of sampleProperties) {
      await ctx.db.insert("properties", property);
    }
  },
});
