"use client";

import Image from "next/image";

import Link from "next/link";

import { CheckCircle2, Download, ArrowLeft, Loader2, Star } from "lucide-react";

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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            <Card className="mb-6">
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
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                {isSuccess
                                    ? "Payment Successful!"
                                    : transaction.status === "pending"
                                        ? "Payment Pending"
                                        : "Transaction Status"}
                            </h1>
                            <p className="text-muted-foreground">
                                {isSuccess
                                    ? "Thank you for your purchase. Your order has been confirmed."
                                    : transaction.status === "pending"
                                        ? "Your payment is being processed. We'll notify you once it's confirmed."
                                        : `Transaction status: ${transaction.status}`}
                            </p>
                        </div>
                        <Badge
                            variant={isSuccess ? "default" : "secondary"}
                            className="text-lg px-4 py-2"
                        >
                            Order ID: {transaction.order_id}
                        </Badge>
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {transaction.products.map((item) => (
                                <div key={item._id} className="flex gap-4">
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-1">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm text-muted-foreground">
                                                Quantity: {item.quantity}
                                            </span>
                                            <Badge
                                                variant={
                                                    item.paymentType === "free"
                                                        ? "secondary"
                                                        : "default"
                                                }
                                            >
                                                {item.paymentType === "free"
                                                    ? "Free"
                                                    : "Paid"}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold">
                                                {formatIDR(item.amount)}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {isSuccess && !productRatings[item.productsId]?.hasRated && (
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        onClick={() => handleOpenRatingModal(item)}
                                                    >
                                                        <Star className="h-4 w-4 mr-2" />
                                                        Rate Product
                                                    </Button>
                                                )}
                                                {productRatings[item.productsId]?.hasRated && (
                                                    <span className="text-xs text-muted-foreground">
                                                        Anda telah memberikan rating untuk produk ini.
                                                    </span>
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
                                                    >
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Payment Method
                                    </span>
                                    <span className="font-medium capitalize">
                                        {transaction.paymentMethod}
                                    </span>
                                </div>
                                {transaction.payment_details?.payment_type && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Payment Type
                                        </span>
                                        <span className="font-medium capitalize">
                                            {transaction.payment_details.payment_type
                                                .replace(/_/g, " ")
                                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </span>
                                    </div>
                                )}
                                {transaction.payment_details?.bank && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Bank</span>
                                        <span className="font-medium">
                                            {transaction.payment_details.bank}
                                        </span>
                                    </div>
                                )}
                                {transaction.payment_details?.va_number && (
                                    <div className="flex flex-col gap-1 text-sm pt-2 pb-2 border-t border-b">
                                        <span className="text-muted-foreground">
                                            Virtual Account
                                        </span>
                                        <span className="font-mono font-semibold text-lg">
                                            {transaction.payment_details.va_number}
                                        </span>
                                    </div>
                                )}
                                {transaction.payment_details?.transaction_id && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Transaction ID
                                        </span>
                                        <span className="font-mono text-xs break-all text-right">
                                            {transaction.payment_details.transaction_id}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Status</span>
                                    <Badge
                                        variant={
                                            isSuccess
                                                ? "default"
                                                : transaction.status === "pending"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {transaction.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Date</span>
                                    <span className="font-medium">
                                        {formatDate(transaction.created_at)}
                                    </span>
                                </div>
                                {transaction.payment_details?.settlement_time && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Settlement Time
                                        </span>
                                        <span className="font-medium">
                                            {formatDate(
                                                transaction.payment_details.settlement_time
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                {transaction.products.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="text-muted-foreground">
                                            {item.title} x{item.quantity}
                                        </span>
                                        <span>{formatIDR(item.amount)}</span>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatIDR(transaction.total_amount || 0)}
                                </span>
                            </div>
                            {transaction.paymentMethod === "free" && (
                                <Badge variant="secondary" className="w-full justify-center">
                                    Free Products
                                </Badge>
                            )}
                            <div className="pt-4 space-y-2">
                                {transaction.status === "pending" && transaction.paymentMethod === "paid" && (
                                    <Button
                                        className="w-full"
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
                                <Button asChild className="w-full" variant="outline">
                                    <Link href="/products">Continue Shopping</Link>
                                </Button>
                                {isSuccess && (
                                    <Button asChild className="w-full">
                                        <Link href="/dashboard">Go to Dashboard</Link>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Rating Modal */}
            <Dialog open={ratingModalOpen} onOpenChange={setRatingModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Rate Product</DialogTitle>
                        <DialogDescription>
                            {selectedProduct && `Share your experience with ${selectedProduct.title}`}
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
        </div>
    );
}

