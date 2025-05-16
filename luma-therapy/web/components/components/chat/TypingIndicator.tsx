"use client";

import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1.5 p-1">
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="h-2 w-2 rounded-full bg-luma-primary/60"
          animate={{ 
            scale: [0.5, 1, 0.5], 
            opacity: [0.3, 0.8, 0.3] 
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: dot * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
      <span className="sr-only">Luma is typing</span>
    </div>
  );
}
