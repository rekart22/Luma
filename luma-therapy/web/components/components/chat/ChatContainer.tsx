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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add an initial greeting from Luma when the first user message is sent
  useEffect(() => {
    // Only trigger when going from 0 to 1 message (first user message)
    if (messages.length === 1 && messages[0].role === 'user') {
      setIsTyping(true);
      console.log("Showing initial Luma greeting...");
      
      // Show Luma's greeting after a short delay
      setTimeout(() => {
        const initialGreeting: Message = {
          id: Date.now().toString(),
          content: "Hi there. I'm Luma, your therapeutic companion. It's good to connect with you. I'm here to listen, reflect, and support you through our conversations.",
          role: "assistant",
          timestamp: new Date(),
        };
        
        setIsTyping(false);
        setMessages((prev) => [...prev, initialGreeting]);
        console.log("Initial greeting added:", initialGreeting);
      }, 1500);
    }
  }, [messages]);

  const handleSendMessage = (content: string) => {
    console.log("Message received:", content);
    if (content.trim() === "") return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    console.log("User message added:", userMessage);
    
    // Simulate Luma typing
    setIsTyping(true);
    console.log("Luma is typing...");
    
    // Simulate response after a delay
    setTimeout(() => {
      let lumaResponse = "";
      
      // Determine appropriate response based on user message content
      const lowerContent = content.toLowerCase();
      
      if (lowerContent.includes("feeling down") || lowerContent.includes("sad")) {
        lumaResponse = "I'm sorry to hear you're feeling down. Would you like to talk about what's contributing to these feelings?"; 
      } else if (lowerContent.includes("burned out") || lowerContent.includes("exhausted")) {
        lumaResponse = "Burnout can be really challenging. Let's explore what's causing this feeling and what small steps might help you recharge."; 
      } else if (lowerContent.includes("advice")) {
        lumaResponse = "I'd be happy to explore this with you. Could you share a bit more about the situation you'd like advice on?"; 
      } else if (lowerContent.includes("anxious") || lowerContent.includes("calm down")) {
        lumaResponse = "Let's try a quick grounding exercise. Can you name five things you can see right now in your surroundings?"; 
      } else if (lowerContent.includes("mindfulness")) {
        lumaResponse = "Mindfulness is a wonderful practice. Would you like to try a brief guided breathing exercise to center yourself?"; 
      } else if (lowerContent.includes("celebrate") || lowerContent.includes("win")) {
        lumaResponse = "That's wonderful! I'd love to hear more about what you're celebrating. Acknowledging our victories, big or small, is so important."; 
      } else {
        // Default responses if no specific pattern is matched
        const lumaResponses = [
          "I understand how that feels. Would you like to explore that further?",
          "Thank you for sharing that with me. How long have you been feeling this way?",
          "That's interesting. Can you tell me more about what might have triggered these thoughts?",
          "I'm here to listen. Would it help to talk about specific situations where this comes up?",
          "I appreciate your openness. Sometimes naming our feelings is the first step to understanding them.",
        ];
        
        lumaResponse = lumaResponses[Math.floor(Math.random() * lumaResponses.length)];
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: lumaResponse,
        role: "assistant",
        timestamp: new Date(),
      };
      
      setIsTyping(false);
      setMessages((prev) => [...prev, assistantMessage]);
      console.log("Luma response added:", assistantMessage);
    }, 1500 + Math.random() * 1500); // Random delay between 1.5-3s for realism
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
                    <TypingIndicator />
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