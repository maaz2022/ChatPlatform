// useConversation.ts
import { useParams } from "next/navigation";
import { useMemo } from "react";

export const useConversation = () => {
    const params = useParams();
    
    // Ensure conversationId is correctly derived from params
    const conversationId = useMemo(() => params?.conversationId || "", [params?.conversationId]);

    const isActive = useMemo(() => !!conversationId, [conversationId]);
        
    return {
        isActive,
        conversationId,
    };
};
