"use client"
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { Form, useForm } from "react-hook-form";

import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { FormInput, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

type Props = {};

const addFriendFormSchema = z.object({
    email:z.string().min(1,{message: "this field can't be empty"})
    .email("please enter a valid email"),

});

const AddFriendDialog = (props: Props) => {
    const form = useForm<z.infer<typeof addFriendFormSchema>>({
        resolver: zodResolver
        (addFriendFormSchema),
        defaultValues:{
            email:"",
        }
    });
    const handleSubmit = () => {}
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <FormField control={form.control} name="email" render={({field}) =>
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><input placeholder="Email..." {...field}/></FormControl>
                            </FormItem>
                        }></FormField>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
export default AddFriendDialog	