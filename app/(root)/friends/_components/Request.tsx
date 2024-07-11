import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ConvexError } from "convex/values";
import { Check, User, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {
  id: Id<"requests">;
  imageUrl: string;
  username: string;
  email: string;
};

const Request = ({ id, imageUrl, username, email }: Props) => {
  const { mutate: denyRequest, pending: denyPending } = useMutationState(api.request.deny);

  const handleDenyRequest = async () => {
    try {
      await denyRequest({ id, email });
      toast.success("Friend Request Denied");
    } catch (error) {
      toast.error(error instanceof ConvexError ? error.message : "Unexpected error occurred");
    }
  };
  const { mutate: acceptRequest, pending: acceptPending } = useMutationState(api.request.accept);
  const handleAcceptRequest = async () => {
    try {
      await acceptRequest({ id});
      toast.success("Friend Request Accepted");
    } catch (error) {
      toast.error(error instanceof ConvexError ? error.message : "Unexpected error occurred");
    }
  }

  return (
    <Card className="w-full p-2 flex flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-4 truncate">
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{username}</h4>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" disabled={denyPending || acceptPending}  onClick={handleAcceptRequest}>
            <Check />
          </Button>
          <Button size="icon" disabled={denyPending} variant="destructive" onClick={handleDenyRequest}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Request;
function acceptRequest(arg0: { id: Id<"requests">; email: string; }) {
  throw new Error("Function not implemented.");
}

