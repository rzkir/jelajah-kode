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
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Rate Product</DialogTitle>
                    <DialogDescription>
                        {selectedProduct ? `Share your experience with ${selectedProduct.title}` : "Rate this product"}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label>Rating</Label>
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
                            <p className="text-sm text-muted-foreground mt-1">
                                {rating === 1 && "Poor"}
                                {rating === 2 && "Fair"}
                                {rating === 3 && "Good"}
                                {rating === 4 && "Very Good"}
                                {rating === 5 && "Excellent"}
                            </p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="comment">Comment</Label>
                        <Textarea
                            id="comment"
                            placeholder="Share your thoughts about this product..."
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
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={rating === 0 || !comment.trim() || isSubmittingRating}
                    >
                        {isSubmittingRating ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            "Submit Rating"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

