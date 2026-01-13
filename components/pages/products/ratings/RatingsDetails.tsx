"use client";

import { useState, useEffect, useMemo } from "react";

import { useParams, useRouter } from "next/navigation";

import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Star, ArrowLeft, Search } from "lucide-react";

import { fetchProductsRatings, fetchProductsById } from "@/utils/fetching/FetchProducts";

import useFormatDate from "@/hooks/FormatDate";

export default function RatingsDetails() {
    const params = useParams();
    const router = useRouter();
    const productsId = params?.productsId as string;
    const { formatDate } = useFormatDate();

    const [ratings, setRatings] = useState<Rating[]>([]);
    const [ratingsLoading, setRatingsLoading] = useState<boolean>(true);
    const [product, setProduct] = useState<ProductsDetails | null>(null);
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!productsId) return;

        const loadData = async () => {
            try {
                setRatingsLoading(true);

                // Fetch product details
                const productData = await fetchProductsById(productsId);
                setProduct(productData);

                // Fetch all ratings (using a large limit to get all ratings)
                const allRatings = await fetchProductsRatings(productsId, 1, 1000);
                setRatings(allRatings);
            } catch (error) {
                console.error("Error fetching ratings:", error);
                setRatings([]);
            } finally {
                setRatingsLoading(false);
            }
        };

        loadData();
    }, [productsId]);

    // Calculate rating distribution
    const ratingDistribution = useMemo(() => {
        return {
            5: ratings.filter((r) => r.rating === 5).length,
            4: ratings.filter((r) => r.rating === 4).length,
            3: ratings.filter((r) => r.rating === 3).length,
            2: ratings.filter((r) => r.rating === 2).length,
            1: ratings.filter((r) => r.rating === 1).length,
        };
    }, [ratings]);

    const averageRating = useMemo(() => {
        if (ratings.length === 0) return "0.0";
        return (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1);
    }, [ratings]);

    // Filter and sort ratings
    const filteredRatings = useMemo(() => {
        let filtered = [...ratings];

        // Filter by rating value
        if (ratingFilter !== null) {
            filtered = filtered.filter((rating) => rating.rating === ratingFilter);
        }

        // Filter by search term
        if (searchTerm !== "") {
            filtered = filtered.filter(
                (rating) =>
                    rating.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    rating.author.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort ratings
        filtered.sort((a, b) => {
            switch (sortOrder) {
                case "newest":
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case "oldest":
                    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case "highest":
                    return b.rating - a.rating;
                case "lowest":
                    return a.rating - b.rating;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [ratings, ratingFilter, sortOrder, searchTerm]);

    const renderStars = (rating: number) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                />
            ))}
        </div>
    );

    if (!productsId) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p className="text-center text-muted-foreground">Product ID not found</p>
            </div>
        );
    }

    return (
        <section className="min-h-full overflow-visible relative py-4">
            <div className="container mx-auto px-2 md:px-4">
                {/* Back Button */}
                <div className="mb-4 sm:mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Product</span>
                    </Button>
                </div>

                {/* Product Title */}
                {product && (
                    <div className="mb-6 sm:mb-8">
                        <Link href={`/products/${productsId}`}>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 text-foreground hover:text-primary transition-colors">
                                {product.title}
                            </h1>
                        </Link>
                    </div>
                )}

                {/* Rating Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardContent className="p-6">
                            <div className="text-sm text-muted-foreground mb-2">Average Rating</div>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-4xl font-bold text-foreground">{averageRating}</span>
                                <span className="text-muted-foreground text-sm mb-1">/ 5.0</span>
                            </div>
                            {renderStars(Math.round(Number.parseFloat(averageRating)))}
                        </CardContent>
                    </Card>

                    {[5, 4, 3, 2, 1].map((star) => (
                        <Card
                            key={star}
                            className="bg-card/50 backdrop-blur-sm border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
                            onClick={() => setRatingFilter(ratingFilter === star ? null : star)}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex gap-1">{renderStars(star)}</div>
                                    <span className="text-sm font-semibold text-foreground">
                                        {ratingDistribution[star as keyof typeof ratingDistribution]}
                                    </span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className="bg-yellow-500 h-2 rounded-full transition-all"
                                        style={{
                                            width: `${ratings.length > 0
                                                ? (ratingDistribution[star as keyof typeof ratingDistribution] / ratings.length) * 100
                                                : 0
                                                }%`,
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters and Search */}
                <div className="space-y-4 mb-8">
                    <div className="flex gap-4 flex-wrap">
                        <div className="flex-1 min-w-64">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                <Input
                                    placeholder="Search by reviewer or comment..."
                                    className="pl-10 bg-card/50 border-border/50 text-foreground placeholder-muted-foreground"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Select
                                value={sortOrder}
                                onValueChange={(value) =>
                                    setSortOrder(value as "newest" | "oldest" | "highest" | "lowest")
                                }
                            >
                                <SelectTrigger className="w-full sm:w-[180px] bg-card/50 border-border/50">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                    <SelectItem value="highest">Highest Rating</SelectItem>
                                    <SelectItem value="lowest">Lowest Rating</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {ratingFilter !== null && (
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-muted/50 border-border/50">
                                Filtering by {ratingFilter} star{ratingFilter !== 1 ? "s" : ""}
                            </Badge>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => setRatingFilter(null)}
                            >
                                Clear filter
                            </Button>
                        </div>
                    )}
                </div>

                {/* Ratings List */}
                {ratingsLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <Skeleton className="w-10 h-10 rounded-full shrink-0 bg-muted" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-5 w-32 bg-muted" />
                                            <Skeleton className="h-4 w-full bg-muted" />
                                            <Skeleton className="h-4 w-3/4 bg-muted" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredRatings.length === 0 ? (
                    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                        <CardContent className="p-8 text-center">
                            <p className="text-muted-foreground">No reviews found matching your criteria.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredRatings.map((rating) => (
                            <Card
                                key={rating._id}
                                className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <Avatar className="w-10 h-10 ring-2 ring-border/50 shadow-md shrink-0">
                                            <AvatarImage
                                                src={rating.author.picture}
                                                alt={rating.author.name}
                                            />
                                            <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 font-semibold text-sm">
                                                {rating.author.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4 mb-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <span className="font-semibold text-foreground">{rating.author.name}</span>
                                                        {product && (
                                                            <Badge variant="outline" className="text-xs bg-muted/50 border-border/50">
                                                                {product.title}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="mb-2">{renderStars(rating.rating)}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-muted-foreground">{formatDate(rating.created_at)}</div>
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground text-sm leading-relaxed">{rating.comment}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {filteredRatings.length > 0 && (
                    <div className="text-center mt-8">
                        <p className="text-muted-foreground text-sm">
                            Showing {filteredRatings.length} of {ratings.length} reviews
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
