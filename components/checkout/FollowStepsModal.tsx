"use client";

import { Check, ExternalLink, Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export default function FollowStepsModal({
    open,
    onOpenChange,
    onComplete,
    steps,
    isProcessing,
    onStepClick,
    onStepComplete,
}: FollowStepsModalProps) {
    const allStepsCompleted = steps.every((step) => step.status === "completed");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md" showCloseButton={!allStepsCompleted}>
                <DialogHeader>
                    <DialogTitle>Ikuti Media Sosial Kami</DialogTitle>
                    <DialogDescription>
                        Silakan ikuti semua media sosial kami untuk melanjutkan checkout
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`flex items-center justify-between p-4 rounded-lg border ${step.status === "completed"
                                ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                                : step.status === "in-progress"
                                    ? "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                                    : "bg-background border-border"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full ${step.status === "completed"
                                        ? "bg-green-500 text-white"
                                        : step.status === "in-progress"
                                            ? "bg-blue-500 text-white"
                                            : "bg-muted text-muted-foreground"
                                        }`}
                                >
                                    {step.status === "completed" ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <span className="text-sm font-semibold">
                                            {index + 1}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">Ikuti {step.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {step.status === "completed"
                                            ? "Sudah diikuti"
                                            : step.status === "in-progress"
                                                ? "Klik tombol di bawah setelah mengikuti"
                                                : "Klik tombol untuk membuka halaman"}
                                    </p>
                                </div>
                            </div>
                            {step.status === "completed" ? (
                                <Check className="h-5 w-5 text-green-500" />
                            ) : (
                                <Button
                                    variant={
                                        step.status === "in-progress"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => {
                                        if (step.status === "in-progress") {
                                            onStepComplete(step.id);
                                        } else {
                                            onStepClick(step);
                                        }
                                    }}
                                >
                                    {step.status === "in-progress" ? (
                                        "Saya Sudah Mengikuti"
                                    ) : (
                                        <>
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Buka {step.name}
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={allStepsCompleted}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={async () => {
                            if (allStepsCompleted && !isProcessing) {
                                await onComplete();
                            }
                        }}
                        disabled={!allStepsCompleted || isProcessing}
                        className="min-w-[120px]"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Memproses...
                            </>
                        ) : allStepsCompleted ? (
                            "Lanjutkan Checkout"
                        ) : (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Menunggu...
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

