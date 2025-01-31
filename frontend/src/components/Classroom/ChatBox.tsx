"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: Date;
}

export default function RetroGroupChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatEndRef]); //Fixed unnecessary dependency

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== "") {
      const newMessage: Message = {
        id: Date.now(),
        user: "User",
        text: inputMessage,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  return (
    <div className="flex flex-col min-h-[60vh] h-full w-full mx-auto bg-amber-100 p-3 font-mono text-gray-800 border-4 border-orange-800 rounded-lg shadow-lg">
      <div className="flex-grow overflow-auto mb-4 border-2 border-orange-800 p-2 rounded bg-white">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <span className="text-gray-600">
              [{message.timestamp.toLocaleTimeString()}]
            </span>
            <span className="text-[#73bda8] font-bold">{message.user}: </span>
            <span>{message.text}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow bg-white text-gray-800 border-2 border-gray-800 p-2 rounded-l focus:outline-none focus:border-blue-800"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-gray-800 text-white p-2 rounded-r hover:bg-orange-700 focus:outline-none"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
}
