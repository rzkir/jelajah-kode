"use client";

import { Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { signupSchema } from "@/hooks/validation";

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

import { useAuth } from "@/utils/context/AuthContext";

import Link from "next/link";

import { useTranslation } from "@/hooks/useTranslation";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    handleSignupSubmit,
    signupIsLoading,
  } = useAuth();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormSignupValues) => {
    await handleSignupSubmit(
      data.name,
      data.email,
      data.password,
      data.confirmPassword
    );
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {t("auth.createAccountTitle")}
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            {t("auth.createAccountSubtitle")}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">
            {t("auth.fullName")}
          </FieldLabel>
          <Input
            id="name"
            {...register("name")}
            type="text"
            placeholder={t("auth.fullNamePlaceholder")}
          />
          {errors.name && (
            <FieldDescription className="text-red-500">
              {errors.name.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="email">
            {t("auth.email")}
          </FieldLabel>
          <Input
            id="email"
            {...register("email")}
            type="email"
            placeholder={t("auth.emailPlaceholder")}
          />
          {errors.email && (
            <FieldDescription className="text-red-500">
              {errors.email.message}
            </FieldDescription>
          )}
          <FieldDescription>
            {t("auth.emailHelper")}
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">
            {t("auth.password")}
          </FieldLabel>
          <PasswordInput
            id="password"
            {...register("password")}
            placeholder={t("auth.passwordPlaceholderShort")}
          />
          {errors.password && (
            <FieldDescription className="text-red-500">
              {errors.password.message}
            </FieldDescription>
          )}
          <FieldDescription>
            {t("auth.passwordHelper")}
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">
            {t("auth.confirmPasswordLabel")}
          </FieldLabel>
          <PasswordInput
            id="confirm-password"
            {...register("confirmPassword")}
            placeholder={t("auth.confirmPasswordPlaceholder")}
          />
          {errors.confirmPassword && (
            <FieldDescription className="text-red-500">
              {errors.confirmPassword.message}
            </FieldDescription>
          )}
          <FieldDescription>
            {t("auth.confirmPasswordHelper")}
          </FieldDescription>
        </Field>
        <Field>
          <Button type="submit" disabled={signupIsLoading}>
            {signupIsLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {signupIsLoading ? t("auth.creatingAccount") : t("auth.createAccount")}
          </Button>
        </Field>

        <FieldDescription className="px-6 text-center">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link href="/signin">{t("auth.signIn")}</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}