"use client"
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { Form, FormProvider, useForm } from "react-hook-form";

import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { FormInput, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutationState } from "@/hooks/useMutationState";
import { api } from "@/convex/_generated/api";
import { error } from "console";
import { toast } from "sonner";
import { ConvexError } from "convex/values";

type Props = {};

const addFriendFormSchema = z.object({
    email:z.string().min(1,{message: "this field can't be empty"})
    .email("please enter a valid email"),
});


const AddFriendDialog = (props: Props) => {
    const {mutate:createRequest,pending}
    =useMutationState(api.request.create);
    const form = useForm<z.infer<typeof addFriendFormSchema>>({
        resolver: zodResolver
        (addFriendFormSchema),
        defaultValues:{
            email:"",
        },
    });
    const handleSubmit =async (values: z.infer<typeof addFriendFormSchema>) => {
        await createRequest({
            email: values.email}).then(() => {
                form.reset();
                toast.success("Friend request sent!");
            }).catch(error => {
                toast.error(error instanceof ConvexError ? error.data : "Unexpected error occured")
            })
    };

    return (
        <Dialog>
            <Tooltip>
                <TooltipTrigger>
                    <Button size="icon" variant="outline">
                        <DialogTrigger>
                            <UserPlus/>
                        </DialogTrigger>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Add Friend</p>
                </TooltipContent>
            </Tooltip>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add Friend
                    </DialogTitle>
                    <DialogDescription>
                        send a request to connect with your Friends
                    </DialogDescription>
                </DialogHeader>
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <FormField control={form.control} name="email" render={({field}) =>(
                            <FormItem>
                                <FormLabel>Email</FormLabel><br />
                                <FormControl><input placeholder="Email..." {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <DialogFooter>
                            <Button disabled={pending} type="submit">Send</Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
export default AddFriendDialog	