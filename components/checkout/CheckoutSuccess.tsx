"use client";

import Image from "next/image";

import Link from "next/link";

import { CheckCircle2, Download, ArrowLeft, Loader2, Star, Edit, CreditCard, Calendar, FileText, ShoppingBag, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { formatIDR } from "@/hooks/FormatPrice";

import useFormatDate from "@/hooks/FormatDate";

import useStateCheckoutSuccess from "@/components/checkout/lib/useStateCheckoutSuccess";

import useInvoice from "@/hooks/invoice";

export default function CheckoutSuccess({ status }: CheckoutSuccessProps) {
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
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Transaction not found</p>
                        <Button asChild className="mt-4">
                            <Link href="/products">Browse Products</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isSuccess = transaction.status === "success";

    return (
        <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/products")}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Products
                </Button>
            </div>

            {/* Success Header */}
            <Card className="mb-6 bg-transparent border-0">
                <CardContent className="py-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div
                            className={`rounded-full p-4 ${isSuccess
                                ? "bg-green-100 dark:bg-green-900/20"
                                : "bg-yellow-100 dark:bg-yellow-900/20"
                                }`}
                        >
                            <CheckCircle2
                                className={`h-12 w-12 ${isSuccess ? "text-green-600" : "text-yellow-600"
                                    }`}
                            />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold">
                                {isSuccess
                                    ? "Payment Successful!"
                                    : transaction.status === "pending"
                                        ? "Payment Pending"
                                        : "Transaction Status"}
                            </h1>

                            <Badge
                                variant={isSuccess ? "default" : "secondary"}
                                className="text-lg px-4 py-2"
                            >
                                Order ID: {transaction.order_id}
                            </Badge>

                            <p className="text-muted-foreground">
                                {isSuccess
                                    ? "Thank you for your purchase. Your order has been confirmed."
                                    : transaction.status === "pending"
                                        ? "Your payment is being processed. We'll notify you once it's confirmed."
                                        : `Transaction status: ${transaction.status}`}
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
                                        Memproses...
                                    </>
                                ) : (
                                    "Lanjutkan Payment"
                                )}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Products List */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="shadow-lg">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-2xl font-bold">Order Details</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {transaction.products.length} {transaction.products.length === 1 ? 'item' : 'items'} in your order
                            </p>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="divide-y">
                                {transaction.products.map((item) => (
                                    <div
                                        key={item._id}
                                        className="p-6 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex gap-6">
                                            {/* Product Image */}
                                            <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0 border-2 border-border shadow-md">
                                                <Image
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 flex flex-col gap-3">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg mb-2 leading-tight">
                                                            {item.title}
                                                        </h3>
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
                                                                <span className="text-sm font-medium text-muted-foreground">
                                                                    Qty:
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
                                                                {item.paymentType === "free"
                                                                    ? "Free"
                                                                    : "Paid"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-primary">
                                                            {formatIDR(item.amount)}
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
                                                            Rate Product
                                                        </Button>
                                                    )}

                                                    {productRatings[item.productsId]?.hasRated && (
                                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                            <span className="text-xs font-medium text-green-700 dark:text-green-400">
                                                                Rated
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
                                                            Download
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
                        <Card className="shadow-lg">
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
                                                                <div className="bg-muted/50 rounded-lg p-3 border border-border">
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
                                                                Edit Rating
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
                <Card className="shadow-lg">
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
                                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                                    Customer Information
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
                                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                                    Payment Information
                                </h3>
                            </div>

                            <div className="space-y-3 pl-6">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-muted-foreground">
                                        Payment Method
                                    </span>
                                    <Badge variant="outline" className="font-medium capitalize">
                                        {transaction.paymentMethod}
                                    </Badge>
                                </div>
                                {transaction.payment_details?.payment_type && (
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-muted-foreground">
                                            Payment Type
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
                                        <span className="text-sm text-muted-foreground">Bank</span>
                                        <span className="text-sm font-semibold">
                                            {transaction.payment_details.bank}
                                        </span>
                                    </div>
                                )}
                                {transaction.payment_details?.va_number && (
                                    <div className="bg-primary/5 rounded-lg p-4 border-2 border-primary/20 mt-3">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                Virtual Account
                                            </span>
                                            <span className="font-mono font-bold text-xl text-primary">
                                                {transaction.payment_details.va_number}
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {transaction.payment_details?.transaction_id && (
                                    <div className="flex flex-col gap-1 py-2">
                                        <span className="text-xs text-muted-foreground">
                                            Transaction ID
                                        </span>
                                        <span className="font-mono text-xs break-all bg-muted p-2 rounded">
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
                                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                                    Order Details
                                </h3>
                            </div>
                            <div className="space-y-3 pl-6">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-muted-foreground">Status</span>
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
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-3 w-3" />
                                        Order Date
                                    </span>
                                    <span className="text-sm font-medium">
                                        {formatDate(transaction.created_at)}
                                    </span>
                                </div>
                                {transaction.payment_details?.settlement_time && (
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            Settlement Time
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
                            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                                Items
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
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold whitespace-nowrap">
                                            {formatIDR(item.amount)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Total */}
                        <div className="bg-primary/5 rounded-lg p-4 border-2 border-primary/20">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatIDR(transaction.total_amount || 0)}
                                </span>
                            </div>
                            {transaction.paymentMethod === "free" && (
                                <Badge variant="secondary" className="mt-2 w-full justify-center">
                                    Free Products
                                </Badge>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 space-y-2 flex flex-col md:flex-row gap-2">
                            <Button
                                className="w-full md:w-auto"
                                variant="secondary"
                                onClick={() => downloadInvoice(transaction)}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download Invoice
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
                                            Memproses...
                                        </>
                                    ) : (
                                        "Lanjutkan Payment"
                                    )}
                                </Button>
                            )}

                            <Button asChild className="w-full md:w-auto" variant="outline">
                                <Link href="/products">Continue Shopping</Link>
                            </Button>

                            {isSuccess && (
                                <Button asChild className="w-full md:w-auto">
                                    <Link href="/dashboard">Go to Dashboard</Link>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Rating Modal */}
            <Dialog open={ratingModalOpen} onOpenChange={setRatingModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rate Product</DialogTitle>
                        <DialogDescription>
                            {selectedProduct ? `Share your experience with ${selectedProduct.title}` : "Rate this product"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Rating</Label>
                            <div className="flex items-center gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className="focus:outline-none"
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setRating(star)}
                                    >
                                        <Star
                                            className={`h-8 w-8 transition-colors ${star <= (hoveredRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-muted-foreground"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {rating === 1 && "Poor"}
                                    {rating === 2 && "Fair"}
                                    {rating === 3 && "Good"}
                                    {rating === 4 && "Very Good"}
                                    {rating === 5 && "Excellent"}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea
                                id="comment"
                                placeholder="Share your thoughts about this product..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="mt-2 min-h-[100px]"
                                maxLength={1000}
                            />
                            <p className="text-xs text-muted-foreground mt-1 text-right">
                                {comment.length}/1000
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRatingModalOpen(false);
                                setRating(0);
                                setComment("");
                                setSelectedProduct(null);
                            }}
                            disabled={isSubmittingRating}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitRating}
                            disabled={rating === 0 || !comment.trim() || isSubmittingRating}
                        >
                            {isSubmittingRating ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Rating"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}

