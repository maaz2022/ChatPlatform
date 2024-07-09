import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }
        if (args.email === identity.email) {
            throw new ConvexError("Can't send a request to yourself");
        }
        const currentUser = await getUserByClerkId({
            ctx,
            clerkId: identity.subject,
        });
        if (!currentUser) {
            throw new ConvexError("User not found");
        }
        const reciever = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();
        if (!reciever) {
            throw new ConvexError("User could not be found");
        }
        const requestAlreadySent = await ctx.db
            .query("requests")
            .withIndex("by_reciever_sender", (q) => q.eq("reciever", reciever._id).eq("sender", currentUser._id))
            .first();
        if (requestAlreadySent) {
            throw new ConvexError("Request already sent");
        }

        const requestAlreadyRecieved = await ctx.db
            .query("requests")
            .withIndex("by_reciever_sender", (q) => q.eq("reciever", currentUser._id).eq("sender", reciever._id))
            .first();
        if (requestAlreadyRecieved) {
            throw new ConvexError("This user has already sent you a request");
        }
        const request = await ctx.db.insert("requests", {
            sender: currentUser._id,
            reciever: reciever._id,
        });
        return request;
    },
});
