'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useFormatDate from '@/hooks/FormatDate';

interface Category {
    _id: string;
    title: string;
    categoryId: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Framework {
    _id: string;
    title: string;
    frameworkId: string;
    thumbnail: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Author {
    _id: string;
    name: string;
    picture?: string;
    role: string;
}

interface Discount {
    type: 'percentage' | 'fixed';
    value: number;
    until?: string;
}

interface Product {
    _id: string;
    title: string;
    productsId: string;
    thumbnail: string;
    frameworks: Framework[];
    description: string;
    faqs: string;
    price: number;
    stock: number;
    sold?: number;
    category: Category[];
    rating?: number;
    views?: number;
    ratingCount?: number;
    images?: string[];
    discount?: Discount;
    author: Author;
    tags?: string[];
    paymentType: 'free' | 'paid';
    status: 'publish' | 'draft';
    created_at?: string;
    updated_at?: string;
}

export default function ProductDetailPage({ params }: { params: Promise<{ productsId: string }> }) {
    const { productsId } = React.use(params);
    const router = useRouter();
    const { formatDate } = useFormatDate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productsId) {
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productsId}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }

                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to load product details');
                router.push('/dashboard/products/products');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productsId, router]);

    if (loading) {
        return (
            <div className="container flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container flex items-center justify-center h-64">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-destructive">Product not found</h2>
                    <p className="text-muted-foreground mt-2">The requested product could not be found</p>
                    <Button
                        className="mt-4"
                        onClick={() => router.push('/dashboard/products/products')}
                    >
                        Back to Products
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{product.title}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <Badge variant={product.status === 'publish' ? 'default' : 'secondary'}>
                            {product.status}
                        </Badge>
                        <Badge variant={product.paymentType === 'free' ? 'outline' : 'default'}>
                            {product.paymentType === 'free' ? 'Free' : 'Paid'}
                        </Badge>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/dashboard/products/products/edit?id=${product._id}`)}
                    >
                        Edit Product
                    </Button>
                    <Button
                        onClick={() => router.push('/dashboard/products/products')}
                    >
                        Back to Products
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Images and Basic Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Thumbnail */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="relative w-full h-96 rounded-lg overflow-hidden">
                                {product.thumbnail ? (
                                    <Image
                                        src={product.thumbnail}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <span className="text-muted-foreground">No image available</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Images */}
                    {product.images && product.images.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Images</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {product.images.map((image, index) => (
                                        <div key={`${image}-${index}`} className="relative aspect-square">
                                            <Image
                                                src={image}
                                                alt={`Product image ${index + 1}`}
                                                fill
                                                className="object-cover rounded border"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-line">{product.description}</p>
                        </CardContent>
                    </Card>

                    {/* FAQs */}
                    {product.faqs && (
                        <Card>
                            <CardHeader>
                                <CardTitle>FAQs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: product.faqs }}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column - Details */}
                <div className="space-y-6">
                    {/* Price and Stock */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Price</span>
                                    <span className="text-2xl font-bold">
                                        {product.paymentType === 'free' ? 'Free' : `$${product.price.toFixed(2)}`}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Stock</span>
                                    <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {product.stock} available
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Sold</span>
                                    <span className="font-medium">{product.sold || 0}</span>
                                </div>

                                {product.discount && (
                                    <div className="pt-2 border-t">
                                        <div className="flex justify-between items-center">
                                            <span className="text-muted-foreground">Discount</span>
                                            <span className="font-medium text-destructive">
                                                {product.discount.type === 'percentage'
                                                    ? `${product.discount.value}%`
                                                    : `$${product.discount.value}`}
                                                {product.discount.until && ` until ${product.discount.until}`}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category and Frameworks */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Categories & Frameworks</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {product.category && product.category.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Categories</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {product.category.map((cat) => (
                                            <Badge key={cat._id || cat.categoryId} variant="secondary">
                                                {cat.title}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.frameworks && product.frameworks.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Frameworks</h4>
                                    <div className="space-y-2">
                                        {product.frameworks.map((framework) => (
                                            <div key={framework._id} className="flex items-center gap-2">
                                                {framework.thumbnail && (
                                                    <Image
                                                        src={framework.thumbnail}
                                                        alt={framework.title}
                                                        width={24}
                                                        height={24}
                                                        className="rounded"
                                                    />
                                                )}
                                                <span>{framework.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag, index) => (
                                        <Badge key={`${tag}-${index}`} variant="outline">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Author */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Author</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                {product.author.picture ? (
                                    <Image
                                        src={product.author.picture}
                                        alt={product.author.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                        <span className="text-muted-foreground">
                                            {product.author.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium">{product.author.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.author.role}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Metadata */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Product ID</span>
                                    <span>{product.productsId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created</span>
                                    <span>{product.created_at ? formatDate(product.created_at) : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Updated</span>
                                    <span>{product.updated_at ? formatDate(product.updated_at) : 'N/A'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}