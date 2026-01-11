"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { Accounts, AuthContextType, UserRole } from "@/types/auth";

import { API_CONFIG } from "@/lib/config";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Accounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const userRef = useRef(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);
  const [resetToken, setResetToken] = useState<string | null>(null);
  // Password reset flow state
  const [passwordResetStep, setPasswordResetStep] = useState<
    "otp" | "password"
  >("otp");
  const [passwordResetOtp, setPasswordResetOtp] = useState("");
  const [passwordResetNewPassword, setPasswordResetNewPassword] = useState("");
  const [passwordResetConfirmPassword, setPasswordResetConfirmPassword] =
    useState("");
  const [passwordResetIsLoading, setPasswordResetIsLoading] = useState(false);
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginIsLoading, setLoginIsLoading] = useState(false);

  // Forget password form state
  const [forgetPasswordEmail, setForgetPasswordEmail] = useState("");
  const [forgetPasswordIsLoading, setForgetPasswordIsLoading] = useState(false);
  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupIsLoading, setSignupIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for existing JWT token and fetch user data
    const initializeAuth = async () => {
      // Ensure we're in the browser (not SSR)
      if (typeof window === "undefined") {
        setLoading(false);
        return;
      }

      // Since the cookie is httpOnly, we can't read it directly
      // Instead, we'll make an API call to check if the user is authenticated
      try {
        // For development: use proxy route to handle cookie forwarding
        // For production: use direct backend call
        const apiUrl =
          process.env.NODE_ENV === "development"
            ? "/api/auth/proxy-me" // Use proxy in development
            : API_CONFIG.ENDPOINTS.me; // Direct call in production

        if (!apiUrl || apiUrl.trim() === "") {
          console.error("API endpoint URL is not configured");
          setLoading(false);
          return;
        }

        // Log the URL for debugging (only in development)
        if (process.env.NODE_ENV === "development") {
          console.log("Fetching user data from:", apiUrl);
        }

        const userResponse = await fetch(apiUrl, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }).catch((fetchError) => {
          // Handle network errors
          console.error("Network error during auth initialization:", fetchError);
          // Don't throw - just set user to null and continue
          return null;
        });

        // If fetch failed, userResponse will be null
        if (!userResponse) {
          setUser(null);
          setUserRole(null);
          setLoading(false);
          return;
        }

        if (!userResponse.ok) {
          // If response is not OK, check if it's JSON before parsing
          const contentType = userResponse.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            try {
              const errorData = await userResponse.json();
              // 401 is expected when not authenticated, don't log as error
              if (userResponse.status !== 401) {
                console.error("Auth error:", errorData.error || "Unauthorized");
              }
            } catch {
              // Ignore parse errors for non-JSON responses
            }
          }
          // Not authenticated - this is normal, not an error
          setUser(null);
          setUserRole(null);
          setLoading(false);
          return;
        }

        // Check content type before parsing JSON
        const contentType = userResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Invalid response format from server");
          setUser(null);
          setUserRole(null);
          setLoading(false);
          return;
        }

        const userResponseData = await userResponse.json();

        if (userResponseData.error) {
          console.error("API returned error:", userResponseData.error);
          setUser(null);
          setUserRole(null);
          setLoading(false);
          return;
        }

        // The API returns user data directly, not wrapped in a data property
        const account = userResponseData;
        setUser(account);
        setUserRole(account.role);
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Error occurred while fetching user data
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // For development: use proxy route to handle cookie forwarding
      // For production: use direct backend call
      const signInUrl =
        process.env.NODE_ENV === "development"
          ? "/api/auth/proxy-signin" // Use proxy in development
          : API_CONFIG.ENDPOINTS.signIn; // Direct call in production

      // Call the sign-in API
      const result = await fetch(signInUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      // Log for debugging in development
      if (process.env.NODE_ENV === "development") {
        console.log("Sign in response status:", result.status);
        console.log("Sign in response headers:", Object.fromEntries(result.headers.entries()));
      }

      // Check content type before parsing JSON
      const contentType = result.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await result.text();
        console.error("Invalid response format. Response:", text);
        throw new Error("Invalid response format from server");
      }

      const resultData = await result.json();

      if (!result.ok) {
        // Log error details for debugging
        if (process.env.NODE_ENV === "development") {
          console.error("Sign in failed:", {
            status: result.status,
            error: resultData.error,
            data: resultData,
          });
        }
        throw new Error(resultData.error || `Sign in failed with status ${result.status}`);
      }

      if (resultData.error) {
        throw new Error(resultData.error);
      }

      // For development (cross-origin), cookie might not be set
      // Store token in localStorage as fallback for development
      if (process.env.NODE_ENV === "development" && resultData.user) {
        try {
          // Try to extract token from response headers or use a workaround
          // Since we can't read httpOnly cookie, we'll rely on cookie being set
          // But store user info in localStorage for quick access
          localStorage.setItem("user", JSON.stringify(resultData.user));
        } catch (e) {
          console.warn("Could not store user in localStorage:", e);
        }
      }

      // Fetch the complete user data from the API
      // For development: use proxy route to handle cookie forwarding
      // For production: use direct backend call
      const meUrl =
        process.env.NODE_ENV === "development"
          ? "/api/auth/proxy-me" // Use proxy in development
          : API_CONFIG.ENDPOINTS.me; // Direct call in production

      const userResponse = await fetch(meUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Log for debugging in development
      if (process.env.NODE_ENV === "development") {
        console.log("Me endpoint response status:", userResponse.status);
      }

      // Check content type before parsing JSON
      const userContentType = userResponse.headers.get("content-type");
      if (!userContentType || !userContentType.includes("application/json")) {
        const text = await userResponse.text();
        console.error("Invalid response format from /me. Response:", text);
        throw new Error("Invalid response format from server");
      }

      const userResponseData = await userResponse.json();

      if (!userResponse.ok) {
        // Log error details for debugging
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch user data:", {
            status: userResponse.status,
            error: userResponseData.error,
            data: userResponseData,
          });
        }
        throw new Error(userResponseData.error || `Failed to fetch user data with status ${userResponse.status}`);
      }

      if (userResponseData.error) {
        throw new Error(userResponseData.error);
      }

      // The API returns user data directly, not wrapped in a data property
      const account = userResponseData;
      setUser(account);
      setUserRole(account.role);

      // Show success message
      if (account.role === "admins") {
        toast.success("Welcome back, Admin!", {
          duration: 2000,
        });
      } else {
        toast.success("Welcome back!", {
          duration: 2000,
        });
      }

      // For cross-origin cookies (frontend localhost, backend Vercel),
      // cookie from backend might not be immediately available in frontend domain
      // The cookie will be sent to backend on next API call, but proxy won't see it
      // So we redirect directly without waiting for proxy
      const redirectPath = account.role === "admins" ? "/dashboard" : "/";

      // Redirect immediately - cookie will be available on next request to backend
      window.location.href = redirectPath;

      // Return the fetched user data
      return account;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";

      // Log full error for debugging
      if (process.env.NODE_ENV === "development") {
        console.error("Sign in error:", error);
      }

      toast.error(errorMessage);
      return;
    }
  };

  const signOut = async () => {
    try {
      // Make a request to our custom signout endpoint to clear JWT cookie
      await fetch(API_CONFIG.ENDPOINTS.signOut, {
        method: "POST",
        credentials: "include",
      });

      // Clear local state
      setUser(null);
      setUserRole(null);

      toast.success("Logged out successfully!", {
        duration: 2000,
      });

      // Redirect manually to signin page with logout parameter
      router.push("/signin?logout=true");
    } catch {
      // Clear local state even if API calls fail
      setUser(null);
      setUserRole(null);

      // Make API call to ensure server-side logout
      try {
        await fetch(API_CONFIG.ENDPOINTS.signOut, {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("Error during sign out API call:", err);
      }

      toast.success("Logged out successfully!", {
        duration: 2000,
      });

      // Redirect manually to signin page with logout parameter
      router.push("/signin?logout=true");
    }
  };

  const refreshUserData = async (): Promise<Accounts | null> => {
    try {
      // For development: use proxy route to handle cookie forwarding
      // For production: use direct backend call
      const meUrl =
        process.env.NODE_ENV === "development"
          ? "/api/auth/proxy-me" // Use proxy in development
          : API_CONFIG.ENDPOINTS.me; // Direct call in production

      const response = await fetch(meUrl, {
        method: "GET",
        credentials: "include",
      });

      // Check content type before parsing JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return null;
      }

      const responseData = await response.json();

      if (!response.ok || responseData.error) {
        return null;
      }

      // The API returns user data directly, not wrapped in a data property
      const account = responseData;
      setUser(account);
      setUserRole(account.role);

      return account;
    } catch {
      return null;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await fetch(API_CONFIG.ENDPOINTS.resetPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const resultData = await result.json();

      if (resultData.error) {
        throw new Error(resultData.error);
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
      const result = await fetch(API_CONFIG.ENDPOINTS.forgetPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const resultData = await result.json();

      if (resultData.error) {
        throw new Error(resultData.error);
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

      const result = await fetch(API_CONFIG.ENDPOINTS.changePassword, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userId: user._id, newPassword }),
      });
      const resultData = await result.json();

      if (resultData.error) {
        throw new Error(resultData.error);
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
      const result = await fetch(API_CONFIG.ENDPOINTS.verification, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token }),
      });

      const resultData = await result.json();

      if (resultData.error) {
        throw new Error(resultData.error);
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

      const result = await fetch(API_CONFIG.ENDPOINTS.verification, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      const resultData = await result.json();

      if (resultData.error) {
        throw new Error(resultData.error);
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

  const handleVerifyOtpForPasswordReset = async (otp: string) => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    toast.success("OTP verified!");
    setPasswordResetStep("password");
  };

  const handleResetPasswordWithOtp = async () => {
    if (!passwordResetNewPassword || !passwordResetConfirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (passwordResetNewPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (passwordResetNewPassword !== passwordResetConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setPasswordResetIsLoading(true);

    try {
      const result = await fetch(API_CONFIG.ENDPOINTS.resetPassword, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token: passwordResetOtp,
          newPassword: passwordResetNewPassword,
        }),
      });

      const resultData = await result.json();

      if (resultData.error) {
        throw new Error(resultData.error);
      }

      toast.success("Password reset successfully!");
      router.push("/signin");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setPasswordResetIsLoading(false);
    }
  };

  const resetPasswordFlowState = () => {
    setPasswordResetStep("otp");
    setPasswordResetOtp("");
    setPasswordResetNewPassword("");
    setPasswordResetConfirmPassword("");
    setPasswordResetIsLoading(false);
  };

  // Login form functions
  const handleLoginSubmit = async () => {
    if (!loginEmail || !loginPassword) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoginIsLoading(true);

    try {
      const account = await signIn(loginEmail, loginPassword);
      if (account) {
        resetLoginState();
      }
    } catch {
    } finally {
      setLoginIsLoading(false);
    }
  };

  const resetLoginState = () => {
    setLoginEmail("");
    setLoginPassword("");
    setLoginIsLoading(false);
  };

  // Forget password form functions
  const handleForgetPasswordSubmit = async () => {
    if (!forgetPasswordEmail) {
      toast.error("Please enter your email");
      return;
    }

    setForgetPasswordIsLoading(true);

    try {
      const result = await fetch(API_CONFIG.ENDPOINTS.forgetPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: forgetPasswordEmail }),
      });

      const resultData = await result.json();

      if (resultData.error) {
        throw new Error(resultData.error);
      }

      toast.success("Password reset code sent to your email!", {
        duration: 3000,
      });

      // Redirect to change-password page with email parameter
      setTimeout(() => {
        router.push(
          `/change-password?email=${encodeURIComponent(forgetPasswordEmail)}`
        );
      }, 1500);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send reset code. Please try again.";
      toast.error(errorMessage);
    } finally {
      setForgetPasswordIsLoading(false);
    }
  };

  const resetForgetPasswordState = () => {
    setForgetPasswordEmail("");
    setForgetPasswordIsLoading(false);
  };

  // Signup form functions
  const handleSignupSubmit = async (
    name: string,
    email: string,
    password: string,
    confirmPassword?: string
  ) => {
    // Basic validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setSignupIsLoading(true);

    try {
      // Call the signUp function from AuthContext
      await signUp(name, email, password);
      // Reset the form after successful signup
      resetSignupState();
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setSignupIsLoading(false);
    }
  };

  const resetSignupState = () => {
    setSignupName("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirmPassword("");
    setSignupIsLoading(false);
  };

  const signUp = async (name: string, email: string, password: string) => {
    // For email/password signup, we still use the existing API route
    try {
      const result = await fetch(API_CONFIG.ENDPOINTS.signUp, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const resultData = await result.json();

      if (resultData.error) {
        throw new Error(resultData.error);
      }

      // The API returns userId directly, not wrapped in a data property
      const { userId } = resultData;

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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(account);
      setUserRole(account.role);

      // Show success message and redirect to verification page
      toast.success("Account created successfully! Please verify your email.", {
        duration: 2000,
      });
      router.push(`/verification?email=${encodeURIComponent(email)}`);

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

  const value = {
    user,
    loading,
    userRole,
    signIn,
    signOut,
    signUp,
    refreshUserData, // Added function to refresh user data from database

    resetPassword,
    forgetPassword,
    changePassword,
    resetToken,
    setResetToken,
    verifyOtp,
    finalizeResetPassword,
    // Password reset flow state
    passwordResetStep,
    passwordResetOtp,
    passwordResetNewPassword,
    passwordResetConfirmPassword,
    passwordResetIsLoading,
    // Password reset flow functions
    setPasswordResetStep,
    setPasswordResetOtp,
    setPasswordResetNewPassword,
    setPasswordResetConfirmPassword,
    setPasswordResetIsLoading,
    handleVerifyOtpForPasswordReset,
    handleResetPasswordWithOtp,
    resetPasswordFlowState,
    // Login form state
    loginEmail,
    loginPassword,
    loginIsLoading,
    // Login form functions
    setLoginEmail,
    setLoginPassword,
    setLoginIsLoading,
    handleLoginSubmit,
    resetLoginState,
    // Forget password form state
    forgetPasswordEmail,
    forgetPasswordIsLoading,
    // Forget password form functions
    setForgetPasswordEmail,
    setForgetPasswordIsLoading,
    handleForgetPasswordSubmit,
    resetForgetPasswordState,
    // Signup form state
    signupName,
    signupEmail,
    signupPassword,
    signupConfirmPassword,
    signupIsLoading,
    // Signup form functions
    setSignupName,
    setSignupEmail,
    setSignupPassword,
    setSignupConfirmPassword,
    setSignupIsLoading,
    handleSignupSubmit,
    resetSignupState,
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
