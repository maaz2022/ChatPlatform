import { ConvexError, v } from "convex/values";
import { MutationCtx, QueryCtx } from "./_generated/server";

export const getUserByClerkId = async ({
  ctx,
  clerkId,
}: {
  ctx: QueryCtx | MutationCtx;
  clerkId: string;
}) => {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
    .unique();

  if (!user) {
    
    
    throw new ConvexError("User not found");
  }

  return user;
};
