import { useParams } from "next/navigation";
import { useMemo } from "react";

export const useConversation = () => {
    const params = useParams();
    
    console.log("Params:", params); // Log params object to check its structure
    
    const conversationId = useMemo(() => params?.conversionid || "", [params?.conversionid]);
    console.log("conversationId:", conversationId); // Log conversationId to verify its value
    
    const isActive = useMemo(() => !!conversationId, [conversationId]);
    console.log("isActive:", isActive); // Log isActive to verify its value
    
    return {
        isActive,
        conversationId,
    };
};
