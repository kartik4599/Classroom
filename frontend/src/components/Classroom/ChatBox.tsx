import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { socket } from "@/App";
import useUserInformation from "@/hooks/useUserInformation";
import useRoom from "@/hooks/useRoom";

interface Message {
  user: string;
  text: string;
  timestamp: Date;
}

export default function RetroGroupChat() {
  const userData = useUserInformation((state) => state.userData);
  const roomData = useRoom((state) => state.data);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [chatEndRef]); //Fixed unnecessary dependency

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;
    socket.emit("chat-message", roomData?.id, {
      user: userData?.name!,
      text: inputMessage,
    });
    setInputMessage("");
  };

  useEffect(() => {
    socket.on("chat-message", (data) => {
      setMessages((preMessages) => {
        const dublicateMessage =
          preMessages.find(
            ({ timestamp }) =>
              timestamp.getTime() === new Date(data?.timestamp).getTime()
          ) || preMessages[preMessages.length - 1]?.text === data?.text;
        if (dublicateMessage) return preMessages;

        return [
          ...preMessages,
          { ...data, timestamp: new Date(data?.timestamp) },
        ];
      });
    });
  }, [socket]);

  return (
    <div className="lg:col-span-1 flex flex-col min-h-[60vh] h-[calc(100%-40px)] w-full mx-auto bg-amber-100 p-3 font-mono text-gray-800 border-4 border-orange-800 rounded-lg shadow-lg">
      <div className="flex-grow overflow-auto mb-4 border-2 border-orange-800 p-2 rounded bg-white">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
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
