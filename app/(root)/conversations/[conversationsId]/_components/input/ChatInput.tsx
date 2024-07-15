// ChatInput.tsx

import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useConversation } from "@/hooks/useConversation";
import { useMutationState } from "@/hooks/useMutationState";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";

const chatMessageSchema = z.object({
  content: z.string().min(1, "Please enter a message."),
});

const ChatInput = () => {
  const { conversationId } = useConversation();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: createMessage, pending } = useMutationState(api.message.create);

  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.setValue("content", event.target.value);
  };

  const handleSubmit = async (values: z.infer<typeof chatMessageSchema>) => {
    try {
      if (!conversationId) {
        throw new Error("No conversationId available.");
      }

      await createMessage({
        conversationId,
        type: "text",
        content: [values.content],
      });
      form.reset();
      console.log("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        error instanceof ConvexError
          ? error.data
          : "Unexpected error occurred."
      );
    }
  };

  return (
    <Card className="w-full p-2 rounded-lg relative">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2 items-end w-full">
        <TextareaAutosize
          {...form.register("content")}
          ref={textAreaRef}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              await form.handleSubmit(handleSubmit)();
            }
          }}
          rows={1}
          maxRows={3}
          onChange={handleInputChange}
          value={form.watch("content") || ""}
          placeholder="Type a message..."
          className="min-h-full w-full resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors duration-300 ease-in-out"
        />
        <Button disabled={pending} size="icon" type="submit">
          <SendHorizonal />
        </Button>
      </form>
    </Card>
  );
};

export default ChatInput;
