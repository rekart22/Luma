"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/components/auth/AuthProvider";
import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import { Label } from "@/components/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SetupPassword() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!loading && !user) {
      toast.error("You need to be signed in to set up a password");
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Check password strength
    if (password) {
      const hasMinLength = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
      
      let score = 0;
      if (hasMinLength) score++;
      if (hasUppercase) score++;
      if (hasLowercase) score++;
      if (hasNumber) score++;
      if (hasSpecialChar) score++;

      setPasswordStrength({
        score,
        hasMinLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecialChar
      });
    } else {
      setPasswordStrength({
        score: 0,
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false
      });
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (passwordStrength.score < 3) {
      toast.error("Password is not strong enough");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update password in Supabase Auth
      const { error: passwordError } = await supabase.auth.updateUser({
        password: password
      });
      
      if (passwordError) {
        throw passwordError;
      }
      
      // Also update the user_profiles table to mark password as set up
      // The trigger should handle this automatically, but we'll do it explicitly as well
      if (user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({ 
            id: user.id,
            has_password_setup: true,
            updated_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.error("Error updating user profile:", profileError);
          // Don't throw here, as the password is already set
        }
      }
      
      toast.success("Password successfully set!");
      
      // Redirect to dashboard after successful password setup
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
      
    } catch (error: any) {
      toast.error(error.message || "Failed to set password");
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    const { score } = passwordStrength;
    if (score < 2) return "bg-red-500";
    if (score < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Set Up Your Password</CardTitle>
          <CardDescription>
            Create a strong password to secure your Luma account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              
              {/* Password strength meter */}
              {password && (
                <div className="mt-2 space-y-2">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getStrengthColor()} transition-all duration-300`} 
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      {passwordStrength.hasMinLength ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span>At least 8 characters</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {passwordStrength.hasUppercase ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span>Uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {passwordStrength.hasLowercase ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span>Lowercase letter</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {passwordStrength.hasNumber ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span>Number</span>
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      {passwordStrength.hasSpecialChar ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                      )}
                      <span>Special character (!@#$%...)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pr-10"
                />
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-500 mt-1">Passwords don't match</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading || password !== confirmPassword || passwordStrength.score < 3}
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-dotted border-current" />
                  <span>Setting up...</span>
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  <span>Set Password & Continue</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center justify-center text-xs text-muted-foreground">
          <p>Set a strong password to protect your account.</p>
        </CardFooter>
      </Card>
    </div>
  );
} 