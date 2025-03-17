'use client'
import Image from "next/image";
import ChatWindow from "@/components/ChatWindow";
export default function Home() {
  return (
    <div className=" p-20 justify-items-center">
      <main className="min-h-full max-h-full" >
        <ChatWindow></ChatWindow>
      </main>      
    </div>
  );
}
