"use client";

import { useState } from "react";
import { SendIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "") return;
    
    console.log("Sending message:", message);
    onSendMessage(message.trim());
    setMessage("");
  };

  return (
    <motion.div
      className="sticky bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-[#E9BBAE]/30 p-4 z-10 shadow-[0_-4px_10px_rgba(233,187,174,0.1)]"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form 
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto relative"
      >
        <div className="relative flex items-center">
          {/* Empty div for spacing, no star */}
          <div className="absolute left-4 w-5"></div>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message Luma..."
            className="w-full py-3.5 pl-12 pr-14 bg-[#E9BBAE] bg-opacity-10 border-2 border-[#E9BBAE] rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#E9BBAE]/30 focus:border-[#E9BBAE] transition-all"
          />
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={message.trim() === ""}
            className="absolute right-3 p-2 rounded-full text-white bg-[#E9BBAE] disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-md hover:shadow-lg"
            aria-label="Send message"
          >
            <SendIcon size={18} />
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}