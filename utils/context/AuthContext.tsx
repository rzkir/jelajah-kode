"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { Accounts, AuthContextType, UserRole } from "@/types/auth";

import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession,
} from "next-auth/react";

import { API_ENDPOINTS, apiCall } from "@/lib/config";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<Accounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Update local state based on NextAuth session
    if (status === "loading") {
      setLoading(true);
      return;
    }

    setLoading(false);

    // Only set user if session exists AND has a valid email AND user id
    if (
      status === "authenticated" &&
      session?.user &&
      session.user.email &&
      session.user.id
    ) {
      // Map NextAuth session user to our Accounts type
      const account: Accounts = {
        _id: session.user.id,
        email: session.user.email,
        name: session.user.name || "",
        role: ((session.user.role as string) || "user") as UserRole,
        picture: session.user.image || undefined,
        status: "active",
        isVerified: "true",
        provider: ((session.user.provider as string) || "email") as
          | "email"
          | "github"
          | "google",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUser(account);
      setUserRole(account.role);
      localStorage.setItem("user", JSON.stringify(account));
    } else if (status === "unauthenticated") {
      // Explicitly clear user data when not authenticated
      setUser(null);
      setUserRole(null);
      localStorage.removeItem("user");
    }
  }, [session, status]);

  // Update the signIn function to use NextAuth for email/password
  const signIn = async (email: string, password: string) => {
    // For email/password sign in, we still use the existing API route
    // since NextAuth handles OAuth only
    try {
      const result = await apiCall<{
        user: {
          _id: string;
          email: string;
          name: string;
          role: UserRole;
          status: "active" | "inactive";
          picture?: string;
          isVerified: boolean;
          created_at: string;
          updated_at: string;
        };
      }>(API_ENDPOINTS.auth.signIn, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (result.error || !result.data) {
        throw new Error(result.error || "Failed to sign in");
      }

      const { user: userData } = result.data;

      // Create user session from account data
      const account: Accounts = {
        _id: userData._id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
        picture: userData.picture,
        isVerified: userData.isVerified ? "true" : "false",
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      };

      setUser(account);
      setUserRole(account.role);
      localStorage.setItem("user", JSON.stringify(account));

      // Show success message and navigate based on role
      if (account.role === "admins") {
        toast.success("Welcome back, Admin!", {
          duration: 2000,
        });
        router.push("/dashboard");
      } else {
        toast.success("Welcome back!", {
          duration: 2000,
        });
        router.push("/");
      }

      return account;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return;
    }
  };

  const signOut = async () => {
    try {
      await nextAuthSignOut({ callbackUrl: "/signin" });

      // Clear local state
      setUser(null);
      setUserRole(null);
      localStorage.removeItem("user");

      toast.success("Logged out successfully!", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await apiCall(API_ENDPOINTS.auth.resetPassword, {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("OTP has been sent to your email!", {
        duration: 3000,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      // Rethrow so callers (e.g., ForgetPassword) can stop navigation and show inline error
      throw new Error(errorMessage);
    }
  };

  const forgetPassword = async (email: string) => {
    try {
      const result = await apiCall(API_ENDPOINTS.auth.forgetPassword, {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Password reset code sent to your email!", {
        duration: 3000,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      if (!user?._id) {
        toast.error("User not authenticated");
        return false;
      }

      const result = await apiCall(API_ENDPOINTS.auth.changePassword, {
        method: "PUT",
        body: JSON.stringify({
          userId: user._id,
          newPassword,
        }),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Password updated successfully!");
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return false;
    }
  };

  const verifyOtp = async (token: string) => {
    try {
      const result = await apiCall(API_ENDPOINTS.auth.verification, {
        method: "POST",
        body: JSON.stringify({ token }),
      });

      if (result.error) {
        throw new Error(result.error);
      }
      setResetToken(token);
      toast.success("OTP verified. Redirecting...");
      router.push("/reset-password");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
      throw new Error(message);
    }
  };

  const finalizeResetPassword = async (newPassword: string) => {
    try {
      if (!resetToken) {
        throw new Error("Missing token. Please verify OTP again.");
      }

      const result = await apiCall(API_ENDPOINTS.auth.verification, {
        method: "POST",
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      if (result.error) {
        throw new Error(result.error);
      }
      toast.success("Password reset successful. Redirecting...");
      setResetToken(null);
      router.push("/signin");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
      throw new Error(message);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    // For email/password signup, we still use the existing API route
    try {
      const result = await apiCall<{ userId: string }>(
        API_ENDPOINTS.auth.signUp,
        {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      if (result.error || !result.data) {
        throw new Error(result.error || "Failed to sign up");
      }

      const { userId } = result.data;

      // The API returns userId after successful signup, but we need to fetch user details
      // For now, we'll create a minimal account object and the user will be fully populated after verification
      const account: Accounts = {
        _id: userId,
        email: email,
        name: name,
        role: "user", // Default role
        status: "active", // Default status
        picture: undefined,
        isVerified: "false", // Will be verified later
        provider: "email", // Email/password signup
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(account);
      setUserRole(account.role);
      localStorage.setItem("user", JSON.stringify(account));

      // Show success message and redirect to verification page
      toast.success("Account created successfully! Please verify your email.", {
        duration: 2000,
      });
      router.push("/verification");

      return account;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return;
    }
  };

  const signInWithGitHub = async (): Promise<void> => {
    await nextAuthSignIn("github", { callbackUrl: "/" });
  };

  const signInWithGoogle = async (): Promise<void> => {
    await nextAuthSignIn("google", { callbackUrl: "/" });
  };

  const signUpWithGitHub = async (): Promise<void> => {
    await nextAuthSignIn("github", { callbackUrl: "/" });
  };

  const signUpWithGoogle = async (): Promise<void> => {
    await nextAuthSignIn("google", { callbackUrl: "/" });
  };

  const value = {
    user,
    loading,
    userRole,
    signIn,
    signOut,
    signUp,
    signInWithGitHub,
    signInWithGoogle,
    signUpWithGitHub,
    signUpWithGoogle,
    resetPassword,
    forgetPassword,
    changePassword,
    resetToken,
    setResetToken,
    verifyOtp,
    finalizeResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
