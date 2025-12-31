"use client";

import * as React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
    title?: string;
    description?: string;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    className?: string;
    contentClassName?: string;
    showHeader?: boolean;
    responsive?: boolean;
}

export default function BottomSheet({
    open,
    onOpenChange,
    trigger,
    title,
    description,
    children,
    side = "right",
    className,
    contentClassName,
    showHeader = true,
    responsive = true,
}: BottomSheetProps) {
    const isMobile = useIsMobile();

    // Determine the side based on responsive prop and screen size
    const sheetSide = React.useMemo(() => {
        if (responsive) {
            return isMobile ? "bottom" : "right";
        }
        return side;
    }, [responsive, isMobile, side]);

    // Determine the width based on responsive prop and screen size
    const sheetContentClassName = React.useMemo(() => {
        if (responsive && isMobile) {
            // Full width on mobile when responsive
            return cn("w-full max-w-full", contentClassName);
        }
        return contentClassName;
    }, [responsive, isMobile, contentClassName]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
            <SheetContent side={sheetSide} className={sheetContentClassName}>
                {showHeader && (title || description) && (
                    <SheetHeader>
                        {title && <SheetTitle>{title}</SheetTitle>}
                        {description && <SheetDescription>{description}</SheetDescription>}
                    </SheetHeader>
                )}
                <div className={className}>{children}</div>
            </SheetContent>
        </Sheet>
    );
}

