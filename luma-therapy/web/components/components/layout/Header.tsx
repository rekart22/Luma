"use client";

import Logo from "../Logo";
import { Avatar } from "../ui/avatar";
import { Settings, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-purple-100 z-20 shadow-sm">
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Logo size="sm" />
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#E9BBAE] to-[#CFA18D]">Luma</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button className="p-2 text-gray-500 hover:text-purple-600 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500"></span>
          </button>
          
          <button className="p-2 text-gray-500 hover:text-purple-600 transition-colors">
            <Settings size={20} />
          </button>
          
          <Avatar className="h-8 w-8 border-2 border-[#D6EDEA]/50 ml-2">
            <div className="w-full h-full bg-[#D6EDEA]" />
          </Avatar>
        </motion.div>
      </div>
    </header>
  );
}