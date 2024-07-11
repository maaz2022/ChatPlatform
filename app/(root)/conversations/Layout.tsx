"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import DMConversationItem from "./_components/DMConversationItems";
type Props = React.PropsWithChildren<{}>;

const CoversationsLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);

  console.log("Conversations: ", conversations); // Add this line to log the conversations

  return (
    <>  
      <ItemList title="Conversation">
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No Conversation Found 
            </p>
          ) : (
            conversations.map((conversations) => {
              if (conversations.conversation.isGroup) return null;
              return (
                <DMConversationItem
                  key={conversations.conversation._id}
                    id={conversations.conversation._id}
                  username={conversations.otherMember?.username || ""}
                  imageUrl={conversations.otherMember?.imageUrl || ""}
                />
              );
            })
          )
        ) : (
          <Loader2 />
        )}
      </ItemList>
      {children}
    </>
  );
};

export default CoversationsLayout;
