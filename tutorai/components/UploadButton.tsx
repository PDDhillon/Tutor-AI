'use client'
import { IMessage } from "@/interfaces/IMessage";
import { Button } from "./ui/button";
import { FileUp } from "lucide-react";
import { Input } from "./ui/input";

const classes = {
    "user": "flex w-max max-w-[50%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-primary text-primary-foreground break-words",
    "bot": "flex w-max max-w-[50%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted break-words"
}

export default function UploadButton() {

    function onClick() {
        console.log("Upload button clicked");
    }
    return (
        
        <Input type="file" id="file"  onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
                console.log("File selected: ", file.name);
            }
        }}></Input>
    );
}