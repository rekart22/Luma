"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "../Logo";
import { Avatar } from "../ui/avatar";
import { Settings, Bell, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/components/ui/dropdown-menu";
import { Button } from "@/components/components/ui/button";
import { useAuth } from "../auth/AuthProvider";

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  console.log("Auth state:", { user, loading }); // Debug log for auth state

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

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
          {loading ? (
            // Loading state
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : user ? (
            // Authenticated user view
            <>
              <button className="p-2 text-gray-500 hover:text-purple-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500"></span>
              </button>
              
              <button className="p-2 text-gray-500 hover:text-purple-600 transition-colors">
                <Settings size={20} />
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 border-2 border-[#D6EDEA]/50 ml-2 cursor-pointer">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#D6EDEA] flex items-center justify-center text-purple-800 font-medium">
                        {(user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.user_metadata?.full_name || user.email || 'My Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Non-authenticated view
            <Button asChild variant="default" className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
        </motion.div>
      </div>
    </header>
  );
}