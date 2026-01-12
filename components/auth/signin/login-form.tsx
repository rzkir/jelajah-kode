"use client";

import * as React from "react";

import { Code, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { PasswordInput } from "@/components/ui/password-input";

import Link from "next/link";

import { useAuth } from "@/utils/context/AuthContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    loginEmail,
    loginPassword,
    loginIsLoading,
    loginRateLimitResetTime,
    loginIsRateLimited,
    setLoginEmail,
    setLoginPassword,
    handleLoginSubmit,
  } = useAuth();

  // Timer countdown state
  const [timeLeft, setTimeLeft] = React.useState<number>(0);

  // Calculate time left from rate limit reset time
  React.useEffect(() => {
    if (!loginRateLimitResetTime || !loginIsRateLimited) {
      setTimeLeft(0);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const reset = loginRateLimitResetTime;
      return Math.max(0, Math.ceil((reset.getTime() - now.getTime()) / 1000));
    };

    // Update immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [loginRateLimitResetTime, loginIsRateLimited]);

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return "0 detik";

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins > 0 && secs > 0) {
      return `${mins} menit ${secs} detik`;
    } else if (mins > 0) {
      return `${mins} menit`;
    }
    return `${secs} detik`;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginEmail(e.target.value);
    // Reset email validation when email changes
    // Email will be checked only when submit button is clicked
  };

  const handleButtonClick = async () => {
    if (loginIsLoading) {
      return;
    }

    try {
      await handleLoginSubmit();
    } catch (error) {
      // Error is already handled in the auth context
      console.error("Form submission error:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loginIsLoading && !loginIsRateLimited) {
      e.preventDefault();
      e.stopPropagation();
      handleButtonClick();
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div
        onKeyDown={(e) => {
          // Prevent form submission on Enter key
          if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Code className="size-6" />
              </div>
              <span className="sr-only">Jelajah Kode 👾.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Jelajah Kode 👾.</h1>
            <FieldDescription>
              Don&apos;t have an account?{" "}
              <Link href="/signup" rel="noopener noreferrer">
                Sign up
              </Link>
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={loginEmail}
              onChange={handleEmailChange}
              onKeyDown={handleKeyDown}
              required
              autoFocus
            />
          </Field>
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Link
                href="/forget-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              required
            />
          </Field>
          <Field>
            <Button
              type="button"
              onClick={handleButtonClick}
              disabled={
                loginIsLoading ||
                !loginEmail ||
                !loginPassword ||
                loginIsRateLimited
              }
            >
              {loginIsLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {loginIsLoading ? "Signing in..." : "Sign in"}
            </Button>
            {loginIsRateLimited && timeLeft > 0 && (
              <FieldDescription className="mt-2 text-center text-sm text-muted-foreground">
                Terlalu banyak percobaan login. Silakan coba lagi dalam{" "}
                <span className="font-semibold">{formatTime(timeLeft)}</span>.
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </div>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
