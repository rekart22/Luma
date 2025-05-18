"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import { Label } from "@/components/components/ui/label";
import { Checkbox } from "@/components/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/components/ui/card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FiMail } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { AlertCircle, Lock, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/components/ui/tabs";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [authTab, setAuthTab] = useState("magic-link");

  // Check for auth errors in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Extract error message from URL hash
      const hash = window.location.hash;
      if (hash.includes("error=")) {
        const errorParams = new URLSearchParams(hash.substring(1));
        const errorType = errorParams.get("error");
        const errorDescription = errorParams.get("error_description")?.replace(/\+/g, " ");
        
        if (errorDescription) {
          setAuthError(errorDescription);
          
          // Show appropriate toast based on error type
          if (errorType === "no_code") {
            toast.error("Authentication link is missing required information. Please try signing in again.");
          } else if (errorType === "otp_expired") {
            toast.error("The magic link has expired. Please request a new one.");
          } else {
            toast.error(errorDescription);
          }
          
          // Clean the URL by removing the hash
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    }
  }, []);

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
    console.log("Attempting to sign in with email:", email);

    try {
      console.log("Calling Supabase signInWithOtp...");
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `http://localhost:3004/auth/magic`,
          ...getExpiryOptions()
        }
      });

      if (error) {
        console.error("Supabase auth error:", error);
        throw error;
      }

      console.log("Sign in with OTP successful, toast notification should appear");
      toast.success("Check your email for the login link!");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email/password
  const handleSignInWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Successfully signed in!");
      setTimeout(() => {
        // Redirect to dashboard
        router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Invalid email or password");
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
          redirectTo: `http://localhost:3004/auth/callback`,
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
          redirectTo: `http://localhost:3004/auth/callback`,
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
          {authError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600">
              <div className="flex items-start mb-2">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <div className="font-semibold">{authError}</div>
              </div>
              <div className="pl-6">
                <p className="mt-1">Please try the following:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Enter your email below and request a new magic link</li>
                  <li>Make sure to use the link within 60 minutes</li>
                  <li>Check your spam folder if you don't see the email</li>
                </ul>
              </div>
            </div>
          )}
          
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
          
          <Tabs defaultValue="magic-link" value={authTab} onValueChange={setAuthTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="magic-link">
              <form onSubmit={handleSignInWithEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-magic">Email</Label>
                  <Input
                    id="email-magic"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-magic"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                  />
                  <Label htmlFor="remember-magic" className="text-sm">
                    Remember me for 30 days
                  </Label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-dotted border-current" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiMail className="h-5 w-5" />
                      <span>Sign in with Email</span>
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="password">
              <form onSubmit={handleSignInWithPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-password">Email</Label>
                  <Input
                    id="email-password"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-password"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                  />
                  <Label htmlFor="remember-password" className="text-sm">
                    Remember me for 30 days
                  </Label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-dotted border-current" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      <span>Sign in with Password</span>
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-xs text-muted-foreground">
          <p>Protected by Supabase Auth.</p>
        </CardFooter>
      </Card>
    </div>
  );
} 