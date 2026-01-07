"use client";

import Image from "next/image";

import { ShoppingCart, Loader2, ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";

import { formatIDR } from "@/hooks/FormatPrice";

import { getActiveDiscount } from "@/hooks/discountServices";

import Link from "next/link";

import FollowStepsModal from "@/components/checkout/FollowStepsModal";

import useStateCheckout from "@/components/checkout/lib/useStateCheckout";

export default function Checkout() {
    const {
        router,
        user,
        authLoading,
        products,
        isLoading,
        isProcessing,
        showFollowModal,
        totalAmount,
        originalTotal,
        discountTotal,
        hasPaidProducts,
        getProductPrice,
        handleCheckout,
        updateQuantity,
        removeProduct,
        setShowFollowModal,
        followSteps,
        isFollowProcessing,
        handleFollowStepClick,
        handleFollowStepComplete,
        handleFollowConfirm,
    } = useStateCheckout();


    if (authLoading || isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="py-12 text-center">
                        <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No products in checkout</p>
                        <Button asChild className="mt-4">
                            <Link href="/products">Browse Products</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <section className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-3xl font-bold">Checkout</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products List */}
                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {products.map((product) => {
                                const activeDiscount = getActiveDiscount(product.discount);
                                const hasActiveDiscount = !!activeDiscount;
                                const originalPrice = product.price;
                                const discountedPrice = getProductPrice(product);

                                return (
                                    <div key={product._id} className="flex gap-4">
                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                            <Image
                                                src={product.thumbnail}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-1">{product.title}</h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                {hasActiveDiscount ? (
                                                    <>
                                                        <span className="text-muted-foreground line-through text-sm">
                                                            {formatIDR(originalPrice)}
                                                        </span>
                                                        <span className="font-semibold text-primary">
                                                            {formatIDR(discountedPrice)}
                                                        </span>
                                                        <Badge variant="destructive" className="text-xs">
                                                            {product.discount?.type === "percentage"
                                                                ? `${product.discount.value}% OFF`
                                                                : `Rp ${formatIDR(product.discount?.value || 0)} OFF`}
                                                        </Badge>
                                                    </>
                                                ) : (
                                                    <span className="font-semibold">
                                                        {formatIDR(product.price)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">
                                                    Quantity:
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            updateQuantity(product._id, product.quantity - 1)
                                                        }
                                                        disabled={product.quantity <= 1}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="w-8 text-center">
                                                        {product.quantity}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            updateQuantity(product._id, product.quantity + 1)
                                                        }
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeProduct(product._id)}
                                                    className="ml-auto text-destructive"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                            <div className="mt-2">
                                                <span className="text-sm font-semibold">
                                                    Subtotal:{" "}
                                                    {formatIDR(discountedPrice * product.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Pengguna</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Nama</span>
                                <span className="font-medium">
                                    {user?.name || "Tidak tersedia"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Email</span>
                                <span className="font-medium">
                                    {user?.email || "Tidak tersedia"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Total</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                {products.map((product) => {
                                    const subtotal = getProductPrice(product) * product.quantity;

                                    return (
                                        <div
                                            key={product._id}
                                            className="flex justify-between text-sm"
                                        >
                                            <span className="text-muted-foreground">
                                                {product.title} x{product.quantity}
                                            </span>
                                            <span>{formatIDR(subtotal)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <Separator />
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatIDR(originalTotal)}</span>
                                </div>
                                {discountTotal > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Discount</span>
                                        <span className="text-green-600">
                                            -{formatIDR(discountTotal)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatIDR(totalAmount)}
                                </span>
                            </div>
                            {!hasPaidProducts && (
                                <Badge variant="secondary" className="w-full justify-center mb-2">
                                    Free Products
                                </Badge>
                            )}
                            <Button
                                onClick={handleCheckout}
                                disabled={isProcessing || (totalAmount === 0 && hasPaidProducts) || products.length === 0}
                                className="w-full bg-linear-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-600 hover:to-indigo-600"
                                size="lg"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : hasPaidProducts ? (
                                    "Proceed to Payment"
                                ) : (
                                    "Complete Checkout"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Follow Steps Modal */}
            <FollowStepsModal
                open={showFollowModal}
                onOpenChange={setShowFollowModal}
                onComplete={handleFollowConfirm}
                steps={followSteps}
                isProcessing={isFollowProcessing}
                onStepClick={handleFollowStepClick}
                onStepComplete={handleFollowStepComplete}
            />
        </section>
    );
}
