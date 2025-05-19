"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/components/chat/ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import WelcomeMessage from "./WelcomeMessage";
import { motion } from "framer-motion";
import Logo from "../Logo";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentStreamingMessage]);

  // Helper function to generate a message ID
  const generateMessageId = () => Date.now().toString();

  // Process the streamed response from the API
  const processStreamedResponse = async (response: Response) => {
    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let messageContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the received chunk
        const chunk = decoder.decode(value);
        
        // Process each line (event) in the chunk
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.substring(6));
              
              if (data.error) {
                throw new Error(data.error);
              }
              
              if (data.done) {
                // End of stream, add the complete message
                if (messageContent.trim()) {
                  const assistantMessage: Message = {
                    id: generateMessageId(),
                    content: messageContent,
                    role: "assistant",
                    timestamp: new Date(),
                  };
                  setMessages(prev => [...prev, assistantMessage]);
                }
                setIsTyping(false);
                setCurrentStreamingMessage("");
                return;
              }
              
              if (data.token) {
                // Update the streaming message with the new token
                messageContent += data.token;
                setCurrentStreamingMessage(messageContent);
              }
            } catch (e) {
              console.error("Error parsing stream data:", e);
              // Continue processing other chunks even if one fails
            }
          }
        }
      }
    } catch (error) {
      console.error("Error reading stream:", error);
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    console.log("Message received:", content);
    if (content.trim() === "") return;
    
    // Add user message
    const userMessage: Message = {
      id: generateMessageId(),
      content,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    console.log("User message added:", userMessage);
    
    // Show typing indicator
    setIsTyping(true);
    console.log("Luma is typing...");
    
    try {
      // Prepare messages array for the API
      const apiMessages = messages
        .concat(userMessage)
        .map(msg => ({ role: msg.role, content: msg.content }));
      
      // Call the streaming API
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Process the streaming response
      await processStreamedResponse(response);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Show an error message
      const errorMessage: Message = {
        id: generateMessageId(),
        content: "I'm sorry, I'm having trouble connecting. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setIsTyping(false);
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] pt-16 bg-gradient-to-b from-white to-purple-50/30">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <WelcomeMessage 
              onSelectSuggestion={(suggestion: string) => handleSendMessage(suggestion)} 
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  role={message.role}
                  timestamp={message.timestamp}
                />
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 pt-1">
                    <Logo size="sm" />
                  </div>
                  <div className="bg-gradient-to-r from-[#FCE6DF] to-[#FFFAF9] rounded-2xl rounded-tl-sm border border-[#E9BBAE]/30 shadow-md p-3">
                    {currentStreamingMessage ? (
                      <div>{currentStreamingMessage}</div>
                    ) : (
                      <TypingIndicator />
                    )}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </motion.div>
          )}
        </div>
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
}