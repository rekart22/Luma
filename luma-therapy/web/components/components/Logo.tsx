"use client";

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  // Animation variants for gentle pulsing
  const glowVariants = {
    initial: { opacity: 0.8, scale: 0.98 },
    animate: { 
      opacity: [0.8, 1, 0.8], 
      scale: [0.98, 1, 0.98]
    }
  };

  return (
    <motion.div 
      className={`relative ${sizes[size]} flex items-center justify-center`}
      initial="initial"
      animate="animate"
      transition={{ 
        repeat: Infinity, 
        duration: 6,
        ease: 'easeInOut'
      }}
    >
      {/* Simple peach circle as shown in the image */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-[#E9BBAE] shadow-md"
        variants={glowVariants}
        transition={{ 
          repeat: Infinity, 
          duration: 4,
          ease: 'easeInOut'
        }}
      />
      
      {/* Subtle highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-30 rounded-full" />
    </motion.div>
  );
}