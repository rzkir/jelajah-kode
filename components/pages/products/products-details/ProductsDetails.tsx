"use client"

import Image from 'next/image'

import { Badge } from '@/components/ui/badge'

import { Button } from '@/components/ui/button'

import { Card, CardContent } from '@/components/ui/card'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Star, Share2, Download, Check, Filter } from 'lucide-react'

import ProductsCard from '@/components/ui/products/ProductsCard'

import RatingsCard from '@/components/ui/ratings/RatingsCard'

import { formatIDR } from '@/hooks/FormatPrice'

import { TypographyContent } from '@/components/ui/typography'

import { Skeleton } from '@/components/ui/skeleton'

import useStateProductsDetails from '@/components/pages/products/products-details/lib/useStateProductsDetails'

import Link from 'next/link'

interface ProductsDetailsProps {
    product: ProductsDetails
}

export default function ProductsDetails({ product }: ProductsDetailsProps) {
    const {
        activeTab,
        setActiveTab,
        selectedImage,
        setSelectedImage,
        relatedProducts,
        ratings,
        filteredRatings,
        ratingsLoading,
        originalPrice,
        discountedPrice,
        activeDiscount,
        hasActiveDiscount,
        discountPercentage,
        allImages,
        handleShare,
        handleBuyNow,
        authorProductsCount,
        authorAverageRating,
        ratingFilter,
        setRatingFilter,
        sortOrder,
        setSortOrder,
    } = useStateProductsDetails({ product })

    return (
        <section className='min-h-full overflow-visible relative py-4'>
            <div className="container mx-auto px-2 md:px-4">
                {/* Header Section with Badges */}
                <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3">
                    <Link href={`/products/categories/${product.category.categoryId}`}>
                        <Badge variant="secondary" className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium shadow-sm">
                            {product.category.title}
                        </Badge>
                    </Link>
                    <Link href={`/products/types/${product.type.typeId}`}>
                        <Badge variant="default" className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium shadow-sm">
                            {product.type.title}
                        </Badge>
                    </Link>
                    {hasActiveDiscount && activeDiscount && (
                        <Badge variant="destructive" className="px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold shadow-md animate-pulse">
                            🔥 -{discountPercentage}% OFF
                        </Badge>
                    )}
                </div>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 sm:mb-6 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight wrap-break-word">
                    {product.title}
                </h1>

                {/* Short Description */}
                <div className="mb-4 w-full max-w-full overflow-x-hidden">
                    <TypographyContent
                        html={product.description ? (
                            product.description.length > 200
                                ? `${product.description.substring(0, 200)}...`
                                : product.description
                        ) : ''}
                        className="text-muted-foreground text-base sm:text-lg leading-relaxed w-full"
                    />
                </div>

                {/* Rating and Downloads */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-0.5">
                            <Star
                                className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${(product.ratingAverage || 0) > 0
                                    ? 'text-yellow-500 fill-yellow-500 drop-shadow-sm'
                                    : 'text-gray-300 dark:text-gray-600'
                                    }`}
                            />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">
                            {product.ratingAverage?.toFixed(1)} <span className="text-muted-foreground font-normal">({product.ratingCount || 0} reviews)</span>
                        </span>
                    </div>

                    {product.downloadCount !== undefined && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="font-medium">{product.downloadCount.toLocaleString()} downloads</span>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-8 sm:mb-12 md:mb-16">
                    {/* Left Column - Images and Tabs */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
                        {/* Main Product Image */}
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-linear-to-br from-muted to-muted/50 border-2 border-border/50 shadow-xl group">
                            <Image
                                src={selectedImage}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Thumbnail Images */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                                {allImages.slice(0, 3).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative aspect-square rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${selectedImage === img
                                            ? 'border-primary ring-2 sm:ring-4 ring-primary/20 shadow-lg shadow-primary/20 scale-105'
                                            : 'border-border hover:border-primary/50 shadow-md hover:shadow-lg'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.title} view ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        {selectedImage === img && (
                                            <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Navigation Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="w-full justify-start bg-muted/50 rounded-lg sm:rounded-xl border border-border/50 shadow-sm p-0.5 sm:p-0 overflow-x-auto overflow-y-hidden">
                                <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-md sm:rounded-lg px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 w-[40%] md:w-[25%]">
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger value="tech-stack" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-md sm:rounded-lg px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 w-[40%] md:w-[25%]">
                                    Tech Stack
                                </TabsTrigger>
                                <TabsTrigger value="faqs" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-md sm:rounded-lg px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 w-[40%] md:w-[25%]">
                                    FAQs
                                </TabsTrigger>
                                <TabsTrigger value="reviews" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-md sm:rounded-lg px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 w-[40%] md:w-[25%]">
                                    Reviews
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-3 sm:mt-4">
                                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                                    <div className="bg-card/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-border/50 shadow-lg w-full overflow-hidden">
                                        <div className="w-full max-w-full">
                                            <TypographyContent
                                                html={product.description || ''}
                                                className="text-muted-foreground leading-relaxed w-full"
                                                youtubeWrapperClassName="my-6 sm:my-8 w-full max-w-full"
                                                youtubeContainerClassName="shadow-xl border-2 border-primary/20 rounded-xl sm:rounded-2xl overflow-hidden w-full max-w-full"
                                                youtubeIframeClassName="rounded-lg sm:rounded-xl w-full"
                                            />
                                        </div>
                                    </div>

                                    {product.tags && product.tags.length > 0 && (
                                        <div className="bg-card/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border/50 shadow-lg">
                                            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Tags</h4>
                                            <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                                {product.tags.map((tag, idx) => (
                                                    <Link href={`/products/tags/${tag.tagsId}`} key={idx}>
                                                        <Badge variant="secondary" className="text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4 font-medium shadow-sm hover:shadow-md transition-shadow">
                                                            {tag.title}
                                                        </Badge>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="tech-stack" className="mt-3 sm:mt-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                                    {product.frameworks.map((framework, idx) => (
                                        <Card key={idx} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-border/50 group">
                                            <CardContent className="flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6">
                                                <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-linear-to-br from-muted to-muted/50 border-2 border-border/30 group-hover:border-primary/50 transition-colors shadow-md group-hover:shadow-lg">
                                                    {framework.thumbnail ? (
                                                        <Image
                                                            src={framework.thumbnail}
                                                            alt={framework.title}
                                                            fill
                                                            className="object-cover p-1.5 sm:p-2 group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-xl sm:text-2xl">🔧</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <h3 className="text-xs sm:text-sm text-center font-semibold group-hover:text-primary transition-colors wrap-break-word">
                                                    {framework.title}
                                                </h3>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="faqs" className="mt-3 sm:mt-4">
                                <div className="bg-card/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-border/50 shadow-lg w-full overflow-hidden">
                                    {product.faqs ? (
                                        <div className="w-full max-w-full overflow-x-hidden">
                                            <TypographyContent
                                                html={product.faqs}
                                                className="text-muted-foreground leading-relaxed w-full text-sm sm:text-base"
                                                youtubeWrapperClassName="my-4 sm:my-6 md:my-8 w-full max-w-full"
                                                youtubeContainerClassName="shadow-xl border-2 border-primary/20 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden w-full max-w-full"
                                                youtubeIframeClassName="rounded-lg sm:rounded-xl w-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 sm:py-8 md:py-12">
                                            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-muted mb-3 sm:mb-4">
                                                <span className="text-xl sm:text-2xl md:text-3xl">❓</span>
                                            </div>
                                            <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium w-full wrap-break-word px-4">
                                                No FAQs available for this product.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="reviews" className="mt-3 sm:mt-4">
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Rating Summary */}
                                    <div className="bg-linear-to-br from-card/80 to-card/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border/50 shadow-lg">
                                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                            Customer Reviews
                                        </h3>

                                        {product.ratingAverage && product.ratingCount ? (
                                            <div className="flex items-center gap-3 flex-wrap justify-between">
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                                        {product.ratingAverage?.toFixed(1)}
                                                    </span>

                                                    <div className="flex items-center gap-0.5 sm:gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-all ${i < Math.floor(product.ratingAverage || 0)
                                                                    ? 'text-yellow-500 fill-yellow-500 drop-shadow-sm'
                                                                    : 'text-gray-300 dark:text-gray-600'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-muted/50 rounded-lg">
                                                    <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                                                        {product.ratingCount} {product.ratingCount === 1 ? 'review' : 'reviews'}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 sm:py-8">
                                                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-muted mb-3 sm:mb-4">
                                                    <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-muted-foreground" />
                                                </div>
                                                <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium">No reviews yet</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Filter Controls */}
                                    {ratings.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 bg-card/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-border/50 shadow-lg">
                                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                                <Filter className="w-4 h-4" />
                                                <span>Filter:</span>
                                            </div>
                                            <Select
                                                value={ratingFilter === null ? "all" : ratingFilter.toString()}
                                                onValueChange={(value) => setRatingFilter(value === "all" ? null : parseInt(value))}
                                            >
                                                <SelectTrigger className="w-full sm:w-[180px]">
                                                    <SelectValue placeholder="All Ratings" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Ratings</SelectItem>
                                                    <SelectItem value="5">5 Stars</SelectItem>
                                                    <SelectItem value="4">4 Stars</SelectItem>
                                                    <SelectItem value="3">3 Stars</SelectItem>
                                                    <SelectItem value="2">2 Stars</SelectItem>
                                                    <SelectItem value="1">1 Star</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Select
                                                value={sortOrder}
                                                onValueChange={(value) => setSortOrder(value as "newest" | "oldest" | "highest" | "lowest")}
                                            >
                                                <SelectTrigger className="w-full sm:w-[180px]">
                                                    <SelectValue placeholder="Sort by" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="newest">Newest First</SelectItem>
                                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                                    <SelectItem value="highest">Highest Rating</SelectItem>
                                                    <SelectItem value="lowest">Lowest Rating</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {ratingFilter !== null && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setRatingFilter(null)}
                                                    className="text-xs sm:text-sm"
                                                >
                                                    Clear Filter
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    {/* Ratings List */}
                                    {ratingsLoading ? (
                                        <div className="space-y-3 sm:space-y-4">
                                            {Array.from({ length: 3 }).map((_, index) => (
                                                <Card key={index} className="border-2 border-border/50">
                                                    <CardContent className="p-4 sm:p-5 md:p-6">
                                                        <div className="flex items-start gap-3 sm:gap-4">
                                                            <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0" />
                                                            <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                                                                <div className="flex items-start justify-between gap-2 sm:gap-4 flex-wrap">
                                                                    <div className="flex-1 min-w-0 space-y-2">
                                                                        <Skeleton className="h-5 w-32" />
                                                                        <Skeleton className="h-3 w-24" />
                                                                    </div>
                                                                    <Skeleton className="h-6 w-24 rounded-lg shrink-0" />
                                                                </div>
                                                                <Skeleton className="h-4 w-full" />
                                                                <Skeleton className="h-4 w-3/4" />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : filteredRatings.length > 0 ? (
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] bg-card/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border/50 shadow-lg">
                                                <div className="flex flex-col gap-3">
                                                    {filteredRatings.slice(0, 5).map((ratingItem) => (
                                                        <RatingsCard
                                                            key={ratingItem._id}
                                                            item={ratingItem}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {ratings.length > 1 && (
                                                <div className="flex justify-center">
                                                    <Link href={`/products/${product.productsId}/ratings`}>
                                                        <Button variant="outline" className="w-full sm:w-auto">
                                                            Lihat Semua ({ratings.length} reviews)
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ) : ratings.length > 0 && filteredRatings.length === 0 ? (
                                        <div className="text-center py-8 sm:py-12 md:py-16">
                                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-muted mb-3 sm:mb-4">
                                                <Filter className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-muted-foreground" />
                                            </div>
                                            <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium">
                                                No reviews match your filter criteria
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setRatingFilter(null)}
                                                className="mt-4"
                                            >
                                                Clear Filter
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 sm:py-12 md:py-16">
                                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-muted mb-3 sm:mb-4">
                                                <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-muted-foreground" />
                                            </div>
                                            <p className="text-muted-foreground text-sm sm:text-base md:text-lg font-medium">
                                                Belum ada ulasan untuk produk ini
                                            </p>
                                            <p className="text-muted-foreground text-xs sm:text-sm mt-2">
                                                Jadilah yang pertama memberikan ulasan!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Sidebar - Purchase Info */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4 sm:top-20 border-2 border-border/50 shadow-2xl bg-linear-to-br from-card to-card/95 backdrop-blur-sm">
                            <CardContent className="space-y-4 sm:space-y-5 md:space-y-6">
                                {/* Pricing Section */}
                                <div className="space-y-4 sm:space-y-5">
                                    <div className="bg-linear-to-br from-muted/50 to-muted/30 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-border/30">
                                        {product.paymentType === 'free' ? (
                                            <div className="space-y-2">
                                                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-linear-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                                                    Free
                                                </p>
                                                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Lifetime access included</p>
                                            </div>
                                        ) : hasActiveDiscount ? (
                                            <div className="space-y-2 sm:space-y-3">
                                                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                                                    <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent wrap-break-word">
                                                        Rp {formatIDR(discountedPrice)}
                                                    </p>
                                                    <p className="text-base sm:text-lg text-muted-foreground line-through font-medium">
                                                        Rp {formatIDR(originalPrice)}
                                                    </p>
                                                </div>
                                                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-green-600 font-bold wrap-break-word">
                                                        💰 Save Rp {formatIDR(originalPrice - discountedPrice)} ({discountPercentage}%)
                                                    </p>
                                                </div>
                                                <p className="text-xs sm:text-sm text-muted-foreground font-medium">One-time payment + Lifetime updates</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent wrap-break-word">
                                                    Rp {formatIDR(originalPrice)}
                                                </p>
                                                <p className="text-xs sm:text-sm text-muted-foreground font-medium">One-time payment + Lifetime updates</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stock and Sold Info */}
                                    <div className="flex items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-lg sm:rounded-xl border border-border/30">
                                        <div className="flex flex-col gap-1 w-full">
                                            <span className="text-xs text-muted-foreground font-medium">Stock</span>
                                            <span className="text-base sm:text-lg font-bold">{product.stock.toLocaleString()}</span>
                                        </div>
                                        {product.sold !== undefined && (
                                            <div className="flex flex-col gap-1 w-full">
                                                <span className="text-xs text-muted-foreground font-medium">Sold</span>
                                                <span className="text-base sm:text-lg font-bold">{product.sold.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Button
                                            size="lg"
                                            onClick={handleBuyNow}
                                            className="flex-1 h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                        >
                                            Buy Now
                                        </Button>
                                        <button
                                            onClick={handleShare}
                                            className="p-2.5 sm:p-3 h-11 sm:h-12 w-11 sm:w-12 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 transform hover:scale-110 border border-border/50 hover:border-primary/30 flex items-center justify-center shrink-0"
                                            title="Share"
                                        >
                                            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* License */}
                                <div className="bg-linear-to-br from-muted/40 to-muted/10 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 border border-border/40 shadow-md space-y-3 sm:space-y-4">
                                    <h4 className="font-bold text-base sm:text-lg">License Details</h4>

                                    <div className="space-y-2 sm:space-y-3">
                                        {
                                            product.licenses && product.licenses.length > 0 && (
                                                <span className="space-y-2">{product.licenses.map((license) => (
                                                    <span key={license} className="flex items-center gap-2 text-sm sm:text-base">
                                                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />
                                                        <span className="wrap-break-word">{license}</span>
                                                    </span>
                                                ))}
                                                </span>
                                            )
                                        }
                                    </div>
                                </div>

                                {/* About the Author */}
                                <div className="pt-4 sm:pt-5 md:pt-6 border-t border-border/50 space-y-4 sm:space-y-5">
                                    <div className="bg-linear-to-br from-muted/30 to-muted/10 rounded-lg sm:rounded-xl p-4 sm:p-5 border border-border/30">
                                        <div className="flex flex-col gap-3 sm:gap-4">
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <Avatar className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-primary/20 shadow-lg shrink-0">
                                                    <AvatarImage src={product.author.picture} alt={product.author.name} />
                                                    <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 font-bold text-base sm:text-lg">
                                                        {product.author.name.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
                                                    <p className="font-bold text-sm sm:text-base wrap-break-word">{product.author.name}</p>
                                                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                                                        {product.author.role === 'admins' ? '⭐ Elite Author' : 'Author'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-start gap-3 sm:gap-4 pt-2">
                                                <div className="flex flex-col gap-1 px-2 sm:px-2.5 py-1 w-full">
                                                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground">Products</h3>
                                                    <span className="text-xs font-semibold text-muted-foreground">
                                                        {authorProductsCount} {authorProductsCount === 1 ? 'Product' : 'Products'}
                                                    </span>
                                                </div>

                                                <div className="flex flex-col gap-1 px-2 sm:px-2.5 py-1 w-full">
                                                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground">Rating</h3>
                                                    <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap">
                                                        {authorAverageRating && authorAverageRating > 0 ? (
                                                            [...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(authorAverageRating || 0)
                                                                        ? 'text-yellow-500 fill-yellow-500'
                                                                        : 'text-gray-300 dark:text-gray-600'
                                                                        }`}
                                                                />
                                                            ))
                                                        ) : (
                                                            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300 dark:text-gray-600" />
                                                        )}
                                                        <span className="text-xs font-semibold text-muted-foreground">
                                                            ( {authorAverageRating && authorAverageRating > 0
                                                                ? authorAverageRating.toFixed(1)
                                                                : 'No rating'} )
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Link href={`/${product.author._id}`}>
                                                <Button variant="outline" size="sm" className="mt-2 sm:mt-3 w-full border-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 text-xs sm:text-sm">
                                                    View Profile
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-10 md:pt-12 border-t border-border/50">
                        <div className="mb-6 sm:mb-8 md:mb-10">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Related Products
                            </h2>
                            <p className="text-muted-foreground text-sm sm:text-base md:text-lg">Discover more products you might like</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                            {relatedProducts.map((item) => (
                                <ProductsCard key={item.productsId} item={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
