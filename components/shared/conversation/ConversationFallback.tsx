import { Card } from "@/components/ui/card";
import React from "react";


const ConversationFallback = () => {
    return (
        <Card className="hidden lg:flex h-full w-full p-2 justify-center items-center bg-secondary text-secondary-foreground ">
            Select a Conversation to get Started
        </Card>
    );
};
export default ConversationFallback	;