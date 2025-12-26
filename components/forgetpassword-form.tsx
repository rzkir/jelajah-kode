"use client";

import { Code } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { API_ENDPOINTS, apiCall } from "@/lib/config";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

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

      // Redirect to change-password page with email parameter
      setTimeout(() => {
        router.push(`/change-password?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send reset code. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
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
            <h1 className="text-xl font-bold">Forget your password?</h1>
            <FieldDescription>
              Enter your email and we&apos;ll send you a code to reset your
              password
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Code"}
            </Button>
          </Field>
          <FieldDescription className="text-center">
            Remember your password?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
