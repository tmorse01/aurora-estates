import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";

// Query to get the current authenticated user
export const getUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

// Query to get a user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", args.email))
      .unique();
  },
});

// Mutation to create a new user when they sign up
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    pictureUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be authenticated to create a user profile");
    }
    
    // Check if user already exists
    const existingUser = await ctx.db.get(userId);
    if (existingUser) {
      throw new Error("User profile already exists");
    }
    
    // Update the user document
    await ctx.db.patch(userId, {
      name: args.name,
      email: args.email,
      ...(args.pictureUrl && { image: args.pictureUrl }),
    });
    
    return userId;
  },
});

// Add sample users for testing/development
export const addSampleUsers = mutation({
  args: {},
  handler: async (ctx) => {
    // Sample users data
    const sampleUsers = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        isAnonymous: false
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        isAnonymous: false
      },
      {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        isAnonymous: false
      }
    ];

    const userIds = [];
    for (const user of sampleUsers) {
      // Check if user already exists to avoid duplicates
      const existing = await ctx.db
        .query("users")
        .withIndex("email", q => q.eq("email", user.email))
        .unique();
      
      if (!existing) {
        const userId = await ctx.db.insert("users", user);
        userIds.push(userId);
      }
    }

    return userIds;
  }
});
