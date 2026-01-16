"use client";

import Image from "next/image";

import Link from "next/link";

import { motion } from "framer-motion";

import { CheckCircle2, Download, ArrowLeft, Loader2, Star, Edit, CreditCard, Calendar, FileText, ShoppingBag, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";

import { formatIDR } from "@/hooks/FormatPrice";

import useFormatDate from "@/hooks/FormatDate";

import useStateCheckoutSuccess from "@/components/checkout/lib/useStateCheckoutSuccess";

import useInvoice from "@/hooks/invoice";

import LoadingOverlay from "@/helper/loading/LoadingOverlay";

import ProductsRatingsModal from "@/components/checkout/modal/ProductsRatingsModal";

import { useTranslation } from "@/hooks/useTranslation";

export default function CheckoutSuccess({ status }: CheckoutSuccessProps) {
    const { t } = useTranslation();
    const {
        router,
        authLoading,
        transaction,
        isLoading,
        ratingModalOpen,
        selectedProduct,
        rating,
        hoveredRating,
        comment,
        isSubmittingRating,
        productRatings,
        isContinuingPayment,
        setRating,
        setHoveredRating,
        setComment,
        setRatingModalOpen,
        setSelectedProduct,
        handleDownload,
        handleOpenRatingModal,
        handleSubmitRating,
        handleContinuePayment,
    } = useStateCheckoutSuccess({ status });
    const { downloadInvoice } = useInvoice();
    const { formatDate } = useFormatDate();

    if (authLoading || isLoading) {
        return (
            <LoadingOverlay />
        );
    }

    if (!transaction) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground" suppressHydrationWarning>{t("order.transactionNotFound")}</p>
                        <Button asChild className="mt-4">
                            <Link href="/products" suppressHydrationWarning>{t("checkout.browseProducts")}</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isSuccess = transaction.status === "success";

    return (
        <section className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 ">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/")}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <span suppressHydrationWarning>{t("checkout.backToHome")}</span>
                    </Button>
                </div>

                {/* Success Header */}
                <Card className="mb-6 bg-transparent border-0">
                    <CardContent className="py-8 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 15,
                                    duration: 0.5
                                }}
                                className={`rounded-full p-4 ${isSuccess
                                    ? "bg-green-100 dark:bg-green-900/20"
                                    : "bg-yellow-100 dark:bg-yellow-900/20"
                                    }`}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 20,
                                        delay: 0.2
                                    }}
                                >
                                    {isSuccess ? (
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                            }}
                                            transition={{
                                                duration: 0.6,
                                                times: [0, 0.5, 1],
                                                repeat: 1,
                                                delay: 0.5
                                            }}
                                        >
                                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                                        </motion.div>
                                    ) : (
                                        <CheckCircle2 className="h-12 w-12 text-yellow-600" />
                                    )}
                                </motion.div>
                            </motion.div>

                            <div className="space-y-4">
                                <h1 className="text-3xl font-bold" suppressHydrationWarning>
                                    {isSuccess
                                        ? t("order.paymentSuccessful")
                                        : transaction.status === "pending"
                                            ? t("order.paymentPending")
                                            : t("order.transactionStatus")}
                                </h1>

                                <Badge
                                    variant={isSuccess ? "default" : "secondary"}
                                    className="text-lg px-4 py-2"
                                >
                                    <span suppressHydrationWarning>{t("order.orderId")}</span>: {transaction.order_id}
                                </Badge>

                                <p className="text-muted-foreground" suppressHydrationWarning>
                                    {isSuccess
                                        ? t("order.thankYouPurchase")
                                        : transaction.status === "pending"
                                            ? t("order.paymentBeingProcessed")
                                            : `${t("order.transactionStatus")}: ${transaction.status}`}
                                </p>
                            </div>

                            {transaction.status === "pending" && transaction.paymentMethod === "paid" && (
                                <Button
                                    className="mt-4"
                                    onClick={handleContinuePayment}
                                    disabled={isContinuingPayment || !transaction.snap_token}
                                >
                                    {isContinuingPayment ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            <span suppressHydrationWarning>{t("checkout.processingPayment")}</span>
                                        </>
                                    ) : (
                                        <span suppressHydrationWarning>{t("checkout.continuePayment")}</span>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className={`grid grid-cols-1 gap-6 ${isSuccess && Object.keys(productRatings).some(
                    (productId) => productRatings[productId]?.hasRated
                ) ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
                    {/* Products List */}
                    <div className={`space-y-4 ${isSuccess && Object.keys(productRatings).some(
                        (productId) => productRatings[productId]?.hasRated
                    ) ? 'lg:col-span-2' : ''}`}>
                        <Card className="shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                            <CardHeader className="pb-4 border-b">
                                <CardTitle className="text-2xl font-bold" suppressHydrationWarning>{t("order.orderDetails")}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1" suppressHydrationWarning>
                                    {transaction.products.length} {transaction.products.length === 1 ? t("order.item") : t("order.items")} {t("order.itemsInOrder")}
                                </p>
                            </CardHeader>

                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {transaction.products.map((item) => (
                                        <div
                                            key={item._id}
                                            className="p-6"
                                        >
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Product Image */}
                                                <div className="relative w-full md:w-32 aspect-square rounded-xl overflow-hidden shrink-0 border-2 border-border shadow-md">
                                                    <Image
                                                        src={item.thumbnail}
                                                        alt={item.title}
                                                        fill
                                                        loading="lazy"
                                                        className="object-cover"
                                                    />
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 flex flex-col gap-3">
                                                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-lg mb-2 leading-tight">
                                                                {item.title}
                                                            </h3>
                                                            <div className="flex items-center gap-3 flex-wrap">
                                                                <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
                                                                    <span className="text-sm font-medium text-muted-foreground" suppressHydrationWarning>
                                                                        {t("order.qty")}:
                                                                    </span>
                                                                    <span className="text-sm font-semibold">
                                                                        {item.quantity}
                                                                    </span>
                                                                </div>
                                                                <Badge
                                                                    variant={
                                                                        item.paymentType === "free"
                                                                            ? "secondary"
                                                                            : "default"
                                                                    }
                                                                    className="px-3 py-1"
                                                                >
                                                                    <span suppressHydrationWarning>
                                                                        {item.paymentType === "free"
                                                                            ? t("order.free")
                                                                            : t("order.paid")}
                                                                    </span>
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-primary">
                                                                Rp {formatIDR(item.amount)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center gap-3 pt-2">
                                                        {isSuccess && !productRatings[item.productsId]?.hasRated && (
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                onClick={() => handleOpenRatingModal(item)}
                                                                className="gap-2"
                                                            >
                                                                <Star className="h-4 w-4" />
                                                                <span suppressHydrationWarning>{t("order.rateProduct")}</span>
                                                            </Button>
                                                        )}

                                                        {productRatings[item.productsId]?.hasRated && (
                                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                <span className="text-xs font-medium text-green-700 dark:text-green-400" suppressHydrationWarning>
                                                                    {t("order.rated")}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {item.downloadUrl && isSuccess && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleDownload(
                                                                        item.downloadUrl,
                                                                        item.productsId
                                                                    )
                                                                }
                                                                className="gap-2"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                                <span suppressHydrationWarning>{t("order.download")}</span>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Ratings Section */}
                    <div className="lg:col-span-1">
                        {isSuccess && Object.keys(productRatings).some(
                            (productId) => productRatings[productId]?.hasRated
                        ) ? (
                            <Card className="shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                                <CardHeader className="border-b">
                                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                                        Your Ratings
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Reviews you&apos;ve submitted for products in this order
                                    </p>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <div className="divide-y">
                                        {transaction.products
                                            .filter(
                                                (item) =>
                                                    productRatings[item.productsId]?.hasRated &&
                                                    productRatings[item.productsId]?.rating
                                            )
                                            .map((item) => {
                                                const ratingData =
                                                    productRatings[item.productsId]?.rating;
                                                return (
                                                    <div
                                                        key={item._id}
                                                        className="p-6 -mt-9"
                                                    >
                                                        <div className="flex gap-4 flex-col">
                                                            {/* Rating Info */}
                                                            <div className="flex-1 flex flex-col gap-3">
                                                                <h3 className="font-bold text-base leading-tight">
                                                                    {item.title}
                                                                </h3>

                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className="flex items-center gap-1">
                                                                        {[1, 2, 3, 4, 5].map(
                                                                            (star) => (
                                                                                <Star
                                                                                    key={star}
                                                                                    className={`h-4 w-4 ${star <=
                                                                                        (ratingData?.rating ||
                                                                                            0)
                                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                                        : "text-muted-foreground"
                                                                                        }`}
                                                                                />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                    <span className="text-xs font-semibold text-muted-foreground">
                                                                        {ratingData?.rating}/5
                                                                    </span>
                                                                </div>

                                                                {ratingData?.comment && (
                                                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-border">
                                                                        <p className="text-xs leading-relaxed">
                                                                            {ratingData.comment}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleOpenRatingModal(item)}
                                                                    className="gap-2 w-full mt-2"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                    <span suppressHydrationWarning>{t("order.editRating")}</span>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : null}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="mt-6">
                    <Card className="shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                        <CardHeader className="border-b">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <ShoppingBag className="h-6 w-6 text-primary" />
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* User Information */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground" suppressHydrationWarning>
                                        {t("order.customerInformation")}
                                    </h3>
                                </div>

                                <div className="space-y-3 pl-6">
                                    <div className="flex items-center gap-3">
                                        {transaction.user?.picture ? (
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-border shrink-0">
                                                <Image
                                                    src={transaction.user.picture}
                                                    alt={transaction.user.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border shrink-0">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">
                                                {transaction.user?.name || "N/A"}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {transaction.user?.email || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Payment Information */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground" suppressHydrationWarning>
                                        {t("order.paymentInformation")}
                                    </h3>
                                </div>

                                <div className="space-y-3 pl-6">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-muted-foreground" suppressHydrationWarning>
                                            {t("order.paymentMethod")}
                                        </span>
                                        <Badge variant="outline" className="font-medium capitalize">
                                            {transaction.paymentMethod}
                                        </Badge>
                                    </div>
                                    {transaction.payment_details?.payment_type && (
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-muted-foreground" suppressHydrationWarning>
                                                {t("order.paymentType")}
                                            </span>
                                            <span className="text-sm font-medium capitalize">
                                                {transaction.payment_details.payment_type
                                                    .replace(/_/g, " ")
                                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </span>
                                        </div>
                                    )}
                                    {transaction.payment_details?.bank && (
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-muted-foreground" suppressHydrationWarning>{t("order.bank")}</span>
                                            <span className="text-sm font-semibold">
                                                {transaction.payment_details.bank}
                                            </span>
                                        </div>
                                    )}
                                    {transaction.payment_details?.va_number && (
                                        <div className="bg-primary/5 rounded-lg p-4 border-2 border-primary/20 mt-3">
                                            <div className="flex flex-col gap-2">
                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide" suppressHydrationWarning>
                                                    {t("order.virtualAccount")}
                                                </span>
                                                <span className="font-mono font-bold text-xl text-primary">
                                                    {transaction.payment_details.va_number}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {transaction.payment_details?.transaction_id && (
                                        <div className="flex flex-col gap-1 py-2">
                                            <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                                                {t("order.transactionId")}
                                            </span>
                                            <span className="font-mono text-xs break-all bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                                                {transaction.payment_details.transaction_id}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Order Details */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground" suppressHydrationWarning>
                                        {t("order.orderDetailsTitle")}
                                    </h3>
                                </div>
                                <div className="space-y-3 pl-6">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-muted-foreground" suppressHydrationWarning>{t("order.status")}</span>
                                        <Badge
                                            variant={
                                                isSuccess
                                                    ? "default"
                                                    : transaction.status === "pending"
                                                        ? "secondary"
                                                        : "destructive"
                                            }
                                            className="font-medium"
                                        >
                                            {transaction.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2" suppressHydrationWarning>
                                            <Calendar className="h-3 w-3" />
                                            {t("order.orderDate")}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {formatDate(transaction.created_at)}
                                        </span>
                                    </div>
                                    {transaction.payment_details?.settlement_time && (
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-muted-foreground flex items-center gap-2" suppressHydrationWarning>
                                                <Calendar className="h-3 w-3" />
                                                {t("order.settlementTime")}
                                            </span>
                                            <span className="text-sm font-medium">
                                                {formatDate(
                                                    transaction.payment_details.settlement_time
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Items List */}
                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground" suppressHydrationWarning>
                                    {t("order.items")}
                                </h3>
                                <div className="space-y-2">
                                    {transaction.products.map((item) => (
                                        <div
                                            key={item._id}
                                            className="flex justify-between items-start py-2 border-b border-border/50 last:border-0"
                                        >
                                            <div className="flex-1 pr-2">
                                                <p className="text-sm font-medium leading-tight">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>
                                                    {t("order.qty")}: {item.quantity}
                                                </p>
                                            </div>
                                            <span className="text-sm font-semibold whitespace-nowrap">
                                                Rp {formatIDR(item.amount)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Total */}
                            <div className="bg-primary/5 rounded-lg p-4 border-2 border-primary/20">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold" suppressHydrationWarning>{t("order.total")}</span>
                                    <span className="text-2xl font-bold text-primary">
                                        Rp {formatIDR(transaction.total_amount || 0)}
                                    </span>
                                </div>
                                {transaction.paymentMethod === "free" && (
                                    <Badge variant="secondary" className="mt-2 w-full justify-center text-sm" suppressHydrationWarning>
                                        {t("order.freeProducts")}
                                    </Badge>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 space-y-2 flex flex-col md:flex-row gap-2">
                                <Button
                                    className="w-full md:w-auto"
                                    variant="outline"
                                    onClick={() => downloadInvoice(transaction)}
                                >
                                    <Download className="h-4 w-4" />
                                    <span suppressHydrationWarning>{t("order.downloadInvoice")}</span>
                                </Button>

                                {transaction.status === "pending" && transaction.paymentMethod === "paid" && (
                                    <Button
                                        className="w-full md:w-auto"
                                        onClick={handleContinuePayment}
                                        disabled={isContinuingPayment || !transaction.snap_token}
                                    >
                                        {isContinuingPayment ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                <span suppressHydrationWarning>{t("checkout.processingPayment")}</span>
                                            </>
                                        ) : (
                                            <span suppressHydrationWarning>{t("checkout.continuePayment")}</span>
                                        )}
                                    </Button>
                                )}

                                <Button asChild className="w-full md:w-auto" variant="outline">
                                    <Link href="/products" suppressHydrationWarning>{t("order.continueShopping")}</Link>
                                </Button>

                                {isSuccess && (
                                    <Button asChild className="w-full md:w-auto">
                                        <Link href="/profile" suppressHydrationWarning>{t("order.goToProfile")}</Link>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Rating Modal */}
                <ProductsRatingsModal
                    open={ratingModalOpen}
                    onOpenChange={setRatingModalOpen}
                    selectedProduct={selectedProduct}
                    rating={rating}
                    hoveredRating={hoveredRating}
                    comment={comment}
                    isSubmittingRating={isSubmittingRating}
                    onRatingChange={setRating}
                    onHoveredRatingChange={setHoveredRating}
                    onCommentChange={setComment}
                    onSubmit={handleSubmitRating}
                    onCancel={() => {
                        setRatingModalOpen(false);
                        setRating(0);
                        setComment("");
                        setSelectedProduct(null);
                    }}
                />
            </div>
        </section>
    );
}

