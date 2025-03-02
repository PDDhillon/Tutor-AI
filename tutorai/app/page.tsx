'use client'
import Image from "next/image";
import ChatWindow from "@/components/ChatWindow";
export default function Home() {
  return (
    <div className="m-auto p-20 ">
      <main className="" >
        <ChatWindow></ChatWindow>
      </main>      
    </div>
  );
}
