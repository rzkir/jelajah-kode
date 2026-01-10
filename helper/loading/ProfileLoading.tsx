"use client";

import { User } from "lucide-react";

export default function ProfileLoading() {
    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes loading-progress {
                        0% {
                            width: 0%;
                            left: 0%;
                        }
                        50% {
                            width: 70%;
                            left: 0%;
                        }
                        100% {
                            width: 30%;
                            left: 100%;
                        }
                    }
                    @keyframes loading-shimmer {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(100%);
                        }
                    }
                    .loading-bar {
                        animation: loading-progress 2s ease-in-out infinite;
                    }
                    .loading-shimmer {
                        animation: loading-shimmer 1.5s ease-in-out infinite;
                    }
                `
            }} />
            <section className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                <div className="flex flex-col items-center gap-6">
                    {/* Icon dengan animasi */}
                    <div className="relative">
                        {/* Background glow effect */}
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />

                        {/* Icon container dengan animasi */}
                        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20">
                            {/* Icon */}
                            <User className="w-12 h-12 text-primary animate-pulse" />
                        </div>
                    </div>

                    {/* Text dengan animasi */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <h2 className="text-2xl font-bold text-foreground">
                            Jelajah Kode
                        </h2>
                        <p className="text-sm text-muted-foreground animate-pulse">
                            Loading profile...
                        </p>
                    </div>

                    {/* Loading indicator dengan animasi progress */}
                    <div className="w-full max-w-xs">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden relative">
                            {/* Progress bar dengan animasi sliding */}
                            <div className="loading-bar absolute h-full bg-linear-to-r from-primary via-primary/90 to-primary rounded-full"></div>
                            {/* Shimmer effect */}
                            <div className="loading-shimmer absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}