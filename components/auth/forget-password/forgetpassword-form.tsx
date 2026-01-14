"use client";

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

import Link from "next/link";

import { useAuth } from "@/utils/context/AuthContext";

import { useTranslation } from "@/hooks/useTranslation";

export function ForgetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    forgetPasswordEmail,
    forgetPasswordIsLoading,
    setForgetPasswordEmail,
    handleForgetPasswordSubmit,
  } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleForgetPasswordSubmit();
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
              <span className="sr-only">{t("auth.forgetTitle")}</span>
            </a>
            <h1 className="text-xl font-bold">
              {t("auth.forgetTitle")}
            </h1>
            <FieldDescription>
              {t("auth.forgetSubtitle")}
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">
              {t("auth.email")}
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder={t("auth.emailPlaceholder")}
              value={forgetPasswordEmail}
              onChange={(e) => setForgetPasswordEmail(e.target.value)}
              required
            />
          </Field>
          <Field>
            <Button type="submit" disabled={forgetPasswordIsLoading}>
              {forgetPasswordIsLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {forgetPasswordIsLoading ? t("auth.sending") : t("auth.sendResetCode")}
            </Button>
          </Field>
          <FieldDescription className="text-center">
            {t("auth.rememberPasswordQuestion")}{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              {t("auth.signIn")}
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
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
