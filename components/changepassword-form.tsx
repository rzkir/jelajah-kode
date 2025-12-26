"use client";

import { Code } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";

type Step = "otp" | "password";

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState<Step>("otp");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    // Check if email parameter exists
    if (!email) {
      toast.error("Please request password reset from forget password page");
      router.push("/forget-password");
    }
  }, [email, router]);

  const handleVerifyOTP = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    toast.success("OTP verified!");
    setStep("password");
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiCall(API_ENDPOINTS.auth.resetPassword, {
        method: "PUT",
        body: JSON.stringify({ token: otp, newPassword }),
      });

      if (result.error) {
        throw new Error(result.error);
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
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {!email ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      ) : (
        <>
          {step === "otp" && (
            <form onSubmit={handleVerifyOTP}>
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
                  <h1 className="text-xl font-bold">Enter verification code</h1>
                  <FieldDescription>
                    We sent a 6-digit code to your email
                  </FieldDescription>
                </div>
                <Field>
                  <FieldLabel htmlFor="otp" className="sr-only">
                    Verification code
                  </FieldLabel>
                  <InputOTP
                    maxLength={6}
                    id="otp"
                    required
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    containerClassName="gap-4"
                  >
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <FieldDescription className="text-center">
                    Didn&apos;t receive the code?{" "}
                    <Link
                      href="/forget-password"
                      className="text-blue-600 hover:underline"
                    >
                      Resend
                    </Link>
                  </FieldDescription>
                </Field>
                <Field>
                  <Button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handleResetPassword}>
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
                  <h1 className="text-xl font-bold">Create new password</h1>
                  <FieldDescription>Enter your new password</FieldDescription>
                </div>
                <Field>
                  <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <FieldDescription>
                    Must be at least 8 characters
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </Field>
                <Field>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </>
      )}

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
