'use client'
import { IMessage } from "@/interfaces/IMessage";

const classes = {
    "user": "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-primary text-primary-foreground",
    "bot": "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted"
}

export default function Message(props : IMessage) {
    return (
        <div className={props.user ? classes.user : classes.bot}>
            <p>{props.message}</p>
        </div>
    );
}