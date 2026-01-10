"use client"

import { useState, useEffect } from "react"

import Link from "next/link"

import { Button } from "@/components/ui/button"

import { Card, CardContent } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import ProductsCard from "@/components/ui/products/ProductsCard"

import { ArrowLeft, Mail, User, Star } from "lucide-react"

import Image from "next/image"

interface AdminProfileProps {
    adminId: string
    initialAdmin?: AdminData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialProducts?: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialArticles?: any[]
}

interface AdminData {
    _id: string
    name: string
    email: string
    picture?: string
    role: string
    status: string
    created_at: string
    stats: {
        products: number
        articles: number
        rating: number
        downloads: number
    }
}

export default function AdminProfile({ adminId, initialAdmin, initialProducts = [], initialArticles = [] }: AdminProfileProps) {
    const [admin, setAdmin] = useState<AdminData | null>(initialAdmin || null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, setProducts] = useState<any[]>(initialProducts)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [articles, setArticles] = useState<any[]>(initialArticles)
    const [activeTab, setActiveTab] = useState("products")
    const [isLoading, setIsLoading] = useState(!initialAdmin)

    useEffect(() => {
        if (!initialAdmin) {
            fetchAdmin()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminId])

    const fetchAdmin = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`/api/admins/${adminId}`)
            if (!response.ok) throw new Error("Failed to fetch admin")
            const data = await response.json()
            setAdmin(data)
        } catch (error) {
            console.error("Error fetching admin:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchProducts = async () => {
        try {
            const response = await fetch(`/api/admins/${adminId}/products?page=1&limit=12`)
            if (!response.ok) throw new Error("Failed to fetch products")
            const data = await response.json()
            setProducts(data.data || [])
        } catch (error) {
            console.error("Error fetching products:", error)
        }
    }

    const fetchArticles = async () => {
        try {
            const response = await fetch(`/api/admins/${adminId}/articles?page=1&limit=12`)
            if (!response.ok) throw new Error("Failed to fetch articles")
            const data = await response.json()
            setArticles(data.data || [])
        } catch (error) {
            console.error("Error fetching articles:", error)
        }
    }

    useEffect(() => {
        if (activeTab === "products" && products.length === 0) {
            fetchProducts()
        } else if (activeTab === "articles" && articles.length === 0) {
            fetchArticles()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab])

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-8">
                    <div className="h-8 w-32 bg-muted rounded"></div>
                    <div className="h-48 bg-muted rounded"></div>
                    <div className="grid grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-muted rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
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
        <div className="container mx-auto px-4 py-8 space-y-8">
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

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button variant="outline" size="lg" className="gap-2">
                                <Mail className="w-4 h-4" />
                                Contact
                            </Button>
                            <Button size="lg" className="gap-2">
                                <User className="w-4 h-4" />
                                Follow
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold">{admin.stats.products}</p>
                        <p className="text-sm text-muted-foreground mt-1">Products</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bold">{admin.stats.articles}</p>
                        <p className="text-sm text-muted-foreground mt-1">Articles</p>
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
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full md:w-auto">
                    <TabsTrigger value="products">
                        Products ({admin.stats.products})
                    </TabsTrigger>
                    <TabsTrigger value="articles">
                        Articles ({admin.stats.articles})
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

                <TabsContent value="articles" className="mt-6">
                    {articles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {articles.map((article) => (
                                <Link
                                    key={article.articlesId || article._id}
                                    href={`/articles/${article.articlesId}`}
                                    className="group"
                                >
                                    <Card className="h-full transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/50">
                                        <div className="relative aspect-video overflow-hidden bg-muted">
                                            <Image
                                                src={article.thumbnail}
                                                alt={article.title}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        <CardContent className="p-4 space-y-2">
                                            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {article.description}
                                            </p>
                                            {article.tags && article.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {article.tags.slice(0, 3).map((tag: { _id: string; title: string }) => (
                                                        <Badge key={tag._id} variant="outline" className="text-xs">
                                                            {tag.title}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No articles found</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Reviews coming soon</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

