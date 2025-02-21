import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IMessage } from "@/interfaces/IMessage";
import { Send } from "lucide-react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import Message from "@/components/Message";


const formSchema = z.object({
    message: z.string().nonempty({ message: "Message cannot be empty." })
});

export default function ChatWindow() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: ""
        }
    })

    const [messages, setMessages] = useState<IMessage[]>([{
        message: "Hi, how can I help you today?",
        user: false
    },
    {
        message: "Hey, I'm having trouble with my account.",
        user: true
    },
    {
        message: "What seems to be the problem?",
        user: false
    },
    {
        message: "I can't log in.",
        user: true
    }]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        setMessages([...messages, { message: values.message, user: true }]);
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tutor AI</CardTitle>
                <CardDescription>Placeholder</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Card>
                        <CardContent>
                            <div className="p-6 space-y-4">
                                {messages.map((message, index) => {
                                    return <Message key={index} message={message.message} user={message.user} />
                                })}
                            </div>
                        </CardContent>
                    </Card>
                    <div className="">
                        <Form {...form}>
                            <form className="flex w-full max-w-sm items-center space-x-2" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input className=" w-full max-w-sm" placeholder="Type your message here ..." {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}>
                                </FormField>
                                <Button className="flex-shrink-0 text-sm py-1 px-3" type="submit"><Send></Send></Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    );
}