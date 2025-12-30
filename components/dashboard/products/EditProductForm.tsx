'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/utils/context/AuthContext";

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

interface Product {
    _id: string;
    title: string;
    productsId: string;
    thumbnail: string;
    frameworks: {
        title: string;
        frameworkId: string;
        thumbnail: string;
    }[];
    description: string;
    faqs: string;
    price: number;
    stock: number;
    sold?: number;
    category: {
        title: string;
        categoryId: string;
    }[];
    rating?: number;
    views?: number;
    ratingCount?: number;
    reviews?: {
        _id: string;
        name: string;
        date: string;
        picture: string;
        rating: number;
        comment: string;
    }[];
    images?: string[];
    discount?: {
        type: "percentage" | "fixed";
        value: number;
        until?: string;
    };
    author: {
        _id: string;
        name: string;
        picture?: string;
        role: string;
    };
    tags?: string[];
    paymentType: "free" | "paid";
    status: "publish" | "draft";
    created_at?: string;
    updated_at?: string;
}

interface FormData {
    title: string;
    productsId: string;
    thumbnail: string;
    description: string;
    faqs: string;
    price: number;
    stock: number;
    category: string;
    frameworks: string[]; // This will contain frameworkId values
    paymentType: 'free' | 'paid';
    status: 'publish' | 'draft';
    tags: string;
    images: string[];
    discount?: {
        type: "percentage" | "fixed";
        value: number;
        until?: string;
    };
}

export default function EditProductForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const productId = searchParams.get('id');

    const [categories, setCategories] = useState<Category[]>([]);
    const [frameworks, setFrameworks] = useState<Framework[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const [formData, setFormData] = useState<FormData>({
        title: '',
        productsId: '',
        thumbnail: '',
        description: '',
        faqs: '',
        price: 0,
        stock: 0,
        category: '',
        frameworks: [],
        paymentType: 'paid',
        status: 'draft',
        tags: '',
        images: [],
        discount: undefined,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);

    // Combined effect for validation and data fetching
    useEffect(() => {
        if (!productId) {
            router.push('/dashboard/products/products');
            return;
        }

        const fetchCollectionsAndProduct = async () => {
            try {
                // Fetch collections first
                const [categoriesRes, frameworksRes] = await Promise.all([
                    fetch('/api/products/categories', {
                        headers: {
                            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`
                        }
                    }),
                    fetch('/api/products/framework', {
                        headers: {
                            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`
                        }
                    })
                ]);

                let categoriesData = [];
                let frameworksData = [];

                if (categoriesRes.ok) {
                    categoriesData = await categoriesRes.json();
                    setCategories(categoriesData);
                }

                if (frameworksRes.ok) {
                    frameworksData = await frameworksRes.json();
                    setFrameworks(frameworksData);
                }

                // Then fetch product data
                const response = await fetch(`/api/products?id=${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch product');
                }
                const product: Product = await response.json();

                // Set form data with existing product data
                setFormData(prevFormData => ({
                    ...prevFormData,
                    title: product.title,
                    productsId: product.productsId,
                    thumbnail: product.thumbnail,
                    description: product.description,
                    faqs: product.faqs,
                    price: product.price,
                    stock: product.stock,
                    category: product.category && product.category.length > 0
                        ? product.category[0].categoryId
                        : '',
                    frameworks: product.frameworks
                        ? product.frameworks.map(fw => fw.frameworkId)
                        : [],
                    paymentType: product.paymentType,
                    status: product.status,
                    tags: product.tags ? product.tags.join(', ') : '',
                    images: product.images || [],
                    discount: product.discount || undefined,
                }));
            } catch (error) {
                console.error('Error fetching collections or product:', error);
                toast.error('Failed to load product data');
                router.push('/dashboard/products/products');
            } finally {
                setLoading(false);
                setIsPageLoading(false);
            }
        };

        fetchCollectionsAndProduct();
    }, [productId, router]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        setIsImageUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = await fetch('/api/products/upload', {
                method: 'POST',
                body: formData,
            });

            clearInterval(interval);
            setUploadProgress(100);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload image');
            }

            const result = await response.json();

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, result.url]
            }));

            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to upload image');
        } finally {
            setIsImageUploading(false);
            setUploadProgress(0);
            // Reset the file input
            if (e.target) {
                e.target.value = '';
            }
        }
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        setIsThumbnailUploading(true);
        setThumbnailUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Simulate upload progress
            const interval = setInterval(() => {
                setThumbnailUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = await fetch('/api/products/upload', {
                method: 'POST',
                body: formData,
            });

            clearInterval(interval);
            setThumbnailUploadProgress(100);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload thumbnail');
            }

            const result = await response.json();

            setFormData(prev => ({
                ...prev,
                thumbnail: result.url
            }));

            toast.success('Thumbnail uploaded successfully!');
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to upload thumbnail');
        } finally {
            setIsThumbnailUploading(false);
            setThumbnailUploadProgress(0);
            // Reset the file input
            if (e.target) {
                e.target.value = '';
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Update existing product
            const response = await fetch(`/api/products?id=${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`
                },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                    category: formData.category
                        ? [{
                            title: categories.find(cat => cat._id === formData.category)?.title || '',
                            categoryId: formData.category
                        }]
                        : [],
                    frameworks: formData.frameworks.length > 0
                        ? frameworks.filter(fw => formData.frameworks.includes(fw.frameworkId))
                        : [],
                    discount: formData.discount?.type && formData.discount?.value ? {
                        type: formData.discount.type,
                        value: formData.discount.value,
                        until: formData.discount.until || undefined
                    } : undefined,
                    images: formData.images ? formData.images : [],
                    author: user ? {
                        _id: user._id,
                        name: user.name,
                        picture: user.picture,
                        role: user.role
                    } : undefined
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update product');
            }

            await response.json();
            toast.success('Product updated successfully!');
            router.push(`/dashboard/products/products`);
        } catch (error) {
            console.error('Error processing product:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to process product');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPageLoading) {
        return (
            <div className="container flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Product</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Product title"
                                />
                            </div>

                            <div>
                                <Label htmlFor="productsId">Product ID *</Label>
                                <Input
                                    id="productsId"
                                    name="productsId"
                                    value={formData.productsId}
                                    onChange={handleChange}
                                    required
                                    placeholder="Unique product identifier"
                                    readOnly
                                />
                            </div>

                            <div>
                                <Label htmlFor="thumbnail">Thumbnail *</Label>
                                <div className="space-y-2">
                                    {formData.thumbnail && (
                                        <div className="relative w-full h-32 max-w-xs">
                                            <Image
                                                src={formData.thumbnail}
                                                alt="Thumbnail preview"
                                                fill
                                                className="object-cover rounded border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, thumbnail: '' }))}
                                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                                            >
                                                <span className="w-4 h-4 flex items-center justify-center">×</span>
                                            </button>
                                        </div>
                                    )}
                                    <div className="relative w-full">
                                        <Input
                                            type="file"
                                            id="thumbnail-upload"
                                            accept="image/*"
                                            onChange={handleThumbnailUpload}
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => document.getElementById('thumbnail-upload')?.click()}
                                            disabled={isThumbnailUploading}
                                            className="w-full"
                                        >
                                            {isThumbnailUploading && formData.thumbnail ? 'Uploading new...' : !formData.thumbnail ? 'Choose Thumbnail' : 'Change Thumbnail'}
                                        </Button>
                                        {thumbnailUploadProgress > 0 && (
                                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${thumbnailUploadProgress}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Images Upload Section */}
                            <div className="border rounded-lg p-4 bg-muted">
                                <h3 className="font-medium mb-3">Product Images</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-60 overflow-y-auto p-2">
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <Image
                                                    src={image}
                                                    alt={`Product image ${index + 1}`}
                                                    width={80}
                                                    height={80}
                                                    className="w-full h-20 object-cover rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        images: prev.images.filter((_, i) => i !== index)
                                                    }))}
                                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <span className="w-4 h-4 flex items-center justify-center">×</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="relative flex-1">
                                            <Input
                                                type="file"
                                                id="image-upload"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                                disabled={isImageUploading}
                                                className="w-full"
                                            >
                                                {isImageUploading ? 'Uploading...' : 'Choose Image'}
                                            </Button>
                                            {uploadProgress > 0 && (
                                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${uploadProgress}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    placeholder="Product description"
                                />
                            </div>

                            <div>
                                <Label htmlFor="faqs">FAQs</Label>
                                <Textarea
                                    id="faqs"
                                    name="faqs"
                                    value={formData.faqs}
                                    onChange={handleChange}
                                    placeholder="Frequently asked questions (HTML format)"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price">Price *</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="stock">Stock *</Label>
                                    <Input
                                        id="stock"
                                        name="stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    {loading ? (
                                        <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background animate-pulse">
                                            Loading...
                                        </div>
                                    ) : (
                                        <Select name="category" value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                                            <SelectTrigger id="category">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category._id} value={category._id}>
                                                        {category.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="framework">Framework</Label>
                                    {loading ? (
                                        <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background animate-pulse">
                                            Loading...
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {frameworks.map((framework) => (
                                                <div
                                                    key={framework.frameworkId}
                                                    className={`border rounded-md p-3 cursor-pointer transition-colors ${formData.frameworks.includes(framework.frameworkId) ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-gray-300'}`}
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        frameworks: prev.frameworks.includes(framework.frameworkId)
                                                            ? prev.frameworks.filter(id => id !== framework.frameworkId)
                                                            : [...prev.frameworks, framework.frameworkId]
                                                    }))}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-4 h-4 rounded border ${formData.frameworks.includes(framework.frameworkId) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                                            {formData.frameworks.includes(framework.frameworkId) && (
                                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                                </svg>
                                                            )}
                                                        </div>
                                                        {framework.thumbnail && (
                                                            <Image
                                                                src={framework.thumbnail}
                                                                alt={framework.title}
                                                                width={32}
                                                                height={32}
                                                                className="w-8 h-8 object-contain rounded border"
                                                            />
                                                        )}
                                                        <span>{framework.title}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="paymentType">Payment Type *</Label>
                                    <Select name="paymentType" value={formData.paymentType} onValueChange={(value: "free" | "paid") => setFormData(prev => ({ ...prev, paymentType: value }))}>
                                        <SelectTrigger id="paymentType">
                                            <SelectValue placeholder="Select payment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="free">Free</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="status">Status *</Label>
                                    <Select name="status" value={formData.status} onValueChange={(value: "publish" | "draft") => setFormData(prev => ({ ...prev, status: value }))}>
                                        <SelectTrigger id="status">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="publish">Publish</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="tags">Tags</Label>
                                <Input
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="tag1, tag2, tag3"
                                />
                            </div>

                            {/* Discount Section */}
                            <div className="border rounded-lg p-4 bg-muted">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium">Discount</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-muted-foreground">Enable discount</span>
                                        <input
                                            type="checkbox"
                                            checked={!!formData.discount}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                discount: e.target.checked ? {
                                                    type: "percentage",
                                                    value: 0,
                                                    until: ""
                                                } : undefined
                                            }))}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                    </div>
                                </div>
                                {formData.discount && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="discountType">Type</Label>
                                            <Select
                                                name="discountType"
                                                value={formData.discount.type}
                                                onValueChange={(value: "percentage" | "fixed") => setFormData(prev => ({
                                                    ...prev,
                                                    discount: {
                                                        type: value,
                                                        value: prev.discount ? prev.discount.value : 0,
                                                        until: prev.discount ? prev.discount.until : ""
                                                    }
                                                }))}
                                            >
                                                <SelectTrigger id="discountType">
                                                    <SelectValue placeholder="Select discount type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="percentage">Percentage</SelectItem>
                                                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="discountValue">Value</Label>
                                            <Input
                                                id="discountValue"
                                                type="number"
                                                min="0"
                                                value={formData.discount.value}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    discount: {
                                                        type: prev.discount ? prev.discount.type : "percentage",
                                                        value: Number(e.target.value),
                                                        until: prev.discount ? prev.discount.until : ""
                                                    }
                                                }))}
                                                placeholder="Discount value"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="discountUntil">Until (Optional)</Label>
                                            <Input
                                                id="discountUntil"
                                                type="date"
                                                value={formData.discount.until || ""}
                                                onChange={(e) => setFormData(prev => ({
                                                    ...prev,
                                                    discount: {
                                                        type: prev.discount ? prev.discount.type : "percentage",
                                                        value: prev.discount ? prev.discount.value : 0,
                                                        until: e.target.value
                                                    }
                                                }))}
                                                placeholder="End date (YYYY-MM-DD)"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Author Information */}
                        <div className="border rounded-lg p-4 bg-muted">
                            <h3 className="font-medium mb-2">Author Information</h3>
                            <div className="flex items-center gap-3">
                                {user?.picture ? (
                                    <Image
                                        src={user.picture}
                                        alt={user.name}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                                        <span className="text-foreground text-sm">
                                            {user?.name?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium">{user?.name || 'Unknown'}</p>
                                    <p className="text-sm text-muted-foreground">{user?.role || 'User'}</p>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">This product will be associated with your account.</p>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Product'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}