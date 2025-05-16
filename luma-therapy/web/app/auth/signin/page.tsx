"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FiMail } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Determine session expiration based on "Remember me" selection
  const getExpiryOptions = () => {
    return {
      // 24 hours by default, 30 days if "Remember me" is checked
      expiresIn: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24
    };
  };

  // Sign in with email magic link
  const handleSignInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          ...getExpiryOptions()
        }
      });

      if (error) {
        throw error;
      }

      toast.success("Check your email for the login link!");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with GitHub
  const handleSignInWithGitHub = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          ...getExpiryOptions()
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign in");
      setIsLoading(false);
    }
  };

  // Sign in with Google
  const handleSignInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          ...getExpiryOptions()
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign in");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome to Luma</CardTitle>
          <CardDescription>
            Your AI therapy companion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleSignInWithGoogle}
              disabled={isLoading}
            >
              <FcGoogle className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleSignInWithGitHub}
              disabled={isLoading}
            >
              <GitHubLogoIcon className="h-5 w-5" />
              <span>Continue with GitHub</span>
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSignInWithEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked: boolean) => setRememberMe(checked)}
              />
              <Label htmlFor="remember" className="text-sm">
                Remember me for 30 days
              </Label>
            </div>
            
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading}
            >
              <FiMail className="h-5 w-5" />
              <span>Sign in with Email</span>
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-xs text-muted-foreground">
          <p>Protected by Supabase Auth.</p>
        </CardFooter>
      </Card>
    </div>
  );
} 