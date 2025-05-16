"use client";

import { motion } from 'framer-motion';
import Logo from '../Logo';
import { HeartPulse, Brain, Frown, Flame, Coffee, Star } from 'lucide-react';

interface WelcomeMessageProps {
  onSelectSuggestion?: (suggestion: string) => void;
}

interface EmotionalPrompt {
  icon: React.ReactNode;
  text: string;
  color: string;
}

export default function WelcomeMessage({ onSelectSuggestion }: WelcomeMessageProps) {
  const handleSuggestionClick = (suggestion: string) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
  };

  const emotionalPrompts: EmotionalPrompt[] = [
    {
      icon: <Frown className="h-5 w-5" />,
      text: "I'm feeling down today",
      color: "from-blue-500/20 to-blue-600/20 border-blue-300/30 text-blue-700"
    },
    {
      icon: <Flame className="h-5 w-5" />,
      text: "I feel burned out",
      color: "from-orange-500/20 to-red-500/20 border-orange-300/30 text-orange-700"
    },
    {
      icon: <Brain className="h-5 w-5" />,
      text: "I need advice about something",
      color: "from-violet-500/20 to-indigo-500/20 border-violet-300/30 text-violet-700"
    },
    {
      icon: <HeartPulse className="h-5 w-5" />,
      text: "I'm anxious and need to calm down",
      color: "from-pink-500/20 to-rose-500/20 border-pink-300/30 text-pink-700"
    },
    {
      icon: <Coffee className="h-5 w-5" />,
      text: "I want to practice mindfulness",
      color: "from-teal-500/20 to-green-500/20 border-teal-300/30 text-teal-700"
    },
    {
      icon: <Star className="h-5 w-5" />,
      text: "I want to celebrate a win",
      color: "from-amber-500/20 to-yellow-500/20 border-amber-300/30 text-amber-700"
    }
  ];

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-10 px-4 text-center mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="mb-5">
        <Logo size="lg" />
      </div>
      
      <h2 className="mt-6 text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#E9BBAE] to-[#CFA18D]">
        Welcome to Luma
      </h2>
      
      <p className="mt-3 text-gray-600 leading-relaxed max-w-md">
        I'm your therapeutic companion, here to provide a calm space for reflection and conversation.
      </p>
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {emotionalPrompts.map((prompt, i) => (
          <motion.button
            key={i}
            onClick={() => handleSuggestionClick(prompt.text)}
            className={`px-4 py-3.5 bg-gradient-to-r ${prompt.color} rounded-xl text-left text-sm 
                      hover:shadow-md transition-all flex items-center gap-2 border group relative overflow-hidden`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <span className="p-1.5 rounded-full bg-white/70 backdrop-blur-sm shadow-sm">
              {prompt.icon}
            </span>
            {prompt.text}
            <div className="absolute right-2 w-8 h-8 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}