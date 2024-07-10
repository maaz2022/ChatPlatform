import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { error } from "console";
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
      await denyRequest({ id });
      console.log("Request denied successfully");
    } catch (error) {
      console.error("Error denying request:", error);
    }
  };

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
          <Button size="icon" disabled={denyPending} onClick={() => {}}>
            <Check />
          </Button>
          <Button size="icon" disabled={denyPending} variant="destructive"onClick={() => {
            denyRequest({id}).then(()=>{
                toast.success("Friend Request Denied")
            }).catch(error)=>{
                toast.error(error instanceof ConvexError ? error.data : "Unexpected error occured")
            }
          }}>
            <X className="h-4 w-4" />
        </Button>
        </div>
      </div>
    </Card>
  );
};

export default Request;
