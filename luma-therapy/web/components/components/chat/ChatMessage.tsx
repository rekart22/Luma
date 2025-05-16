"use client";

import { cn } from "@/lib/lib/utils";
import { Avatar } from "@/components/components/ui/avatar";
import { motion } from "framer-motion";
import Logo from "../Logo";
import { formatDistanceToNow } from "date-fns";

type MessageRole = "user" | "assistant";

interface ChatMessageProps {
  content: string;
  role: MessageRole;
  timestamp: Date;
  isTyping?: boolean;
}

export default function ChatMessage({
  content,
  role,
  timestamp,
  isTyping = false,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      className={cn(
        "flex w-full mb-4 items-start gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isUser && (
        <div className="flex-shrink-0 pt-1">
          <Logo size="sm" />
        </div>
      )}

      <div
        className={cn(
          "flex flex-col max-w-[85%] md:max-w-[75%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-md",
            isUser
              ? "bg-[#C0D6DF] text-gray-800 rounded-tr-sm" // Pale sky gray-blue
              : "bg-[#FCE6DF] text-gray-800 rounded-tl-sm border border-[#E9BBAE]/30" // Soft coral glow
          )}
        >
          <p className="leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        <span className="text-xs text-gray-400 mt-1 px-1">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </span>
      </div>

      {isUser && (
        <div className="flex-shrink-0 pt-1">
          <Avatar className="h-8 w-8 border-2 border-[#D6EDEA]/50">
            <div className="w-full h-full bg-[#D6EDEA]" /> {/* Pale seafoam */}
          </Avatar>
        </div>
      )}
    </motion.div>
  );
}