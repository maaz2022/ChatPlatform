import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject,
        });

        if (!currentUser) {
            throw new ConvexError("User not found");
        }

        // Fetch conversation memberships
        const conversationMemberships = await ctx.db.query("conversationMembers")
            .withIndex("by_memberId", q => q.eq("memberId", currentUser._id))
            .collect();

        // Fetch conversations
        const conversations = await Promise.all(conversationMemberships.map(async (membership) => {
            const conversation = await ctx.db.get(membership.conversationId);
            if (!conversation) {
                console.error(`Conversation with ID ${membership.conversationId} could not be found`);
                throw new ConvexError("Conversation could not be found");
            }
            return conversation;
        }));

        // Fetch conversation details
        const conversationWithDetails = await Promise.all(conversations.map(async (conversation) => {
            const allConversationMemberships = await ctx.db.query("conversationMembers")
                .withIndex("by_conversationId", q => q.eq("conversationId", conversation._id))
                .collect();

            if (conversation.isGroup) {
                return { conversation };
            } else {
                const otherMembership = allConversationMemberships.find(membership => membership.memberId !== currentUser._id);
                if (!otherMembership) {
                    throw new ConvexError("Other member could not be found");
                }

                const otherMember = await ctx.db.get(otherMembership.memberId);
                return {
                    conversation,
                    otherMember,
                };
            }
        }));

        return conversationWithDetails;
    },
});