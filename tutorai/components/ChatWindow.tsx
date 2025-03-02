import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IMessage } from "@/interfaces/IMessage";
import { Send } from "lucide-react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { fetchEventSource } from "@microsoft/fetch-event-source";
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
    },]);

    const [currentMessage, setCurrentMessage] = useState("");

    useEffect(() => {
        if(currentMessage === "") 
            return;

        const copy = [...messages];
        //last message will always be the one that needs updating
        copy[copy.length -1].message = currentMessage;
        setMessages(copy);
    }, [currentMessage]);

    async function fetchData(query: String) {
        await fetchEventSource("http://localhost:8000/chat", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ query }),
            onmessage: (event) => {
                console.log(`Received event: ${event.event}`);
                setCurrentMessage((prev) => prev + event.data);
            }
        })
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        const test = async () => {
            await fetchData(values.message);
        }
        setCurrentMessage("");
        setMessages((prev) => [...prev, { id: 2, message: values.message, user: true }, { id: 3, message: "", user: false }]);
        form.reset();
        test();
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Tutor AI</CardTitle>
                <CardDescription>Your helpful education assistant</CardDescription>
            </CardHeader>
            <CardContent className="justify-items-center">
                <div className="grid w-full items-center gap-5">
                    <Card className="w-full ">
                        <CardContent className="">
                            <div className="p-6 space-y-4">
                                {messages.map((message, index) => {
                                    return <Message key={index} message={message.message} user={message.user} />
                                })}
                            </div>
                        </CardContent>
                    </Card>
                    <div className="">
                        <Form {...form}>
                            <form className="flex w-full space-x-2 justify-content-center" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input className=" w-full " placeholder="Type your message here ..." {...field} />
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