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

interface EditProfileProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditProfile({ open, onOpenChange }: EditProfileProps) {
    const { user, refreshUserData } = useAuth();
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
            toast.error("Name cannot be empty");
            return;
        }

        setIsLoading(true);

        try {
            // For development: use proxy route to handle cookie forwarding
            // For production: use direct backend call
            const meUrl =
                process.env.NODE_ENV === "development"
                    ? "/api/auth/proxy-me" // Use proxy in development
                    : API_CONFIG.ENDPOINTS.me; // Direct call in production

            const response = await fetch(meUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: name.trim(),
                }),
            });

            if (!response.ok) {
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
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your profile information. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Name</FieldLabel>
                            <FieldContent>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    disabled={isLoading}
                                    required
                                />
                                <FieldDescription>
                                    Your display name will be visible to other users.
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
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
