"use client"

import { Star, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Review {
    id: string
    product: string
    rating: number
    title: string
    comment: string
    date: string
}

interface UserReviewsProps {
    reviews: Review[]
}

export function UserReviews({ reviews }: UserReviewsProps) {
    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                    />
                ))}
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Reviews</CardTitle>
                <CardDescription>Reviews you have written for purchased products</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No reviews yet. Start reviewing your purchased products!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div
                                key={review.id}
                                className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors space-y-3"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-sm">{review.product}</h3>
                                            <Badge variant="outline" className="text-xs">
                                                {review.id}
                                            </Badge>
                                        </div>
                                        <h4 className="font-semibold text-base">{review.title}</h4>
                                        {renderStars(review.rating)}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>

                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                    <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                                    <span className="text-xs text-muted-foreground">{review.rating} / 5 stars</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
