"use client"

import Image from 'next/image'

import { Badge } from '@/components/ui/badge'

import { Button } from '@/components/ui/button'

import { Card, CardContent } from '@/components/ui/card'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import { Star, Share2, Download } from 'lucide-react'

import ProductsCard from '@/components/ui/products/ProductsCard'

import { formatIDR } from '@/hooks/FormatPrice'

import { TypographyContent } from '@/components/ui/typography'

import useFormatDate from '@/hooks/FormatDate'

import useStateProductsDetails from '@/components/content/products/productsDetails/lib/useStateProductsDetails'

interface ProductsDetailsProps {
    product: ProductsDetails
}

export default function ProductsDetails({ product }: ProductsDetailsProps) {
    const { formatDate } = useFormatDate()

    const {
        activeTab,
        setActiveTab,
        selectedImage,
        setSelectedImage,
        relatedProducts,
        ratings,
        originalPrice,
        discountedPrice,
        activeDiscount,
        hasActiveDiscount,
        discountPercentage,
        allImages,
        handleShare,
        handleBuyNow,
    } = useStateProductsDetails({ product })

    return (
        <section className='min-h-full overflow-visible relative py-8 pt-28 xl:pt-unset md:py-12'>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section with Badges */}
                <div className="mb-6 flex flex-wrap gap-3">
                    <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium shadow-sm">
                        {product.category.title}
                    </Badge>
                    <Badge variant="default" className="px-4 py-1.5 text-sm font-medium shadow-sm">
                        {product.type.title}
                    </Badge>
                    {hasActiveDiscount && activeDiscount && (
                        <Badge variant="destructive" className="px-4 py-1.5 text-sm font-semibold shadow-md animate-pulse">
                            🔥 -{discountPercentage}% OFF
                        </Badge>
                    )}
                </div>

                {/* Product Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                    {product.title}
                </h1>

                {/* Short Description */}
                <div className="mb-8 w-full max-w-full overflow-x-hidden">
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
                <div className="flex flex-wrap items-center gap-6 mb-10 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm">
                    {product.ratingAverage && (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 transition-all ${i < Math.floor(product.ratingAverage || 0)
                                            ? 'text-yellow-500 fill-yellow-500 drop-shadow-sm'
                                            : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-semibold">
                                {product.ratingAverage?.toFixed(1)} <span className="text-muted-foreground font-normal">({product.ratingCount || 0} reviews)</span>
                            </span>
                        </div>
                    )}

                    {product.downloadCount !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
                            <Download className="w-4 h-4" />
                            <span className="font-medium">{product.downloadCount.toLocaleString()} downloads</span>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
                    {/* Left Column - Images and Tabs */}
                    <div className="lg:col-span-2 space-y-8">
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
                            <div className="grid grid-cols-3 gap-4">
                                {allImages.slice(0, 3).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${selectedImage === img
                                            ? 'border-primary ring-4 ring-primary/20 shadow-lg shadow-primary/20 scale-105'
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
                            <TabsList className="w-full justify-start bg-muted/50 p-1.5 rounded-xl border border-border/50 shadow-sm">
                                <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium">
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger value="tech-stack" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium">
                                    Tech Stack
                                </TabsTrigger>
                                <TabsTrigger value="faqs" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium">
                                    FAQs
                                </TabsTrigger>
                                <TabsTrigger value="reviews" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium">
                                    Reviews
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-8">
                                <div className="space-y-8">
                                    <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-border/50 shadow-lg w-full overflow-hidden">
                                        <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent w-full wrap-break-word">
                                            Product Description
                                        </h3>
                                        <div className="w-full max-w-full overflow-x-hidden">
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
                                        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg">
                                            <h4 className="font-semibold mb-4 text-lg">Tags</h4>
                                            <div className="flex flex-wrap gap-2.5">
                                                {product.tags.map((tag, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-sm py-2 px-4 font-medium shadow-sm hover:shadow-md transition-shadow">
                                                        {tag.title}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="tech-stack" className="mt-8">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {product.frameworks.map((framework, idx) => (
                                        <Card key={idx} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-border/50 group">
                                            <CardContent className="flex flex-col items-center justify-center gap-3 p-6">
                                                <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-linear-to-br from-muted to-muted/50 border-2 border-border/30 group-hover:border-primary/50 transition-colors shadow-md group-hover:shadow-lg">
                                                    {framework.thumbnail ? (
                                                        <Image
                                                            src={framework.thumbnail}
                                                            alt={framework.title}
                                                            fill
                                                            className="object-cover p-2 group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-2xl">🔧</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <h3 className="text-sm text-center font-semibold group-hover:text-primary transition-colors">
                                                    {framework.title}
                                                </h3>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="faqs" className="mt-8">
                                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-border/50 shadow-lg w-full overflow-hidden">
                                    {product.faqs ? (
                                        <div className="w-full max-w-full overflow-x-hidden">
                                            <TypographyContent
                                                html={product.faqs}
                                                className="text-muted-foreground leading-relaxed w-full"
                                                youtubeWrapperClassName="my-6 sm:my-8 w-full max-w-full"
                                                youtubeContainerClassName="shadow-xl border-2 border-primary/20 rounded-xl sm:rounded-2xl overflow-hidden w-full max-w-full"
                                                youtubeIframeClassName="rounded-lg sm:rounded-xl w-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 sm:py-12">
                                            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted mb-4">
                                                <span className="text-2xl sm:text-3xl">❓</span>
                                            </div>
                                            <p className="text-muted-foreground text-base sm:text-lg font-medium w-full wrap-break-word px-4">
                                                No FAQs available for this product.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="reviews" className="mt-8">
                                <div className="space-y-8">
                                    {/* Rating Summary */}
                                    <div className="bg-linear-to-br from-card/80 to-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg">
                                        <h3 className="text-3xl font-bold mb-6 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                            Customer Reviews
                                        </h3>
                                        {product.ratingAverage && product.ratingCount ? (
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-5xl font-extrabold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                                        {product.ratingAverage?.toFixed(1)}
                                                    </span>
                                                    <span className="text-xl text-muted-foreground">/ 5.0</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-6 h-6 transition-all ${i < Math.floor(product.ratingAverage || 0)
                                                                ? 'text-yellow-500 fill-yellow-500 drop-shadow-sm'
                                                                : 'text-gray-300 dark:text-gray-600'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="px-4 py-2 bg-muted/50 rounded-lg">
                                                    <span className="text-sm font-semibold text-muted-foreground">
                                                        {product.ratingCount} {product.ratingCount === 1 ? 'review' : 'reviews'}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                                    <Star className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                                <p className="text-muted-foreground text-lg font-medium">No reviews yet</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Ratings List */}
                                    <div className="space-y-4">
                                        {ratings.map((ratingItem) => (
                                            <Card key={ratingItem._id} className="border-2 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start gap-4">
                                                        <Avatar className="w-12 h-12 ring-2 ring-border/50 shadow-md">
                                                            <AvatarImage
                                                                src={ratingItem.author.picture}
                                                                alt={ratingItem.author.name}
                                                            />
                                                            <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 font-semibold">
                                                                {ratingItem.author.name.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 space-y-3">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="flex-1">
                                                                    <p className="font-semibold text-lg mb-1">
                                                                        {ratingItem.author.name}
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {formatDate(ratingItem.created_at)}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-1 bg-muted/50 px-3 py-1.5 rounded-lg">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`w-4 h-4 ${i < ratingItem.rating
                                                                                ? 'text-yellow-500 fill-yellow-500'
                                                                                : 'text-gray-300 dark:text-gray-600'
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                                                {ratingItem.comment}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Sidebar - Purchase Info */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24 border-2 border-border/50 shadow-2xl bg-linear-to-br from-card to-card/95 backdrop-blur-sm">
                            <CardContent className="space-y-6 p-6">
                                {/* Pricing Section */}
                                <div className="space-y-5">
                                    <div className="bg-linear-to-br from-muted/50 to-muted/30 rounded-xl p-5 border border-border/30">
                                        <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Regular License</h3>
                                        {product.paymentType === 'free' ? (
                                            <div className="space-y-2">
                                                <p className="text-4xl font-extrabold bg-linear-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                                                    Free
                                                </p>
                                                <p className="text-sm text-muted-foreground font-medium">Lifetime access included</p>
                                            </div>
                                        ) : hasActiveDiscount ? (
                                            <div className="space-y-3">
                                                <div className="flex items-baseline gap-3">
                                                    <p className="text-4xl font-extrabold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                                        Rp {formatIDR(discountedPrice)}
                                                    </p>
                                                    <p className="text-lg text-muted-foreground line-through font-medium">
                                                        Rp {formatIDR(originalPrice)}
                                                    </p>
                                                </div>
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                    <p className="text-sm text-green-600 font-bold">
                                                        💰 Save Rp {formatIDR(originalPrice - discountedPrice)} ({discountPercentage}%)
                                                    </p>
                                                </div>
                                                <p className="text-sm text-muted-foreground font-medium">One-time payment + Lifetime updates</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-4xl font-extrabold bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                                                    Rp {formatIDR(originalPrice)}
                                                </p>
                                                <p className="text-sm text-muted-foreground font-medium">One-time payment + Lifetime updates</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            size="lg"
                                            onClick={handleBuyNow}
                                            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                                        >
                                            Buy Now
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            disabled
                                            className="w-full h-12 text-base font-semibold border-2"
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>

                                    {/* Action Icons */}
                                    <div className="flex items-center justify-center gap-4 pt-2 border-t border-border/50">
                                        <button
                                            onClick={handleShare}
                                            className="p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 transform hover:scale-110 border border-border/50 hover:border-primary/30"
                                            title="Share"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300 transform hover:scale-110 border border-border/50 hover:border-primary/30"
                                            title="Download"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* About the Author */}
                                <div className="pt-6 border-t border-border/50 space-y-5">
                                    <h4 className="font-bold text-lg">About the Author</h4>
                                    <div className="bg-linear-to-br from-muted/30 to-muted/10 rounded-xl p-5 border border-border/30">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="w-14 h-14 ring-2 ring-primary/20 shadow-lg">
                                                <AvatarImage src={product.author.picture} alt={product.author.name} />
                                                <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 font-bold text-lg">
                                                    {product.author.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-2">
                                                <div>
                                                    <p className="font-bold text-base">{product.author.name}</p>
                                                    <p className="text-sm text-muted-foreground font-medium">
                                                        {product.author.role === 'admin' ? '⭐ Elite Author' : 'Author'}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4 pt-2">
                                                    <div className="px-2.5 py-1 bg-background/50 rounded-md border border-border/30">
                                                        <span className="text-xs font-semibold text-muted-foreground">Products 23</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 px-2.5 py-1 bg-background/50 rounded-md border border-border/30">
                                                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                                        <span className="text-xs font-semibold">4.9</span>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="sm" className="mt-3 w-full border-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300">
                                                    View Profile
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 pt-12 border-t border-border/50">
                        <div className="mb-10">
                            <h2 className="text-4xl font-extrabold mb-3 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Related Products
                            </h2>
                            <p className="text-muted-foreground text-lg">Discover more products you might like</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
