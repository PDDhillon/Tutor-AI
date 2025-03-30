'use client'
import Image from "next/image";
import ChatWindow from "@/components/ChatWindow";
import { Toaster } from "@/components/ui/toaster";
export default function Home() {
  return (
    <div className=" p-20 justify-items-center">
      <main className="min-h-full max-h-full w-8/12" >
        <ChatWindow></ChatWindow>
        <Toaster />
      </main>      
    </div>
  );
}
