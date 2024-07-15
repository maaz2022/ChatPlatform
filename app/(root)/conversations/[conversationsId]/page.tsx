"use client"
import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import ChatInput from "./_components/input/ChatInput";
import Header from "./_components/Header";
import Body from "./_components/body/Body";

type Props = {
  params: {
    conversationId: Id<"conversations">; // Ensure conversationId is of type Id<"conversations">
  };
};

const ConversationPage = ({ params: { conversationId } }: Props) => {
  const conversationArray = useQuery(api.conversation.get, { id: conversationId });

  console.log("Fetched conversation:", conversationArray);

  if (conversationArray === undefined) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8" />
      </div>
    );
  }

  if (conversationArray === null || conversationArray.length === 0) {
    return (
      <p className="w-full h-full flex items-center justify-center">
        Conversation not found
      </p>
    );
  }

  const { conversation, otherMember } = conversationArray[0];

  console.log("Other Member:", otherMember);

  const isGroup = conversation.isGroup;

  return (
    <ConversationContainer>
      <Header
        name={
          isGroup
            ? conversation.name || ""
            : otherMember?.username || "Unknown User"
        }
        imageUrl={isGroup ? undefined : otherMember?.imageUrl || ""}
      />
      <Body />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationPage;
