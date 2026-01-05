"use client"

import { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import Image from 'next/image'

import { Badge } from '@/components/ui/badge'

import { Button } from '@/components/ui/button'

import { Card, CardContent } from '@/components/ui/card'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import { Star, Share2, Download, Loader2 } from 'lucide-react'

import { useDiscount } from '@/hooks/discountServices'

import ProductsCard from '@/components/ui/products/ProductsCard'

import { fetchProducts, fetchProductsRatings } from '@/utils/fetching/FetchProducts'

import { formatIDR } from '@/hooks/FormatPrice'

import { TypographyContent } from '@/components/ui/typography'

import { useAuth } from '@/utils/context/AuthContext'

import { toast } from 'sonner'

import useFormatDate from '@/hooks/FormatDate'

interface ProductsDetailsProps {
    product: ProductsDetails
}

interface Rating {
    _id: string
    productsId: string
    rating: number
    comment: string
    author: {
        _id: string
        name: string
        picture?: string
        role: string
    }
    created_at: string
    updated_at: string
}

export default function ProductsDetails({ product }: ProductsDetailsProps) {
    const router = useRouter()
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('overview')
    const [selectedImage, setSelectedImage] = useState(product.thumbnail)
    const [relatedProducts, setRelatedProducts] = useState<Products[]>([])
    const [ratings, setRatings] = useState<Rating[]>([])
    const [isLoadingRatings, setIsLoadingRatings] = useState(false)
    const { formatDate } = useFormatDate()

    const { originalPrice, discountedPrice, activeDiscount, hasActiveDiscount } = useDiscount(
        product.price,
        product.discount
    )

    const discountPercentage = hasActiveDiscount && activeDiscount?.type === 'percentage'
        ? activeDiscount.value
        : hasActiveDiscount && activeDiscount?.type === 'fixed'
            ? Math.round((activeDiscount.value / originalPrice) * 100)
            : 0

    const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean)

    useEffect(() => {
        // Fetch related products by category
        const loadRelatedProducts = async () => {
            try {
                const products = await fetchProducts()
                const related = products
                    .filter(p =>
                        p.category.categoryId === product.category.categoryId &&
                        p.productsId !== product.productsId &&
                        p.status === 'publish'
                    )
                    .slice(0, 3)
                setRelatedProducts(related)
            } catch (error) {
                console.error('Error fetching related products:', error)
            }
        }
        loadRelatedProducts()
    }, [product.category.categoryId, product.productsId])

    useEffect(() => {
        // Fetch ratings when reviews tab is active
        if (activeTab === 'reviews') {
            fetchRatings()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, product.productsId])

    const fetchRatings = async () => {
        setIsLoadingRatings(true)
        try {
            const ratings = await fetchProductsRatings(product.productsId, 1, 20)
            setRatings(ratings)
        } catch (error) {
            console.error('Error fetching ratings:', error)
        } finally {
            setIsLoadingRatings(false)
        }
    }


    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product.title,
                text: product.description,
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success("Link copied to clipboard!")
        }
    }

    const handleBuyNow = () => {
        // Check if user is logged in
        if (!user) {
            toast.error("Please login to continue checkout")
            router.push(`/signin?redirect=/checkout&products=${product._id}:1`)
            return
        }

        // Check if product is available
        if (product.status !== 'publish') {
            toast.error("This product is not available for purchase")
            return
        }

        // Redirect to checkout with product ID and quantity (default: 1)
        router.push(`/checkout?products=${product._id}:1`)
    }

    return (
        <section className='min-h-full overflow-visible relative py-14 pt-32 xl:pt-unset md:py-36'>
            <div className="container mx-auto px-4">
                {/* Header Section with Badges */}
                <div className="mb-6 flex flex-wrap gap-2">
                    <Badge variant="secondary">{product.category.title}</Badge>
                    <Badge variant="default">{product.type.title}</Badge>
                    {hasActiveDiscount && activeDiscount && (
                        <Badge variant="destructive">
                            -{discountPercentage}% OFF
                        </Badge>
                    )}
                </div>

                {/* Product Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>

                {/* Short Description */}
                <div className="mb-6 max-w-3xl">
                    <TypographyContent
                        html={product.description ? (
                            product.description.length > 200
                                ? `${product.description.substring(0, 200)}...`
                                : product.description
                        ) : ''}
                        className="text-muted-foreground text-lg"
                    />
                </div>

                {/* Rating and Downloads */}
                <div className="flex items-center gap-6 mb-8">
                    {product.rating && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating || 0)
                                            ? 'text-yellow-500 fill-yellow-500'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium">
                                {product.rating.toFixed(1)} ({product.ratingCount || 0} reviews)
                            </span>
                        </div>
                    )}

                    {product.downloadCount !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Download className="w-4 h-4" />
                            <span>{product.downloadCount.toLocaleString()} downloads</span>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Left Column - Images and Tabs */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Product Image */}
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted border">
                            <Image
                                src={selectedImage}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Thumbnail Images */}
                        {allImages.length > 1 && (
                            <div className="grid grid-cols-3 gap-4">
                                {allImages.slice(0, 3).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img
                                            ? 'border-primary ring-2 ring-primary'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.title} view ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Navigation Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="tech-stack">Tech Stack</TabsTrigger>
                                <TabsTrigger value="faqs">FAQs</TabsTrigger>
                                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="mt-6">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-4">Product Description</h3>
                                        <TypographyContent
                                            html={product.description || ''}
                                            className="text-muted-foreground"
                                            youtubeWrapperClassName="my-8"
                                            youtubeContainerClassName="shadow-lg border-2 border-primary/20"
                                            youtubeIframeClassName="rounded-xl"
                                        />
                                    </div>

                                    {product.tags && product.tags.length > 0 && (
                                        <>
                                            <h4 className="font-semibold mb-3 mt-6">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {product.tags.map((tag, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-sm py-1.5 px-3">
                                                        {tag.title}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="tech-stack" className="mt-6">
                                <div className="flex flex-wrap gap-3">
                                    {product.frameworks.map((framework, idx) => (
                                        <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow basis-[calc(33.333%-0.5rem)] sm:basis-[calc(25%-0.5625rem)] md:basis-[calc(20%-0.6rem)] max-w-[150px]">
                                            <CardContent className="flex flex-row items-center justify-center gap-2 py-0">
                                                <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-muted">
                                                    {framework.thumbnail ? (
                                                        <Image
                                                            src={framework.thumbnail}
                                                            alt={framework.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-xl">🔧</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <h3 className="text-sm text-center font-medium flex-1">
                                                    {framework.title}
                                                </h3>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="faqs" className="mt-6">
                                <div className="space-y-4">
                                    {product.faqs ? (
                                        <TypographyContent
                                            html={product.faqs}
                                            className="text-muted-foreground"
                                            youtubeWrapperClassName="my-8"
                                            youtubeContainerClassName="shadow-lg border-2 border-primary/20"
                                            youtubeIframeClassName="rounded-xl"
                                        />
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">
                                            No FAQs available for this product.
                                        </p>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="reviews" className="mt-6">
                                <div className="space-y-6">
                                    {/* Rating Summary */}
                                    <div className="flex items-center justify-between pb-4 border-b">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-2">Customer Reviews</h3>
                                            {product.rating && product.ratingCount ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-3xl font-bold">{product.rating.toFixed(1)}</span>
                                                        <span className="text-muted-foreground">/ 5.0</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-5 h-5 ${i < Math.floor(product.rating || 0)
                                                                    ? 'text-yellow-500 fill-yellow-500'
                                                                    : 'text-gray-300'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        ({product.ratingCount} {product.ratingCount === 1 ? 'review' : 'reviews'})
                                                    </span>
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground">No reviews yet</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Ratings List */}
                                    {isLoadingRatings ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        </div>
                                    ) : ratings.length > 0 ? (
                                        <div className="space-y-6">
                                            {ratings.map((ratingItem) => (
                                                <Card key={ratingItem._id}>
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start gap-4">
                                                            <Avatar className="w-10 h-10">
                                                                <AvatarImage
                                                                    src={ratingItem.author.picture}
                                                                    alt={ratingItem.author.name}
                                                                />
                                                                <AvatarFallback>
                                                                    {ratingItem.author.name.charAt(0).toUpperCase()}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="font-semibold">
                                                                            {ratingItem.author.name}
                                                                        </p>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {formatDate(ratingItem.created_at)}
                                                                        </p>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <Star
                                                                                key={i}
                                                                                className={`w-4 h-4 ${i < ratingItem.rating
                                                                                    ? 'text-yellow-500 fill-yellow-500'
                                                                                    : 'text-gray-300'
                                                                                    }`}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <p className="text-muted-foreground whitespace-pre-wrap">
                                                                    {ratingItem.comment}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <p>No reviews yet. Be the first to review this product!</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Sidebar - Purchase Info */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardContent className="space-y-6">
                                {/* Pricing Section */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Regular License</h3>
                                        {product.paymentType === 'free' ? (
                                            <div className="space-y-2">
                                                <p className="text-3xl font-bold text-green-600">Free</p>
                                            </div>
                                        ) : hasActiveDiscount ? (
                                            <div className="space-y-2">
                                                <div className="flex items-baseline gap-2">
                                                    <p className="text-3xl font-bold">
                                                        Rp {formatIDR(discountedPrice)}
                                                    </p>
                                                    <p className="text-lg text-muted-foreground line-through">
                                                        Rp {formatIDR(originalPrice)}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-green-600 font-medium">
                                                    Save Rp {formatIDR(originalPrice - discountedPrice)} ({discountPercentage}%)
                                                </p>
                                                <p className="text-sm text-muted-foreground">One-time payment + Lifetime updates</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-3xl font-bold">
                                                    Rp {formatIDR(originalPrice)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">One-time payment + Lifetime updates</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-row gap-2">
                                        <Button
                                            size="lg"
                                            onClick={handleBuyNow}
                                        >
                                            Buy Now
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            disabled
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>

                                    {/* Action Icons */}
                                    <div className="flex items-center justify-center gap-4 pt-2">
                                        <button
                                            onClick={handleShare}
                                            className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* About the Author */}
                                <div className="pt-6 border-t space-y-4">
                                    <h4 className="font-semibold">About the Author</h4>
                                    <div className="flex items-start gap-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={product.author.picture} alt={product.author.name} />
                                            <AvatarFallback>
                                                {product.author.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 space-y-1">
                                            <p className="font-medium">{product.author.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {product.author.role === 'admin' ? 'Elite Author' : 'Author'}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="text-sm text-muted-foreground">Products 23</span>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-sm font-medium">4.9</span>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="mt-2">
                                                View Profile
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
