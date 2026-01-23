"use client";

import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/utils/context/AuthContext";

import { useTranslation } from "@/hooks/useTranslation";

export function OTPForm({ className, email, ...props }: React.ComponentProps<"div"> & { email?: string }) {
  const { otp, setOtp, otpIsLoading, otpIsResending, handleOtpSubmit, handleResendOTP } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleOtpSubmit(otp);
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
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Kodera.</span>
            </a>
            <h1 className="text-xl font-bold" suppressHydrationWarning>{t("auth.enterCodeTitle")}</h1>
            <FieldDescription suppressHydrationWarning>
              {t("auth.enterCodeSubtitle")} {email || t("auth.email")}
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="otp" className="sr-only" suppressHydrationWarning>
              {t("auth.enterCodeTitle")}
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
            <FieldDescription className="text-center" suppressHydrationWarning>
              {t("auth.didntReceiveCode")}{" "}
              <button
                type="button"
                onClick={() => email && handleResendOTP(email)}
                disabled={otpIsResending}
                className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpIsResending ? t("auth.resending") : t("auth.resend")}
              </button>
            </FieldDescription>
          </Field>
          <Field>
            <Button type="submit" disabled={otpIsLoading}>
              <span suppressHydrationWarning>{otpIsLoading ? t("auth.verifying") : t("auth.verify")}</span>
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center" suppressHydrationWarning>
        {t("auth.tosNotice")} <a href="#">{t("auth.tos")}</a>{" "}
        {t("auth.and")} <a href="#">{t("auth.privacyPolicy")}</a>.
      </FieldDescription>
    </div>
  );
}
