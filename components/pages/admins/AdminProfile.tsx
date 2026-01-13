"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

import { Card, CardContent } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import ProductsCard from "@/components/ui/products/ProductsCard"

import RatingsCard from "@/components/ui/ratings/RatingsCard"

import { ArrowLeft, Mail, Star, ShoppingCart } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"

import { useStateAdminProfile } from "./lib/useStateAdminProfile"

import AdminProfileSkelaton from "@/components/pages/admins/AdminProfileSkelaton"

export default function AdminProfile({ adminId, initialAdmin, initialProducts = [], initialPopularProducts = [] }: AdminProfileProps) {
    const {
        admin,
        products,
        popularProducts,
        ratings,
        ratingsLoading,
        activeTab,
        setActiveTab,
        isLoading,
    } = useStateAdminProfile({
        adminId,
        initialAdmin,
        initialProducts,
        initialPopularProducts,
    })

    if (isLoading) {
        return <AdminProfileSkelaton />
    }

    if (!admin) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">Admin not found</h2>
                    <Link href="/">
                        <Button>Back to Home</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    }

    return (
        <section className="container mx-auto px-4 py-8 space-y-8">
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
            </Link>

            {/* Profile Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Avatar */}
                        <Avatar className="w-24 h-24">
                            <AvatarImage src={admin.picture} alt={admin.name} />
                            <AvatarFallback className="text-2xl">
                                {getInitials(admin.name)}
                            </AvatarFallback>
                        </Avatar>

                        {/* Profile Info */}
                        <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-bold">{admin.name}</h1>
                                <Badge variant="default" className="bg-blue-600 text-white">
                                    Verified Admin
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">Elite Author</p>
                            <p className="text-sm text-muted-foreground max-w-2xl">
                                Building amazing templates and components for developers. Passionate about clean code and modern development practices.
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {admin.email}
                                </span>
                                <span>Joined {formatDate(admin.created_at)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold">{admin.stats.products}</p>
                        <p className="text-sm text-muted-foreground mt-1">Products</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold">
                            {popularProducts.length > 0
                                ? popularProducts.length
                                : products.filter(p => (p.downloadCount || 0) > 0).length}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">Popular Products</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center gap-1">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <p className="text-3xl font-bold">{admin.stats.rating.toFixed(1)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Rating</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold">{admin.stats.downloads.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground mt-1">Downloads</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center gap-1">
                            <ShoppingCart className="w-5 h-5 text-green-500" />
                            <p className="text-3xl font-bold">{admin.stats.sold.toLocaleString()}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Sold</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full md:w-auto">
                    <TabsTrigger value="products">
                        Products ({admin.stats.products})
                    </TabsTrigger>
                    <TabsTrigger value="popular">
                        Popular Products
                    </TabsTrigger>
                    <TabsTrigger value="reviews">
                        Reviews
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="mt-6">
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductsCard key={product.productsId || product._id} item={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No products found</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="popular" className="mt-6">
                    {popularProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {popularProducts.map((product) => (
                                <ProductsCard key={product.productsId || product._id} item={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No popular products found</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                    {ratingsLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <Card key={index} className="border-2 border-border/50">
                                    <CardContent className="p-4 sm:p-5 md:p-6">
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shrink-0" />
                                            <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                                                <div className="flex items-start justify-between gap-2 sm:gap-4 flex-wrap">
                                                    <div className="flex-1 min-w-0 space-y-2">
                                                        <Skeleton className="h-5 w-32" />
                                                        <Skeleton className="h-4 w-24" />
                                                        <Skeleton className="h-4 w-40" />
                                                    </div>
                                                    <Skeleton className="h-6 w-24 rounded-lg shrink-0" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-full" />
                                                    <Skeleton className="h-4 w-full" />
                                                    <Skeleton className="h-4 w-3/4" />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : ratings.length > 0 ? (
                        <div className="space-y-4">
                            {ratings.map((ratingItem) => (
                                <RatingsCard
                                    key={ratingItem._id}
                                    item={ratingItem}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No reviews found</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </section>
    )
}

