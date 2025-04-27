import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  properties: defineTable({
    title: v.string(),
    address: v.string(),
    price: v.number(),
    bedrooms: v.number(),
    bathrooms: v.number(),
    squareFeet: v.number(),
    description: v.string(),
    imageUrl: v.string(),
    features: v.array(v.string()),
    userId: v.id("users"), // Add userId to track property ownership
  })
    .searchIndex("search_content", {
      searchField: "description",
      filterFields: ["price", "bedrooms", "bathrooms", "squareFeet"],
    })
    .index("by_price", ["price"])
    .index("by_bedrooms", ["bedrooms"])
    .index("by_bathrooms", ["bathrooms"])
    .index("by_square_feet", ["squareFeet"])
    .index("by_user", ["userId"]), // Add index for querying by user
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
