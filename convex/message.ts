// api/message.js
import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    type: v.string(),
    content: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("Received request to create message with args:", args);
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const membership = await ctx.db.query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You aren't a member of this conversation");
    }

    const messageId = await ctx.db.insert("messages", {
      senderId: currentUser._id,
      ...args,
    });

    console.log("Message created with ID:", messageId);

    try {
      await ctx.db.patch(args.conversationId, { lastmessageId: messageId });
      console.log("Conversation updated with last message ID");
    } catch (error) {
      console.error("Error updating conversation:", error);
      throw new ConvexError("Failed to update conversation");
    }

    return messageId;
  },
});
