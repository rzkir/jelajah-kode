"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface DeleteModalProductsProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCancel: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    itemTitle?: string;
}

export default function DeleteModalProducts({
    isOpen,
    onOpenChange,
    onCancel,
    onConfirm,
    isDeleting,
    itemTitle,
}: DeleteModalProductsProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-106.25 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-lg sm:text-xl font-bold">
                        Delete Product
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Are you sure you want to delete{" "}
                        {itemTitle ? `the product "${itemTitle}"` : "this product"}? This
                        action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onCancel} className="px-6">
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="px-6"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}