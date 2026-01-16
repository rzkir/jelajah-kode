"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Field,
    FieldContent,
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
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/config";
import { useAuth } from "@/utils/context/AuthContext";
import { passwordResetSchema } from "@/hooks/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/hooks/useTranslation";

interface ChangePasswordProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type Step = "otp" | "password";

export default function ChangePassword({ open, onOpenChange }: ChangePasswordProps) {
    const { user, changePassword } = useAuth();
    const { t } = useTranslation();
    const [step, setStep] = useState<Step>("otp");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRequestingOtp, setIsRequestingOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const {
        handleSubmit,
        formState: { errors },
        register,
        reset,
    } = useForm({
        resolver: zodResolver(passwordResetSchema),
        mode: "onBlur",
    });

    const requestOtp = useCallback(async () => {
        if (!user?.email) {
            toast.error("User email not found");
            return;
        }

        setIsRequestingOtp(true);

        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.verification, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_CONFIG.SECRET}`,
                },
                credentials: "include",
                body: JSON.stringify({ email: user.email }),
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                throw new Error(result.error || t("changePassword.failedToSendOtp"));
            }

            toast.success(t("changePassword.otpSentSuccess"));
            setOtpSent(true);
        } catch (error) {
            console.error("Error requesting OTP:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : t("changePassword.failedToSendOtp")
            );
        } finally {
            setIsRequestingOtp(false);
        }
    }, [user?.email, t]);

    // Reset form state when dialog opens
    useEffect(() => {
        if (open) {
            setStep("otp");
            setOtp("");
            setOtpSent(false);
            reset();
        }
    }, [open, reset]);

    const handleResendOtp = async () => {
        await requestOtp();
    };

    const handleSendOtp = async () => {
        await requestOtp();
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            toast.error("Please enter a valid 6-digit code");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.verification, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_CONFIG.SECRET}`,
                },
                credentials: "include",
                body: JSON.stringify({ token: otp }),
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                throw new Error(result.error || t("changePassword.invalidOrExpiredOtp"));
            }

            toast.success(t("changePassword.otpVerifiedSuccess"));
            setStep("password");
        } catch (error) {
            console.error("Error verifying OTP:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : t("changePassword.failedToVerifyOtp")
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (data: {
        newPassword: string;
        confirmPassword: string;
    }) => {
        setIsLoading(true);

        try {
            const success = await changePassword(data.newPassword);

            if (success) {
                toast.success("Password changed successfully!");
                onOpenChange(false);
                reset();
                setStep("otp");
                setOtp("");
                setOtpSent(false);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to change password. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2" suppressHydrationWarning>
                        <Lock className="h-5 w-5" />
                        {t("changePassword.title")}
                    </DialogTitle>
                    <DialogDescription suppressHydrationWarning>
                        {step === "otp"
                            ? otpSent
                                ? t("changePassword.verifyIdentityOtp")
                                : t("changePassword.clickToReceiveCode")
                            : t("changePassword.enterNewPassword")}
                    </DialogDescription>
                </DialogHeader>

                {step === "otp" ? (
                    otpSent ? (
                        <form onSubmit={handleVerifyOtp}>
                            <FieldGroup>
                                <div className="flex flex-col items-center gap-2 text-center mb-4">
                                    <h3 className="text-lg font-semibold">
                                        Enter verification code
                                    </h3>
                                    <FieldDescription>
                                        We sent a 6-digit code to {user?.email}
                                    </FieldDescription>
                                </div>
                                <Field>
                                    <FieldLabel htmlFor="otp" className="sr-only">
                                        Verification code
                                    </FieldLabel>
                                    <FieldContent>
                                        <div className="flex justify-center">
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
                                        </div>
                                        <FieldDescription className="text-center" suppressHydrationWarning>
                                            {t("changePassword.didntReceiveCode")}{" "}
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={isRequestingOtp}
                                                className="text-blue-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isRequestingOtp ? t("changePassword.sending") : t("changePassword.resend")}
                                            </button>
                                        </FieldDescription>
                                    </FieldContent>
                                </Field>
                            </FieldGroup>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading || otp.length !== 6}
                                >
                                    {isLoading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Verify
                                </Button>
                            </DialogFooter>
                        </form>
                    ) : (
                        <div>
                            <FieldGroup>
                                <div className="flex flex-col items-center gap-4 text-center py-4">
                                    <div className="flex size-12 items-center justify-center rounded-full bg-blue-100">
                                        <Lock className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2" suppressHydrationWarning>
                                            {t("changePassword.verifyYourIdentity")}
                                        </h3>
                                        <FieldDescription suppressHydrationWarning>
                                            {t("changePassword.sendCodeToEmail")} {user?.email}
                                        </FieldDescription>
                                    </div>
                                </div>
                            </FieldGroup>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isRequestingOtp}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={isRequestingOtp}
                                >
                                    {isRequestingOtp && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Send OTP
                                </Button>
                            </DialogFooter>
                        </div>
                    )
                ) : (
                    <form onSubmit={handleSubmit(handleChangePassword)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="newPassword" suppressHydrationWarning>
                                    {t("changePassword.newPassword")}
                                </FieldLabel>
                                <FieldContent>
                                    <PasswordInput
                                        id="newPassword"
                                        placeholder={t("changePassword.enterNewPasswordPlaceholder")}
                                        {...register("newPassword")}
                                        disabled={isLoading}
                                        required
                                        minLength={8}
                                    />
                                    {errors.newPassword && (
                                        <FieldDescription className="text-red-500">
                                            {errors.newPassword.message as string}
                                        </FieldDescription>
                                    )}
                                    <FieldDescription suppressHydrationWarning>
                                        {t("changePassword.passwordRequirements")}
                                    </FieldDescription>
                                </FieldContent>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirmPassword" suppressHydrationWarning>
                                    {t("changePassword.confirmPassword")}
                                </FieldLabel>
                                <FieldContent>
                                    <PasswordInput
                                        id="confirmPassword"
                                        placeholder={t("changePassword.confirmNewPasswordPlaceholder")}
                                        {...register("confirmPassword")}
                                        disabled={isLoading}
                                        required
                                        minLength={8}
                                    />
                                    {errors.confirmPassword && (
                                        <FieldDescription className="text-red-500">
                                            {errors.confirmPassword.message as string}
                                        </FieldDescription>
                                    )}
                                </FieldContent>
                            </Field>
                        </FieldGroup>
                        <DialogFooter className="mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setStep("otp");
                                    setOtp("");
                                    setOtpSent(false);
                                    reset();
                                }}
                                disabled={isLoading}
                            >
                                Back
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Change Password
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
