import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: {
    id: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    // Ensure args.id is defined and valid
    if (!args.id) {
      throw new ConvexError("Conversation ID is missing or invalid");
    }

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

    const conversation = await ctx.db.get(args.id);
    if (!conversation) {
      throw new ConvexError("Conversation not found");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId_conversationId", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", conversation._id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You are not a member of this conversation");
    }

    const allConversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .collect();

    if (!conversation.isGroup) {
      const otherMembership = allConversationMemberships.find(
        (membership) => membership.memberId !== currentUser._id
      );

      if (!otherMembership) {
        throw new ConvexError("Other member not found");
      }

      const otherMemberDetails = await ctx.db.get(otherMembership.memberId);

      if (!otherMemberDetails) {
        throw new ConvexError("Other member details not found");
      }

      return [{
        conversation: {
          ...conversation,
        },
        otherMember: {
          ...otherMemberDetails,
          lastSeenMessageId: otherMembership.lastSeenMessage,
        },
      }];
    }

    return [{
      conversation: {
        ...conversation,
      },
      otherMember: null,
      otherMembers: allConversationMemberships.map((membership) => ({
        memberId: membership.memberId,
        lastSeenMessageId: membership.lastSeenMessage,
      })),
    }];
  },
});
