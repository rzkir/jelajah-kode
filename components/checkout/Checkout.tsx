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

import LoadingOverlay from "@/helper/loading/LoadingOverlay";
import { useTranslation } from "@/hooks/useTranslation";

interface CheckoutProps {
    productsParam: string;
}

export default function Checkout({ productsParam }: CheckoutProps) {
    const { t } = useTranslation();
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
        setShowFollowModal,
        followSteps,
        isFollowProcessing,
        handleFollowStepClick,
        handleFollowStepComplete,
        handleFollowConfirm,
    } = useStateCheckout(productsParam);


    if (authLoading || isLoading) {
        return (
            <LoadingOverlay />
        );
    }

    if (products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="py-12 text-center">
                        <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground" suppressHydrationWarning>{t("checkout.noProductsInCheckout")}</p>
                        <Button asChild className="mt-4">
                            <Link href="/products" suppressHydrationWarning>{t("checkout.browseProducts")}</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="mb-6 md:mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4 md:mb-6 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <span suppressHydrationWarning>{t("checkout.back")}</span>
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-linear-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent" suppressHydrationWarning>
                            {t("checkout.title")}
                        </h1>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mt-2" suppressHydrationWarning>
                        {t("checkout.reviewOrder")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Products List */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Summary Card */}
                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                            <CardHeader className="pb-4 border-b rounded-t-lg">
                                <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2" suppressHydrationWarning>
                                    <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                    {t("checkout.orderSummary")}
                                </CardTitle>
                                <p className="text-xs md:text-sm text-muted-foreground mt-1" suppressHydrationWarning>
                                    {products.length} {products.length === 1 ? t("checkout.item") : t("checkout.items")} {t("checkout.itemsInCart")}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {products.map((product, index) => {
                                    const activeDiscount = getActiveDiscount(product.discount);
                                    const hasActiveDiscount = !!activeDiscount;
                                    const originalPrice = product.price;
                                    const discountedPrice = getProductPrice(product);

                                    return (
                                        <div
                                            key={product._id}
                                            className={`flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${index !== products.length - 1 ? 'border-b border-border/50 pb-4 sm:pb-6' : ''
                                                } bg-linear-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-900/50 hover:border-primary/30`}
                                        >
                                            <div className="relative w-full sm:w-24 md:w-28 h-48 sm:h-24 md:h-28 rounded-xl overflow-hidden shrink-0 border-2 border-border shadow-md group mx-auto sm:mx-0">
                                                <Image
                                                    src={product.thumbnail}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                {hasActiveDiscount && (
                                                    <div className="absolute top-2 right-2">
                                                        <Badge variant="destructive" className="text-xs shadow-lg animate-pulse">
                                                            {product.discount?.type === "percentage"
                                                                ? `${product.discount.value}% OFF`
                                                                : `Rp ${formatIDR(product.discount?.value || 0)} OFF`}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-base md:text-lg mb-2 leading-tight text-slate-900 dark:text-slate-100">
                                                    {product.title}
                                                </h3>
                                                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 flex-wrap">
                                                    {hasActiveDiscount ? (
                                                        <>
                                                            <span className="text-muted-foreground line-through text-xs md:text-sm">
                                                                Rp {formatIDR(originalPrice)}
                                                            </span>
                                                            <span className="font-bold text-base md:text-lg text-primary">
                                                                Rp {formatIDR(discountedPrice)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="font-bold text-base md:text-lg text-primary">
                                                            Rp {formatIDR(product.price)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4 flex-wrap">
                                                    <span className="text-xs md:text-sm font-medium text-muted-foreground" suppressHydrationWarning>
                                                        {t("checkout.quantity")}
                                                    </span>
                                                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                updateQuantity(product._id, product.quantity - 1)
                                                            }
                                                            disabled={product.quantity <= 1}
                                                            className="h-7 w-7 md:h-8 md:w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
                                                        >
                                                            -
                                                        </Button>
                                                        <span className="w-8 md:w-10 text-center font-semibold text-xs md:text-sm">
                                                            {product.quantity}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                updateQuantity(product._id, product.quantity + 1)
                                                            }
                                                            className="h-7 w-7 md:h-8 md:w-8 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                                                        >
                                                            +
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Subtotal */}
                                                <div className="pt-2 md:pt-3 border-t border-border/50">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs md:text-sm font-medium text-muted-foreground" suppressHydrationWarning>
                                                            {t("checkout.subtotal")}
                                                        </span>
                                                        <span className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
                                                            Rp {formatIDR(discountedPrice * product.quantity)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* User Data Card */}
                        <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                            <CardHeader className="pb-4 border-b rounded-t-lg">
                                <CardTitle className="text-lg md:text-xl font-bold" suppressHydrationWarning>{t("checkout.customerInformation")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 md:space-y-4">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 p-3 md:p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-border/50">
                                    <span className="text-xs md:text-sm font-medium text-muted-foreground" suppressHydrationWarning>{t("checkout.name")}</span>
                                    <span className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 text-right sm:text-left">
                                        {user?.name || t("checkout.notAvailable")}
                                    </span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 p-3 md:p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-border/50">
                                    <span className="text-xs md:text-sm font-medium text-muted-foreground" suppressHydrationWarning>{t("checkout.email")}</span>
                                    <span className="text-xs md:text-sm font-semibold text-slate-900 dark:text-slate-100 break-all text-right sm:text-left">
                                        {user?.email || t("checkout.notAvailable")}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4 md:top-6 border-0 shadow-2xl bg-linear-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-800 backdrop-blur-sm">
                            <CardHeader className="pb-4 border-b rounded-t-lg">
                                <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-2" suppressHydrationWarning>
                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                                    {t("checkout.orderTotal")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Items Breakdown */}
                                <div className="space-y-2 md:space-y-3 max-h-64 overflow-y-auto pr-2">
                                    {products.map((product) => {
                                        const subtotal = getProductPrice(product) * product.quantity;

                                        return (
                                            <div
                                                key={product._id}
                                                className="flex justify-between items-start text-xs md:text-sm p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <span className="text-muted-foreground flex-1 pr-2 leading-tight wrap-break-word">
                                                    {product.title} × {product.quantity}
                                                </span>
                                                <span className="font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap ml-2">
                                                    Rp {formatIDR(subtotal)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />

                                {/* Price Breakdown */}
                                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                                    <div className="flex justify-between items-center p-2">
                                        <span className="text-muted-foreground" suppressHydrationWarning>{t("checkout.subtotal")}</span>
                                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                                            Rp {formatIDR(originalTotal)}
                                        </span>
                                    </div>
                                    {discountTotal > 0 && (
                                        <div className="flex justify-between items-center p-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                                            <span className="text-muted-foreground" suppressHydrationWarning>{t("checkout.discount")}</span>
                                            <span className="font-bold text-green-600 dark:text-green-400">
                                                -Rp {formatIDR(discountTotal)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />

                                {/* Total */}
                                <div className="bg-linear-to-br from-primary/10 via-indigo-500/10 to-primary/5 rounded-xl p-4 md:p-5 border-2 border-primary/20">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100" suppressHydrationWarning>{t("checkout.total")}</span>
                                        <span className="text-2xl md:text-3xl font-bold">
                                            Rp {formatIDR(totalAmount)}
                                        </span>
                                    </div>
                                    {!hasPaidProducts && (
                                        <Badge variant="secondary" className="w-full justify-center mt-2 md:mt-3 py-1 md:py-1.5 text-xs md:text-sm" suppressHydrationWarning>
                                            {t("checkout.freeProducts")}
                                        </Badge>
                                    )}
                                </div>

                                {/* Checkout Button */}
                                <Button
                                    onClick={handleCheckout}
                                    disabled={isProcessing || (totalAmount === 0 && hasPaidProducts) || products.length === 0}
                                    className="w-full transition-all duration-300 h-11 md:h-12 text-sm md:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    size="lg"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 md:h-5 md:w-5 mr-2 animate-spin" />
                                            <span suppressHydrationWarning>{t("checkout.processing")}</span>
                                        </>
                                    ) : hasPaidProducts ? (
                                        <span suppressHydrationWarning>{t("checkout.proceedToPayment")}</span>
                                    ) : (
                                        <span suppressHydrationWarning>{t("checkout.completeCheckout")}</span>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
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
