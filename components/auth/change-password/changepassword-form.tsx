"use client";

import { Code } from "lucide-react";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { passwordResetSchema } from "@/hooks/validation";

import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { PasswordInput } from "@/components/ui/password-input";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Link from "next/link";

import { useAuth } from "@/utils/context/AuthContext";

import { useTranslation } from "@/hooks/useTranslation";

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    passwordResetStep,
    passwordResetOtp,
    passwordResetNewPassword,
    passwordResetConfirmPassword,
    passwordResetIsLoading,
    setPasswordResetOtp,
    setPasswordResetNewPassword,
    setPasswordResetConfirmPassword,
    handleVerifyOtpForPasswordReset,
    handleResetPasswordWithOtp,
  } = useAuth();
  const { t } = useTranslation();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(passwordResetSchema),
    mode: "onBlur",
  });

  // Update form values when context values change
  useEffect(() => {
    setValue("newPassword", passwordResetNewPassword);
    setValue("confirmPassword", passwordResetConfirmPassword);
  }, [passwordResetNewPassword, passwordResetConfirmPassword, setValue]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    // Check if email parameter exists
    if (!email) {
      toast.error(t("auth.requestResetFromForgetPage"));
      router.push("/forget-password");
    }
  }, [email, router, t]);

  const handleVerifyOTP = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleVerifyOtpForPasswordReset(passwordResetOtp);
  };

  const onSubmitPassword = async (data: { newPassword: string; confirmPassword: string }) => {
    // Update context with validated data
    setPasswordResetNewPassword(data.newPassword);
    setPasswordResetConfirmPassword(data.confirmPassword);
    await handleResetPasswordWithOtp();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {!email ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">
            {t("auth.redirecting")}
          </p>
        </div>
      ) : (
        <>
          {passwordResetStep === "otp" && (
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
                    <span className="sr-only">{t("auth.enterCodeTitle")}</span>
                  </a>
                  <h1 className="text-xl font-bold">
                    {t("auth.enterCodeTitle")}
                  </h1>
                  <FieldDescription>
                    {t("auth.enterCodeSubtitle")}
                  </FieldDescription>
                </div>
                <Field>
                  <FieldLabel htmlFor="otp" className="sr-only">
                    {t("auth.enterCodeTitle")}
                  </FieldLabel>
                  <InputOTP
                    maxLength={6}
                    id="otp"
                    required
                    value={passwordResetOtp}
                    onChange={(value) => setPasswordResetOtp(value)}
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
                    {t("auth.didntReceiveCode")}{" "}
                    <Link
                      href="/forget-password"
                      className="text-blue-600 hover:underline"
                    >
                      {t("auth.resend")}
                    </Link>
                  </FieldDescription>
                </Field>
                <Field>
                  <Button
                    type="submit"
                    disabled={
                      passwordResetIsLoading || passwordResetOtp.length !== 6
                    }
                  >
                    {passwordResetIsLoading ? t("auth.verifying") : t("auth.verify")}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}

          {passwordResetStep === "password" && (
            <form onSubmit={handleSubmit(onSubmitPassword)}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <a
                    href="#"
                    className="flex flex-col items-center gap-2 font-medium"
                  >
                    <div className="flex size-8 items-center justify-center rounded-md">
                      <Code className="size-6" />
                    </div>
                    <span className="sr-only">
                      {t("auth.createNewPasswordTitle")}
                    </span>
                  </a>
                  <h1 className="text-xl font-bold">
                    {t("auth.createNewPasswordTitle")}
                  </h1>
                  <FieldDescription>
                    {t("auth.createNewPasswordSubtitle")}
                  </FieldDescription>
                </div>
                <Field>
                  <FieldLabel htmlFor="newPassword">
                    {t("auth.newPasswordLabel")}
                  </FieldLabel>
                  <PasswordInput
                    id="newPassword"
                    placeholder={t("auth.newPasswordPlaceholder")}
                    value={passwordResetNewPassword}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPasswordResetNewPassword(value);
                      setValue("newPassword", value);
                      trigger("newPassword");
                    }}
                    required
                    minLength={8}
                  />
                  {errors.newPassword && (
                    <FieldDescription className="text-red-500">
                      {errors.newPassword.message as string}
                    </FieldDescription>
                  )}
                  <FieldDescription>
                    {t("auth.newPasswordHelper")}
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    {t("auth.confirmNewPasswordLabel")}
                  </FieldLabel>
                  <PasswordInput
                    id="confirmPassword"
                    placeholder={t("auth.confirmNewPasswordPlaceholder")}
                    value={passwordResetConfirmPassword}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPasswordResetConfirmPassword(value);
                      setValue("confirmPassword", value);
                      trigger("confirmPassword");
                    }}
                    required
                    minLength={8}
                  />
                  {errors.confirmPassword && (
                    <FieldDescription className="text-red-500">
                      {errors.confirmPassword.message as string}
                    </FieldDescription>
                  )}
                </Field>
                <Field>
                  <Button type="submit" disabled={passwordResetIsLoading}>
                    {passwordResetIsLoading ? t("auth.resetting") : t("auth.resetPassword")}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </>
      )}

      <FieldDescription className="px-6 text-center">
        {t("auth.tosNotice")}{" "}
        <a href="#" className="underline">
          {t("auth.tos")}
        </a>{" "}
        {t("auth.and")}{" "}
        <a href="#" className="underline">
          {t("auth.privacyPolicy")}
        </a>
      </FieldDescription>
    </div>
  );
}
