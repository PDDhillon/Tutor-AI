import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { IMessage } from "@/interfaces/IMessage";
import { Send } from "lucide-react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import Message from "@/components/Message";
import { Loader2 } from "lucide-react"
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { useToast } from "@/hooks/use-toast"

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
    const [progress, setProgress] = useState(0);
    const { toast } = useToast()
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        if (currentMessage === "")
            return;

        const copy = [...messages];
        //last message will always be the one that needs updating
        copy[copy.length - 1].message = currentMessage;
        setMessages(copy);

        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
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

    async function uploadFile(file: File) {
        const formData = new FormData();
        formData.append("file", file);

        const data = await fetch("http://localhost:8000/index", {
            method: "POST",
            body: formData
        })

        if (!data.ok) {
            console.error("Error uploading file");
            return;
        }
        else {
            const json = await data.json();
            console.log(`Received event: ${data}`);
            setMessages((prev) => [...prev, { message: "File Uploaded: " + file.name, user: true }]);
        }
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        const test = async () => {
            await fetchData(values.message);
        }
        setCurrentMessage("");
        setMessages((prev) => [...prev, { message: values.message, user: true }, { message: "", user: false }]);
        form.reset();
        test();
    }

    return (
        <Card className="w-7xl">
            <CardHeader>
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Tutor AI</CardTitle>
                        <CardDescription>Your helpful education assistant</CardDescription>
                    </div>
                    {/* <div>
                        <UploadButton></UploadButton>
                    </div> */}
                </div>
            </CardHeader>
            <CardContent className="justify-items-center">
                <div className="w-8/12 py-5" hidden={progress === 100}>
                    <div id="input" hidden={progress !== 0}>
                        <Label htmlFor="file">File</Label>
                        <Input type="file" id="file" onChange={async (e) => {
                            setProgress(20);
                            const file = e.target.files?.[0];
                            if (file) {
                                console.log("File selected: ", file.name);
                                await uploadFile(file).then(() => {
                                    setProgress(100); toast({
                                        title: "File uploaded successfully",
                                        description: "You can now ask questions about the file."
                                    });
                                });
                            }
                        }} />
                    </div >
                    <div id="progress" className="py-5" hidden={progress === 0}>
                        <div className="flex flex-row items-center justify-between">
                            <p>Uploading </p>
                            <Loader2 className="animate-spin" />
                        </div>
                        <Progress value={progress} className="w-full" hidden={false} />
                    </div>

                </div>
                <div className="w-full justify-items-center gap-5">
                    <Card className="w-11/12 max-w-7xl ">
                        <CardContent className="min-h-96 max-h-96 overflow-y-auto" ref={messagesEndRef}>
                            <div className="p-6 space-y-4 max-h-full">
                                {messages.map((message, index) => {
                                    return <Message key={index} message={message.message} user={message.user} />
                                })}
                                <div ref={messagesEndRef}></div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="p-4 ">
                        <Form {...form}>
                            <form className="flex w-full space-x-2 justify-content-center" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input className=" min-w-96" placeholder="Type your message here ..." {...field} />
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