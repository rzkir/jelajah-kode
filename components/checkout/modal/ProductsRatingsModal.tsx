"use client";

import { Star, Loader2 } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProductsRatingsModal({
    open,
    onOpenChange,
    selectedProduct,
    rating,
    hoveredRating,
    comment,
    isSubmittingRating,
    onRatingChange,
    onHoveredRatingChange,
    onCommentChange,
    onSubmit,
    onCancel,
}: ProductsRatingsModalProps) {
    const { t } = useTranslation();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle suppressHydrationWarning>{t("rating.rateProduct")}</DialogTitle>
                    <DialogDescription suppressHydrationWarning>
                        {selectedProduct ? `${t("rating.shareExperience")} ${selectedProduct.title}` : t("rating.rateThisProduct")}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label suppressHydrationWarning>{t("rating.rating")}</Label>
                        <div className="flex items-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none"
                                    onMouseEnter={() => onHoveredRatingChange(star)}
                                    onMouseLeave={() => onHoveredRatingChange(0)}
                                    onClick={() => onRatingChange(star)}
                                >
                                    <Star
                                        className={`h-8 w-8 transition-colors ${star <= (hoveredRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-sm text-muted-foreground mt-1" suppressHydrationWarning>
                                {rating === 1 && t("rating.poor")}
                                {rating === 2 && t("rating.fair")}
                                {rating === 3 && t("rating.good")}
                                {rating === 4 && t("rating.veryGood")}
                                {rating === 5 && t("rating.excellent")}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="comment" suppressHydrationWarning>{t("rating.comment")}</Label>
                        <Textarea
                            id="comment"
                            placeholder={t("rating.shareThoughts")}
                            value={comment}
                            onChange={(e) => onCommentChange(e.target.value)}
                            className="mt-2 min-h-[100px]"
                            maxLength={1000}
                        />
                        <p className="text-xs text-muted-foreground mt-1 text-right">
                            {comment.length}/1000
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmittingRating}
                    >
                        <span suppressHydrationWarning>{t("common.cancel")}</span>
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={rating === 0 || !comment.trim() || isSubmittingRating}
                    >
                        {isSubmittingRating ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                <span suppressHydrationWarning>{t("rating.submitting")}</span>
                            </>
                        ) : (
                            <span suppressHydrationWarning>{t("rating.submitRating")}</span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

