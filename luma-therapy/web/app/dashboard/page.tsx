"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/components/ui/card';
import { Button } from '@/components/components/ui/button';
import { useAuth } from '@/components/components/auth/AuthProvider';
import { MessageSquare, Settings, Calendar, FileText } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    const timeout = setTimeout(() => {
      // In a real app, you would fetch actual session data from your database
      setSessions(Math.floor(Math.random() * 5) + 1); // Random number 1-5 for demo
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl mt-16">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Friend'}</h1>
        <p className="text-gray-600">Your therapeutic journey continues here.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your therapy journey</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-16 bg-gray-100 animate-pulse rounded"></div>
              ) : (
                <div className="text-3xl font-bold">{sessions}</div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/history">
                  <FileText className="mr-2 h-4 w-4" />
                  View History
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Start Therapy</CardTitle>
              <CardDescription>Begin a new session</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Luma is here to listen, support, and guide your journey toward well-being.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                <Link href="/chat-app">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Chatting
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Update your preferences and account settings.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Profile Settings
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle>Your Therapeutic Journey</CardTitle>
              <CardDescription>Track your progress over time</CardDescription>
            </CardHeader>
            <CardContent className="h-64 bg-gray-50 flex items-center justify-center">
              <p className="text-gray-400">Session history visualization will appear here</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 