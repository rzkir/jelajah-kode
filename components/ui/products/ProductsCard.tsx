"use client"

import { Card, CardTitle, CardContent } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import Link from "next/link"

import { DownloadIcon, Star } from "lucide-react"

import Image from "next/image"

import { useDiscount } from "@/hooks/discountServices"

interface ProductsCardProps {
    item: {
        productsId: string;
        title: string;
        thumbnail: string;
        price: number;
        downloadCount?: number;
        category: {
            title: string;
            categoryId: string;
        };
        frameworks: Array<{
            title: string;
            frameworkId: string;
            thumbnail?: string;
        }>;
        discount?: {
            type: "percentage" | "fixed";
            value: number;
            until?: string;
        };
        paymentType: "free" | "paid";
        rating?: number;
        ratingCount?: number;
    };
    href?: string;
    showRating?: boolean;
    className?: string;
}

export default function ProductsCard({
    item,
    href,
    className = ""
}: ProductsCardProps) {
    const { originalPrice, discountedPrice, activeDiscount, hasActiveDiscount } = useDiscount(item.price, item.discount);
    const productHref = href || `/products/${item.productsId}`;

    return (
        <Link href={productHref} className={`group ${className}`}>
            <Card className="p-0 overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/50">
                {/* Image Container with Discount Badge */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* Discount Badge Overlay */}
                    {hasActiveDiscount && activeDiscount && (
                        <div className="absolute top-3 right-3 z-10">
                            <Badge
                                variant="destructive"
                                className="text-sm font-bold px-3 py-1 shadow-lg"
                            >
                                {activeDiscount.type === "percentage"
                                    ? `-${activeDiscount.value}%`
                                    : `-Rp ${activeDiscount.value.toLocaleString('id-ID')}`
                                }
                            </Badge>
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3 z-10">
                        <Badge
                            variant="secondary"
                            className="text-sm font-bold px-3 py-1 shadow-lg"
                        >
                            {item.category.title}
                        </Badge>
                    </div>
                </div>

                <CardContent className="pt-0 space-y-4">
                    {/* Frameworks */}
                    <div className="flex flex-wrap gap-2">
                        {item.frameworks.slice(0, 3).map((framework, frameworkIdx) => (
                            <Badge
                                key={frameworkIdx}
                                variant="outline"
                                className="text-xs px-2 py-1"
                            >
                                {framework.title}
                            </Badge>
                        ))}
                        {item.frameworks.length > 3 && (
                            <Badge
                                variant="outline"
                                className="text-xs px-2 py-1"
                            >
                                +{item.frameworks.length - 3}
                            </Badge>
                        )}
                    </div>

                    {/* Title */}
                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {item.title}
                    </CardTitle>

                    {/* Rating and Download Count */}
                    <div className="flex flex-row items-center gap-4">
                        <span className="flex flex-row items-center gap-1.5 text-sm text-muted-foreground">
                            <Star className={`w-4 h-4 ${item.rating && item.rating > 0 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                            <span className="font-medium">{(item.rating && item.rating > 0) ? item.rating.toFixed(1) : '0.0'}</span>
                            {item.ratingCount !== undefined && item.ratingCount > 0 && (
                                <span className="text-xs">({item.ratingCount})</span>
                            )}
                        </span>

                        <span className="flex flex-row items-center gap-1.5 text-sm text-muted-foreground">
                            <DownloadIcon className="w-4 h-4" />
                            {item.downloadCount ? item.downloadCount.toLocaleString('id-ID') : 0}
                        </span>
                    </div>

                    {/* Price Section */}
                    <div className="flex flex-row items-end gap-2 mb-6 mt-5">
                        {item.paymentType === 'free' ? (
                            <span className="text-2xl font-bold text-green-600">Free</span>
                        ) : hasActiveDiscount ? (
                            <>
                                <span className="text-2xl font-bold text-primary">
                                    Rp {discountedPrice.toLocaleString('id-ID')}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                    Rp {originalPrice.toLocaleString('id-ID')}
                                </span>
                            </>
                        ) : (
                            <span className="text-2xl font-bold text-primary">
                                Rp {originalPrice.toLocaleString('id-ID')}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

