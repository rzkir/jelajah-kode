"use client"

import { Card, CardContent } from "@/components/ui/card"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import Link from "next/link"

import { Star } from "lucide-react"

interface RatingsCardProps {
    item: {
        _id: string;
        rating: number;
        comment: string;
        author: {
            _id: string;
            name: string;
            picture?: string;
        };
        created_at: string;
        product?: {
            productsId: string;
            title: string;
            thumbnail?: string;
        };
    };
    className?: string;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
        return "Invalid Date"
    }
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export default function RatingsCard({
    item,
    className = ""
}: RatingsCardProps) {
    return (
        <Card className={`border-2 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl ${className}`}>
            <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-border/50 shadow-md shrink-0">
                        <AvatarImage
                            src={item.author.picture}
                            alt={item.author.name}
                        />
                        <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 font-semibold text-sm sm:text-base">
                            {item.author.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                        <div className="flex items-start justify-between gap-2 sm:gap-4 flex-wrap">
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-base sm:text-lg mb-1 wrap-break-word">
                                    {item.author.name}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    {formatDate(item.created_at)}
                                </p>
                                {item.product && (
                                    <Link
                                        href={`/products/${item.product.productsId}`}
                                        className="text-xs sm:text-sm text-primary hover:underline mt-1 inline-block"
                                    >
                                        {item.product.title}
                                    </Link>
                                )}
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1 bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shrink-0">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${i < item.rating
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap leading-relaxed wrap-break-word">
                            {item.comment}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

