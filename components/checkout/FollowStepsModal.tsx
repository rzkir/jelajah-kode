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
import { useTranslation } from "@/hooks/useTranslation";

export default function FollowStepsModal({
    open,
    onOpenChange,
    onComplete,
    steps,
    isProcessing,
    onStepClick,
    onStepComplete,
}: FollowStepsModalProps) {
    const { t } = useTranslation();
    const allStepsCompleted = steps.every((step) => step.status === "completed");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md" showCloseButton={!allStepsCompleted}>
                <DialogHeader>
                    <DialogTitle suppressHydrationWarning>{t("followSteps.title")}</DialogTitle>
                    <DialogDescription suppressHydrationWarning>
                        {t("followSteps.description")}
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
                                    <p className="font-medium" suppressHydrationWarning>{t("followSteps.follow")} {step.name}</p>
                                    <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                                        {step.status === "completed"
                                            ? t("followSteps.alreadyFollowed")
                                            : step.status === "in-progress"
                                                ? t("followSteps.clickAfterFollowing")
                                                : t("followSteps.clickToOpen")}
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
                                        <span suppressHydrationWarning>{t("followSteps.iHaveFollowed")}</span>
                                    ) : (
                                        <>
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            <span suppressHydrationWarning>{t("followSteps.open")} {step.name}</span>
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
                        <span suppressHydrationWarning>{t("followSteps.cancel")}</span>
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
                                <span suppressHydrationWarning>{t("followSteps.processing")}</span>
                            </>
                        ) : allStepsCompleted ? (
                            <span suppressHydrationWarning>{t("followSteps.continueCheckout")}</span>
                        ) : (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                <span suppressHydrationWarning>{t("followSteps.waiting")}</span>
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

