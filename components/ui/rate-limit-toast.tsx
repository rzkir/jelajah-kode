"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

interface RateLimitToastProps {
    resetTime: Date | string;
    message?: string;
    toastId: string | number;
}

/**
 * Component untuk menampilkan toast dengan timer countdown untuk rate limit
 */
function RateLimitToastContent({
    resetTime,
    message = "Terlalu banyak permintaan. Silakan coba lagi nanti.",
    toastId,
}: RateLimitToastProps) {
    // Calculate initial time left using lazy initialization
    const getInitialTimeLeft = () => {
        const reset = typeof resetTime === "string" ? new Date(resetTime) : resetTime;
        const now = new Date();
        return Math.max(0, Math.ceil((reset.getTime() - now.getTime()) / 1000));
    };

    const [timeLeft, setTimeLeft] = useState<number>(getInitialTimeLeft);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const reset = typeof resetTime === "string" ? new Date(resetTime) : resetTime;
            const now = new Date();
            return Math.max(0, Math.ceil((reset.getTime() - now.getTime()) / 1000));
        };

        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Update every second
        intervalRef.current = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining <= 0) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                // Dismiss toast when timer reaches 0
                toast.dismiss(toastId);
            }
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [resetTime, toastId]);

    const formatTime = (seconds: number): string => {
        if (seconds <= 0) return "0 detik";

        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        if (mins > 0 && secs > 0) {
            return `${mins} menit ${secs} detik`;
        } else if (mins > 0) {
            return `${mins} menit`;
        }
        return `${secs} detik`;
    };

    return (
        <div className="flex flex-col gap-1.5">
            <p className="font-medium">{message}</p>
            <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Coba lagi dalam:</p>
                <span className="font-semibold text-foreground text-sm">
                    {formatTime(timeLeft)}
                </span>
            </div>
        </div>
    );
}

/**
 * Show rate limit toast with countdown timer
 */
export function showRateLimitToast(
    resetTime: Date | string,
    message?: string
): string | number {
    const toastId = `rate-limit-${Date.now()}`;

    toast.error(
        <RateLimitToastContent
            resetTime={resetTime}
            message={message}
            toastId={toastId}
        />,
        {
            duration: Infinity, // Keep toast until timer expires
            id: toastId, // Unique ID for this toast
        }
    );

    return toastId;
}

