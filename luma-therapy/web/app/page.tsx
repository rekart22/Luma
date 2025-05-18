"use client";

import Link from "next/link";
import { Button } from "@/components/components/ui/button";
import { useAuth } from "@/components/components/auth/AuthProvider";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 mt-16">
        <div className="w-full max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E9BBAE] to-[#CFA18D]">Luma Therapy</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
              Your personal AI-powered therapeutic companion. A safe space for reflection, 
              emotional support, and personal growth.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            {!loading && !user ? (
              <Button asChild className="px-8 py-3 text-base font-medium bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                <Link href="/auth/signin">
                  Sign In
                </Link>
              </Button>
            ) : user ? (
              <Button asChild className="px-8 py-3 text-base font-medium bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <div className="h-10 w-28 bg-gray-200 animate-pulse rounded-md"></div>
            )}
            <Button asChild variant="outline" className="px-8 py-3 text-base font-medium">
              <Link href="#about">
                Learn More
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 rounded-lg bg-purple-50 p-8" id="about">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Why Luma?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Safe & Confidential</h3>
                <p className="text-gray-600">Your conversations are private and protected.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Evidence-Based</h3>
                <p className="text-gray-600">Techniques grounded in therapeutic best practices.</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Available 24/7</h3>
                <p className="text-gray-600">Support whenever you need it, no waiting.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
