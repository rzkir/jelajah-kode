"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

interface DeleteModalUserProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCancel: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    userName?: string;
    userEmail?: string;
}

export default function DeleteModalUser({
    isOpen,
    onOpenChange,
    onCancel,
    onConfirm,
    isDeleting,
    userName,
    userEmail,
}: DeleteModalUserProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl font-bold">
                        Delete Account
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Are you sure you want to delete the account for{" "}
                        {userName ? (
                            <span className="font-semibold">{userName}</span>
                        ) : (
                            "this user"
                        )}
                        {userEmail && (
                            <>
                                {" "}
                                ({userEmail})
                            </>
                        )}
                        ? This action cannot be undone. All user data will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button variant="outline" onClick={onCancel} className="px-6">
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="px-6"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete Account"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

