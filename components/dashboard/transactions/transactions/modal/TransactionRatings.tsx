"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Star, Package, Loader2 } from "lucide-react";
import { fetchProductsRatings } from "@/utils/fetching/FetchProducts";

interface TransactionRatingsProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
}

interface Rating {
    _id: string;
    productsId: string;
    rating: number;
    comment: string;
    author: {
        _id: string;
        name: string;
        picture?: string;
        role: string;
    };
    created_at: string;
    updated_at: string;
}

export default function TransactionRatings({
    transaction,
    isOpen,
    onClose,
}: TransactionRatingsProps) {
    const [productRatings, setProductRatings] = useState<Record<string, Rating | null>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Fetch ratings for products when modal opens
    // Mengambil dari collection ratings sama seperti di product details
    useEffect(() => {
        if (!isOpen || !transaction || transaction.status !== "success" || !transaction.products) {
            return;
        }

        const fetchRatings = async () => {
            setIsLoading(true);
            const ratings: Record<string, Rating | null> = {};

            for (const product of transaction.products) {
                try {
                    // Mengambil semua ratings dari collection ratings seperti di product details
                    const allRatings = await fetchProductsRatings(product.productsId, 1, 100);

                    // Filter untuk mendapatkan rating dari user yang melakukan transaksi
                    const userRating = allRatings.find(
                        (rating: Rating) => rating.author._id === transaction.user._id
                    );

                    ratings[product.productsId] = userRating || null;
                } catch (error) {
                    console.error(
                        `Failed to fetch rating for product ${product.productsId}:`,
                        error
                    );
                    ratings[product.productsId] = null;
                }
            }

            setProductRatings(ratings);
            setIsLoading(false);
        };

        fetchRatings();
    }, [isOpen, transaction]);

    if (!transaction) return null;

    // Get all products from transaction (no filter)
    const allProducts = transaction.products || [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        Reviews & Ratings
                    </DialogTitle>
                    <DialogDescription>
                        Review untuk transaksi {transaction?.order_id || ""}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4 overflow-y-auto pr-2 py-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-3 text-muted-foreground">Loading reviews...</span>
                        </div>
                    ) : allProducts.length === 0 ? (
                        <Card className="border-2">
                            <CardContent className="py-12 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                        <Package className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg mb-1">No Products Found</p>
                                        <p className="text-sm text-muted-foreground">
                                            Tidak ada produk dalam transaksi ini
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        allProducts.map((product) => {
                            const ratingData = productRatings[product.productsId];
                            const hasRating = ratingData !== null && ratingData !== undefined;

                            return (
                                <Card key={product._id} className="border-2">
                                    <CardHeader className="bg-muted/30">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            {product.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {product.thumbnail && (
                                                <div className="relative shrink-0 w-full sm:w-32 md:w-40 aspect-square rounded-lg overflow-hidden border-2">
                                                    <Image
                                                        src={product.thumbnail}
                                                        alt={product.title}
                                                        fill
                                                        loading="lazy"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 space-y-4">
                                                {hasRating && ratingData ? (
                                                    <>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground mb-2">
                                                                Rating
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex items-center gap-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Star
                                                                            key={star}
                                                                            className={`h-5 w-5 ${star <= (ratingData.rating || 0)
                                                                                ? "fill-yellow-400 text-yellow-400"
                                                                                : "text-muted-foreground"
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <span className="text-sm font-semibold text-muted-foreground">
                                                                    {ratingData.rating}/5
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {ratingData.comment && (
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground mb-2">
                                                                    Review
                                                                </p>
                                                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-border">
                                                                    <p className="text-sm leading-relaxed text-foreground">
                                                                        {ratingData.comment}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                            <span>Product ID: {product.productsId}</span>
                                                            {ratingData._id && (
                                                                <span>• Rating ID: {ratingData._id}</span>
                                                            )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="py-4 text-center">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Star className="h-8 w-8 text-muted-foreground" />
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Belum ada review untuk produk ini
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

