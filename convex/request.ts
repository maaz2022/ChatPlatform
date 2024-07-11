
import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { receiveMessageOnPort } from "worker_threads";

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
            .unique();
        if (requestAlreadySent) {
            throw new ConvexError("Request already sent");
        }

        const requestAlreadyRecieved = await ctx.db
            .query("requests")
            .withIndex("by_reciever_sender", (q) => q.eq("reciever", currentUser._id).eq("sender", reciever._id))
            .unique();
        if (requestAlreadyRecieved) {
            throw new ConvexError("This user has already sent you a request");
        }

        const friend1 = await ctx.db.query("friends").withIndex("by_user1"
        , (q) => q.eq("user1",currentUser._id)).collect()

        const friend2 = await ctx.db.query("friends").withIndex("by_user2"
            , (q) => q.eq("user2",currentUser._id)).collect()

            if(
                friend1.some((friend)=>friend.user2 === reciever._id) ||
                friend2.some((friend) => friend.user1 === reciever._id)
            ){
                throw new ConvexError("You are already friend with this user")
            }
        const request = await ctx.db.insert("requests", {
            sender: currentUser._id,
            reciever: reciever._id,
        });
        return request;
    },
});


export const deny = mutation({
    args: {
        id: v.id("requests"),
        email: v.string(),
    },
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

        const reciever = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();
        if (!reciever) {
            throw new ConvexError("User could not be found");
        }

        const request = await ctx.db.get(args.id);
        if (!request || request.reciever !== currentUser._id) {
            throw new ConvexError("There was an error denying this request");
        }

        await ctx.db.delete(request._id);
        return request;
    },
});

export const accept = mutation({
    args:{
        id: v.id("requests")
    }, handler: async (ctx, args) => {
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
        
        const request = await ctx.db.get(args.id);

        if(!request || request.reciever !== currentUser._id)    
            {
            throw new ConvexError("There was an error accepting this request")
        }
        const conversationId = await ctx.db.insert("conversations",{
            isGroup : false,
        });
        await ctx.db.insert("friends",{
            user1: currentUser._id,
            user2: request.sender,
            conversationId
        });
        await ctx.db.insert(
            "conversationMembers",{
                memberId: currentUser._id,
                conversationId
            })
        await ctx.db.insert(
                "conversationMembers",{
                    memberId: request.sender,
                    conversationId
                })
        await ctx.db.delete(request._id)
    },
});     

