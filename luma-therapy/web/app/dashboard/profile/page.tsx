"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import { Label } from "@/components/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/components/ui/tabs";
import { Avatar } from "@/components/components/ui/avatar";
import { toast } from "sonner";
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  Mail, 
  AlertCircle, 
  CheckCircle2,
  Save
} from "lucide-react";
import { logger, generateTraceId } from "@/lib/utils";

/**
 * SECURITY RECOMMENDATION:
 * Password changes should always verify the current password before allowing updates.
 * We've implemented two options:
 * 1. Verify password using 'verify_user_password' RPC function then update
 * 2. Use 'change_user_password' RPC function that handles both verification and update in one transaction (preferred for production)
 * 
 * NEVER call supabase.auth.updateUser({ password }) directly without verification!
 */
export default function ProfileSettings() {
  const { user, loading } = useAuth();
  
  // Personal info state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Password state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Get user data on load
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setFullName(user.user_metadata?.full_name || "");
      
      // Check if user has password setup
      const checkPasswordSetup = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('has_password_setup')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error("Error checking password status:", error);
            return;
          }
          
          setHasPassword(data?.has_password_setup || false);
        } catch (error) {
          console.error("Unexpected error:", error);
        }
      };
      
      checkPasswordSetup();
    }
  }, [user]);

  // Check password strength
  useEffect(() => {
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

  const handlePersonalInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      if (error) throw error;
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const traceId = generateTraceId();
    logger.info(hasPassword ? "Password change attempt" : "Password setup attempt", { traceId, user: user?.id });
    console.log("[TEST] Password change/setup attempt", { traceId, user: user?.id });
    // Validate password
    if (password !== confirmPassword) {
      logger.warn("Password change/setup failed: passwords do not match", { traceId, user: user?.id });
      toast.error("Passwords don't match");
      return;
    }
    if (passwordStrength.score < 3) {
      logger.warn("Password change/setup failed: password not strong enough", { traceId, user: user?.id });
      toast.error("Password is not strong enough");
      return;
    }
    setIsChangingPassword(true);
    try {
      if (!hasPassword) {
        const { error } = await supabase.auth.updateUser({ password: password });
        if (error) {
          logger.error("Password setup failed: Supabase error", { traceId, user: user?.id, error: error.message });
          throw error;
        }
      } else {
        if (!currentPassword) {
          logger.warn("Password change failed: current password missing", { traceId, user: user?.id });
          toast.error("Current password is required");
          setIsChangingPassword(false);
          return;
        }
        
        // First verify the current password using our secure function
        const { data: isPasswordValid, error: verifyError } = await supabase.rpc(
          'verify_user_password', 
          { password: currentPassword }
        );
        
        if (verifyError) {
          logger.error("Password verification failed", { traceId, user: user?.id, error: verifyError.message });
          throw new Error("Error verifying current password: " + verifyError.message);
        }
        
        if (!isPasswordValid) {
          logger.warn("Password change failed: incorrect current password", { traceId, user: user?.id });
          toast.error("Current password is incorrect");
          setIsChangingPassword(false);
          return;
        }
        
        // Now we can safely update the password
        const { error } = await supabase.auth.updateUser({ password: password });
        if (error) {
          logger.error("Password change failed: Supabase error", { traceId, user: user?.id, error: error.message });
          throw error;
        }
        
        /* 
        // Alternative implementation: Use the secure change_user_password function
        // This performs both verification and update in a single server-side transaction
        // Uncomment and use this in production for maximum security
        const { data, error: changeError } = await supabase.rpc(
          'change_user_password', 
          { 
            current_plain_password: currentPassword,
            new_plain_password: password
          }
        );
        
        if (changeError) {
          logger.error("Password change failed", { traceId, user: user?.id, error: changeError.message });
          throw new Error(changeError.message);
        }
        */
      }
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: user.id,
            has_password_setup: true,
            updated_at: new Date().toISOString()
          });
        if (profileError) {
          logger.warn("Password change/setup: user profile update error", { traceId, user: user?.id, error: profileError.message });
        }
      }
      logger.info(hasPassword ? "Password change successful" : "Password setup successful", { traceId, user: user?.id });
      console.log("[TEST] Password change/setup successful", { traceId, user: user?.id });
      setHasPassword(true);
      toast.success("Password successfully updated");
      setPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      // --- AUDIT LOG POST ---
      if (user?.id && traceId) {
        fetch("http://127.0.0.1:8000/auth/change-password-audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.id,
            event_type: hasPassword ? "password_change" : "password_setup",
            trace_id: traceId,
            meta: {
              timestamp: new Date().toISOString(),
              user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
            }
          })
        }).catch(err => {
          logger.warn("Failed to log password change event to audit log", { traceId, user: user.id, error: err?.message });
        });
      }
    } catch (error: any) {
      logger.error("Password change/setup failed: exception", { traceId, user: user?.id, error: error.message });
      console.log("[TEST] Password change/setup failed", { traceId, user: user?.id, error: error.message });
      toast.error("[TEST] Password change/setup failed (check console)");
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getStrengthColor = () => {
    const { score } = passwordStrength;
    if (score < 2) return "bg-red-500";
    if (score < 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl mt-16">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl mt-16">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-gray-600">Manage your account preferences and security.</p>
        
        <Tabs defaultValue="personal-info" className="w-full mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="personal-info" className="flex items-center gap-2">
              <User size={16} />
              <span>Personal Info</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock size={16} />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal-info">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePersonalInfoUpdate} className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-16 w-16 border-2 border-gray-200">
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-purple-100 flex items-center justify-center text-purple-800 font-semibold text-xl">
                          {(fullName || user?.email || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{fullName || user?.email?.split('@')[0]}</h3>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          disabled
                          className="bg-gray-50"
                        />
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-xs text-green-500">Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                    {isSaving ? (
                      <>
                        <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-dotted border-current" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>{hasPassword ? "Change Password" : "Set Up Password"}</CardTitle>
                <CardDescription>
                  {hasPassword 
                    ? "Update your password to maintain security" 
                    : "Create a password for your account in addition to magic link access"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  {hasPassword && (
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
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
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">{hasPassword ? "New Password" : "Password"}</Label>
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
                    disabled={isChangingPassword || password !== confirmPassword || passwordStrength.score < 3 || (hasPassword && !currentPassword)}
                  >
                    {isChangingPassword ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-dotted border-current" />
                        <span>{hasPassword ? "Updating..." : "Setting up..."}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        <span>{hasPassword ? "Update Password" : "Set Password"}</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-start justify-center text-xs text-muted-foreground">
                <p>Your account security is important to us. Using a strong password helps protect your account.</p>
                {!hasPassword && (
                  <p className="mt-2 text-purple-600">
                    Currently using magic link authentication only. Setting up a password gives you another way to log in.
                  </p>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 