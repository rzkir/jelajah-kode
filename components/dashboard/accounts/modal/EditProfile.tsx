"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/config";
import { useAuth } from "@/utils/context/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";

interface EditProfileProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditProfile({ open, onOpenChange }: EditProfileProps) {
    const { user, refreshUserData } = useAuth();
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form with user data when dialog opens
    useEffect(() => {
        if (open && user) {
            setName(user.name || "");
        }
    }, [open, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error(t("editProfile.nameCannotBeEmpty"));
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.me, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_CONFIG.SECRET}`,
                },
                credentials: "include",
                body: JSON.stringify({
                    name: name.trim(),
                }),
            });

            if (!response.ok) {
                // Handle rate limit errors
                if (response.status === 429) {
                    toast.error("Terlalu banyak permintaan. Silakan coba lagi nanti.");
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update profile");
            }

            // Refresh user data
            await refreshUserData();

            toast.success("Profile updated successfully!");
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Failed to update profile. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle suppressHydrationWarning>{t("editProfile.title")}</DialogTitle>
                    <DialogDescription suppressHydrationWarning>
                        {t("editProfile.description")}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel suppressHydrationWarning>{t("editProfile.name")}</FieldLabel>
                            <FieldContent>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t("editProfile.enterYourName")}
                                    disabled={isLoading}
                                    required
                                />
                                <FieldDescription suppressHydrationWarning>
                                    {t("editProfile.displayNameVisible")}
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
                            <span suppressHydrationWarning>{t("common.cancel")}</span>
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span suppressHydrationWarning>{t("editProfile.saveChanges")}</span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
