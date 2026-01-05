"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { ShoppingCart, Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/utils/context/AuthContext";
import { API_CONFIG } from "@/lib/config";
import { formatIDR } from "@/hooks/FormatPrice";
import {
    calculateDiscountedPrice,
    getActiveDiscount,
} from "@/hooks/discountServices";
import Link from "next/link";
import FollowStepsModal from "./FollowStepsModal";

interface CheckoutProduct {
    _id: string;
    productsId: string;
    title: string;
    thumbnail: string;
    price: number;
    quantity: number;
    discount?: {
        type: "percentage" | "fixed";
        value: number;
        until?: string;
    };
    paymentType: "free" | "paid";
}

export default function Checkout() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, loading: authLoading } = useAuth();
    const [products, setProducts] = useState<CheckoutProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showFollowModal, setShowFollowModal] = useState(false);

    // Helper function to calculate product price with discount
    const getProductPrice = (product: CheckoutProduct): number => {
        const activeDiscount = getActiveDiscount(product.discount);
        return activeDiscount
            ? calculateDiscountedPrice(product.price, activeDiscount)
            : product.price;
    };

    // Calculate total amount using useMemo
    const totalAmount = useMemo(() => {
        return products.reduce((total, product) => {
            return total + getProductPrice(product) * product.quantity;
        }, 0);
    }, [products]);

    const hasPaidProducts = useMemo(
        () => products.some((p) => p.paymentType === "paid"),
        [products]
    );

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            toast.error("Please login to continue checkout");
            router.push("/signin?redirect=/checkout");
            return;
        }

        // Get products from query params
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, authLoading, router]);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);

            // Get products from query params
            const productsParam = searchParams.get("products");

            if (!productsParam) {
                setProducts([]);
                return;
            }

            const response = await fetch(
                `${API_CONFIG.ENDPOINTS.checkout}?products=${encodeURIComponent(productsParam)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${API_CONFIG.SECRET}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
            router.push("/products");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to fetch payment details from Midtrans
    // For free products, this will just verify the transaction exists
    const fetchPaymentDetails = async (orderId: string) => {
        try {
            const response = await fetch(
                `${API_CONFIG.ENDPOINTS.transactions}/midtrans-status?order_id=${orderId}`,
                {
                    credentials: "include",
                }
            );
            if (!response.ok) {
                console.error("Failed to update payment details");
                // For free products, this is expected (no Midtrans transaction)
                return;
            }
            // Wait a bit to ensure data is saved
            await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
            console.error("Failed to fetch payment details:", error);
            // For free products, this is expected (no Midtrans transaction)
        }
    };

    const processCheckout = async () => {
        if (!user) {
            toast.error("Please login to continue");
            router.push("/signin?redirect=/checkout");
            return;
        }

        if (products.length === 0) {
            toast.error("No products to checkout");
            return;
        }

        setIsProcessing(true);

        try {
            // Prepare checkout data
            const checkoutData = {
                products: products.map((p) => ({
                    productId: p._id,
                    quantity: p.quantity,
                })),
            };

            console.log("Processing checkout with data:", checkoutData);

            const response = await fetch(`${API_CONFIG.ENDPOINTS.checkout}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_CONFIG.SECRET}`,
                },
                credentials: "include",
                body: JSON.stringify(checkoutData),
            });

            let data: {
                _id?: string;
                order_id?: string;
                snap_token?: string;
                total_amount?: number;
                paymentMethod?: "free" | "paid";
                status?: string;
                error?: string;
            };
            try {
                data = await response.json();
            } catch (parseError) {
                console.error("Failed to parse response:", parseError);
                throw new Error("Invalid response from server");
            }

            console.log("Checkout response:", data);

            if (!response.ok) {
                const errorMessage = data?.error || `Checkout failed with status ${response.status}`;
                console.error("Checkout failed:", errorMessage);
                throw new Error(errorMessage);
            }

            // If free products, redirect to success page
            if (data.paymentMethod === "free") {
                console.log("Free product checkout successful, redirecting...");
                console.log("Order ID:", data.order_id);
                console.log("Transaction ID:", data._id);
                console.log("Full response data:", data);

                if (!data.order_id) {
                    throw new Error("Order ID not found in response");
                }

                if (!data._id) {
                    throw new Error("Transaction ID not found in response");
                }

                // Verify transaction was created by fetching payment details (similar to paid products)
                try {
                    await fetchPaymentDetails(data.order_id);
                } catch (error) {
                    console.error("Failed to verify transaction:", error);
                    // Continue anyway as transaction should already be saved
                }

                toast.success("Checkout successful!");
                setIsProcessing(false);

                // Delay redirect to allow toast notification to appear
                setTimeout(() => {
                    router.push(`/checkout/success?order_id=${data.order_id}`);
                }, 1000);
                return;
            }

            // For paid products, open Snap payment popup
            if (data.snap_token && typeof data.snap_token === "string") {
                // Wait for snap script to load
                let retryCount = 0;
                const maxRetries = 50; // 5 seconds max (50 * 100ms)

                const openSnapPayment = () => {
                    if (typeof window === "undefined" || !window.snap) {
                        retryCount++;
                        if (retryCount >= maxRetries) {
                            toast.error("Payment gateway failed to load. Please refresh the page.");
                            console.error("Snap script not available after timeout");
                            setIsProcessing(false);
                            return;
                        }
                        // Retry after 100ms if snap is not ready
                        setTimeout(openSnapPayment, 100);
                        return;
                    }

                    try {
                        // Open Snap payment popup
                        if (!data.snap_token) {
                            throw new Error("Snap token not available");
                        }
                        window.snap.pay(data.snap_token, {
                            onSuccess: async (result: { order_id: string }) => {
                                console.log("Snap onSuccess triggered:", result);
                                await fetchPaymentDetails(result.order_id);
                                toast.success("Payment successful!");
                                setTimeout(() => {
                                    router.push(`/checkout/success?order_id=${result.order_id}`);
                                }, 1000);
                            },
                            onPending: async (result: { order_id: string }) => {
                                console.log("Snap onPending triggered:", result);
                                await fetchPaymentDetails(result.order_id);
                                toast.info("Payment pending. Please complete the payment.");
                                setTimeout(() => {
                                    router.push(`/checkout/pending?order_id=${result.order_id}`);
                                }, 1000);
                            },
                            onError: (result: { order_id: string }) => {
                                console.log("Snap onError triggered:", result);
                                toast.error("Payment failed. Please try again.");
                                setTimeout(() => {
                                    router.push(`/checkout/failed?order_id=${result.order_id}`);
                                }, 1000);
                            },
                            onClose: () => {
                                console.log("Snap onClose triggered");
                                toast.info("Payment window closed");
                            },
                        });
                    } catch (error) {
                        console.error("Error opening Snap payment:", error);
                        toast.error("Failed to open payment gateway. Please try again.");
                    }
                };

                // Start trying to open payment
                openSnapPayment();
            } else {
                toast.error("Payment gateway not available");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error(
                error instanceof Error ? error.message : "Checkout failed"
            );
            setIsProcessing(false);
        }
    };

    const handleCheckout = () => {
        if (!user) {
            toast.error("Please login to continue");
            router.push("/signin?redirect=/checkout");
            return;
        }

        if (products.length === 0) {
            toast.error("No products to checkout");
            return;
        }

        // If free products, show follow modal first
        if (!hasPaidProducts) {
            setShowFollowModal(true);
        } else {
            // For paid products, proceed directly
            processCheckout();
        }
    };

    const handleFollowComplete = async () => {
        setShowFollowModal(false);
        // Process checkout after all follow steps are completed
        await processCheckout();
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        setProducts((prevProducts) =>
            prevProducts.map((p) =>
                p._id === productId ? { ...p, quantity: newQuantity } : p
            )
        );
    };

    const removeProduct = (productId: string) => {
        setProducts((prevProducts) => {
            const updatedProducts = prevProducts.filter((p) => p._id !== productId);

            if (updatedProducts.length === 0) {
                router.push("/products");
                return updatedProducts;
            }

            // Update URL
            const newProductIds = updatedProducts
                .map((p) => `${p._id}:${p.quantity}`)
                .join(",");
            router.push(`/checkout?products=${newProductIds}`);

            return updatedProducts;
        });
    };


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
        <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                                className="w-full"
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
                onComplete={handleFollowComplete}
            />
        </div>
    );
}
