"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Pencil, Trash2, Eye, Grid3X3, List } from "lucide-react";
import Image from "next/image";

import DeleteModalProducts from "@/components/dashboard/products/products/modal/DeleteModalProducts";
import useStateProduct from "./lib/useStateProduct";

export default function ProductsLayout() {
    const {
        // Data
        products,
        currentProducts,

        // Loading states
        isLoading,
        isSubmitting,

        // Modal states
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,

        // Delete states
        setDeleteId,
        deleteItemTitle,
        setDeleteItemTitle,

        // Pagination states
        currentPage,
        setCurrentPage,
        totalPages,

        // Search and view states
        searchTerm,
        viewMode,
        setViewMode,

        // Functions
        handleDelete,
        confirmDelete,
        handleSearchChange,
        formatDate,
        router,
    } = useStateProduct();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading products...</span>
            </div>
        );
    }

    return (
        <section className="flex flex-col gap-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 py-6 border rounded-2xl">
                <div className="flex flex-col gap-3">
                    <h3 className="text-3xl font-bold">Products</h3>

                    <ol className="flex gap-2 items-center text-sm text-muted-foreground">
                        <li className="flex items-center hover:text-primary transition-colors">
                            <span>Dashboard</span>
                            <svg
                                className="w-4 h-4 mx-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </li>
                        <li className="flex items-center text-primary font-medium">
                            <span>Products</span>
                        </li>
                    </ol>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-64 pl-9"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center border rounded-md p-1">
                        <Button
                            variant={viewMode === 'card' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('card')}
                            className="h-8 px-2"
                        >
                            <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'table' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('table')}
                            className="h-8 px-2"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                    <Button
                        variant="default"
                        className="px-6 py-2 font-medium"
                        onClick={() => router.push('/dashboard/products/products/new')}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Product
                    </Button>
                </div>
            </div>

            {/* Content Section */}
            {viewMode === 'card' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentProducts.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <div className="mx-auto h-12 w-12 text-muted-foreground/50">
                                <svg
                                    className="w-full h-full"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium">No products found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm
                                    ? `No products match your search for "${searchTerm}".`
                                    : 'Get started by creating a new product.'}
                            </p>
                        </div>
                    ) : (
                        currentProducts.map((product) => (
                            <Card key={product._id} className="overflow-hidden">
                                <div className="relative w-full aspect-4/3">
                                    {product.thumbnail ? (
                                        <Image
                                            src={product.thumbnail}
                                            alt={product.title}
                                            width={400}
                                            height={300}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                            <span className="text-muted-foreground">No image</span>
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-lg truncate">{product.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-lg font-bold">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <Badge variant={product.status === "publish" ? "default" : "secondary"}>
                                            {product.status}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => router.push(`/dashboard/products/products/${product.productsId}`)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => router.push(`/dashboard/products/products/edit?id=${product._id}`)}
                                        >
                                            <Pencil className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleDelete(product._id)}
                                            disabled={isSubmitting}
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            ) : (
                <div className="border rounded-2xl border-border bg-card shadow-sm overflow-hidden">
                    {currentProducts.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="mx-auto h-12 w-12 text-muted-foreground/50">
                                <svg
                                    className="w-full h-full"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium">No products found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm
                                    ? `No products match your search for "${searchTerm}".`
                                    : 'Get started by creating a new product.'}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Thumbnail</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Product ID</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Sold</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentProducts.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell className="px-4">
                                            {product.thumbnail ? (
                                                <Image
                                                    src={product.thumbnail}
                                                    alt={product.title}
                                                    width={64}
                                                    height={64}
                                                    className="w-16 h-16 object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                                                    <span className="text-xs text-muted-foreground">No image</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{product.title}</TableCell>
                                        <TableCell>{product.productsId}</TableCell>
                                        <TableCell>${product.price.toFixed(2)}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell>{product.sold || 0}</TableCell>
                                        <TableCell>
                                            {product.category && product.category.length > 0
                                                ? product.category.map(cat => cat.title).join(', ')
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={product.status === "publish" ? "default" : "secondary"}>
                                                {product.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{product.created_at ? formatDate(product.created_at) : 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => router.push(`/dashboard/products/products/${product.productsId}`)}
                                                    disabled={isSubmitting}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => router.push(`/dashboard/products/products/edit?id=${product._id}`)}
                                                    disabled={isSubmitting}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(product._id)}
                                                    disabled={isSubmitting}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            )}

            {/* Pagination Section */}
            {products.length > 0 && (
                <div className="flex justify-center">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    onClick={() => setCurrentPage(page)}
                                    className="w-10"
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
            <DeleteModalProducts
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onCancel={() => {
                    setIsDeleteDialogOpen(false);
                    setDeleteId(null);
                    setDeleteItemTitle(null);
                }}
                onConfirm={confirmDelete}
                isDeleting={isSubmitting}
                itemTitle={deleteItemTitle || undefined}
            />
        </section>
    );
}