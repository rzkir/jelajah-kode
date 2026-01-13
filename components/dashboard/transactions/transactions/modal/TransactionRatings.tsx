"use client";

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

import RatingsCard from "@/components/ui/ratings/RatingsCard";

export default function TransactionRatings({
    transaction,
    isOpen,
    onClose,
    productRatings,
    isLoading,
}: TransactionRatingsProps) {

    if (!transaction) return null;

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
                                                    <RatingsCard
                                                        item={{
                                                            ...ratingData,
                                                            product: {
                                                                productsId: product.productsId,
                                                                title: product.title,
                                                                thumbnail: product.thumbnail,
                                                            },
                                                        }}
                                                    />
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

