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
    setLoginEmail,
    setLoginPassword,
    handleLoginSubmit,
  } = useAuth();

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
    if (e.key === "Enter" && !loginIsLoading) {
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
              disabled={loginIsLoading || !loginEmail || !loginPassword}
            >
              {loginIsLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {loginIsLoading ? "Signing in..." : "Sign in"}
            </Button>
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
