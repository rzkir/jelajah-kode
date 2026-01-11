"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { API_CONFIG } from "@/lib/config";

import {
  calculateDiscountedPrice,
  getActiveDiscount,
} from "@/hooks/discountServices";

import { useAuth } from "@/utils/context/AuthContext";

const useStateCheckout = (productsParam: string) => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [products, setProducts] = useState<CheckoutProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followSteps, setFollowSteps] = useState<Step[]>([
    {
      id: "tiktok",
      name: "TikTok",
      url: API_CONFIG.SOCIAL_MEDIA.tiktok as string,
      status: "pending",
    },
    {
      id: "instagram",
      name: "Instagram",
      url: API_CONFIG.SOCIAL_MEDIA.instagram as string,
      status: "pending",
    },
    {
      id: "facebook",
      name: "Facebook",
      url: API_CONFIG.SOCIAL_MEDIA.facebook as string,
      status: "pending",
    },
  ]);
  const [isFollowProcessing, setIsFollowProcessing] = useState(false);

  const getProductPrice = useCallback((product: CheckoutProduct): number => {
    const activeDiscount = getActiveDiscount(product.discount);
    return activeDiscount
      ? calculateDiscountedPrice(product.price, activeDiscount)
      : product.price;
  }, []);

  const { totalAmount, originalTotal, discountTotal } = useMemo(() => {
    const totals = products.reduce(
      (acc, product) => {
        const originalSubtotal = product.price * product.quantity;
        const discountedSubtotal = getProductPrice(product) * product.quantity;

        acc.originalTotal += originalSubtotal;
        acc.totalAmount += discountedSubtotal;
        return acc;
      },
      {
        totalAmount: 0,
        originalTotal: 0,
      }
    );

    const discountDiff = Math.max(totals.originalTotal - totals.totalAmount, 0);

    return {
      ...totals,
      discountTotal: discountDiff,
    };
  }, [products, getProductPrice]);

  const hasPaidProducts = useMemo(
    () => products.some((p) => p.paymentType === "paid"),
    [products]
  );

  const allFollowStepsCompleted = useMemo(
    () => followSteps.every((step) => step.status === "completed"),
    [followSteps]
  );

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!productsParam) {
        setProducts([]);
        return;
      }

      // For development: use proxy route to handle cookie forwarding
      // For production: use direct backend call
      const checkoutUrl =
        process.env.NODE_ENV === "development"
          ? "/api/proxy-checkout" // Use proxy in development
          : API_CONFIG.ENDPOINTS.checkout; // Direct call in production

      const response = await fetch(
        `${checkoutUrl}?products=${encodeURIComponent(productsParam)}`,
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
  }, [router, productsParam]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error("Please login to continue checkout");
      router.push("/signin?redirect=/checkout");
      return;
    }

    fetchProducts();
  }, [authLoading, fetchProducts, router, user]);

  const fetchPaymentDetails = useCallback(async (orderId: string) => {
    try {
      // For development: use proxy route to handle cookie forwarding
      // For production: use direct backend call
      const transactionsUrl =
        process.env.NODE_ENV === "development"
          ? "/api/proxy-transactions" // Use proxy in development
          : API_CONFIG.ENDPOINTS.transactions; // Direct call in production

      const response = await fetch(
        `${transactionsUrl}/midtrans-status?order_id=${orderId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.error("Failed to update payment details");
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Failed to fetch payment details:", error);
    }
  }, []);

  const processCheckout = useCallback(async () => {
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
      const checkoutData = {
        products: products.map((p) => ({
          productId: p._id,
          quantity: p.quantity,
        })),
      };

      // For development: use proxy route to handle cookie forwarding
      // For production: use direct backend call
      const checkoutUrl =
        process.env.NODE_ENV === "development"
          ? "/api/proxy-checkout" // Use proxy in development
          : API_CONFIG.ENDPOINTS.checkout; // Direct call in production

      const response = await fetch(checkoutUrl, {
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

      if (!response.ok) {
        const errorMessage =
          data?.error || `Checkout failed with status ${response.status}`;
        console.error("Checkout failed:", errorMessage);
        throw new Error(errorMessage);
      }

      if (data.paymentMethod === "free") {
        if (!data.order_id) {
          throw new Error("Order ID not found in response");
        }

        if (!data._id) {
          throw new Error("Transaction ID not found in response");
        }

        try {
          await fetchPaymentDetails(data.order_id);
        } catch (error) {
          console.error("Failed to verify transaction:", error);
        }

        toast.success("Checkout successful!");
        setIsProcessing(false);

        setTimeout(() => {
          router.push(`/checkout/success?order_id=${data.order_id}`);
        }, 1000);
        return;
      }

      if (data.snap_token && typeof data.snap_token === "string") {
        let retryCount = 0;
        const maxRetries = 50;

        const openSnapPayment = () => {
          if (typeof window === "undefined" || !window.snap) {
            retryCount++;
            if (retryCount >= maxRetries) {
              toast.error(
                "Payment gateway failed to load. Please refresh the page."
              );
              console.error("Snap script not available after timeout");
              setIsProcessing(false);
              return;
            }
            setTimeout(openSnapPayment, 100);
            return;
          }

          try {
            if (!data.snap_token) {
              throw new Error("Snap token not available");
            }
            window.snap.pay(data.snap_token, {
              onSuccess: async (result: { order_id: string }) => {
                await fetchPaymentDetails(result.order_id);
                toast.success("Payment successful!");
                setTimeout(() => {
                  router.push(`/checkout/success?order_id=${result.order_id}`);
                }, 1000);
              },
              onPending: async (result: { order_id: string }) => {
                await fetchPaymentDetails(result.order_id);
                toast.info("Payment pending. Please complete the payment.");
                setTimeout(() => {
                  router.push(`/checkout/pending?order_id=${result.order_id}`);
                }, 1000);
              },
              onError: (result: { order_id: string }) => {
                toast.error("Payment failed. Please try again.");
                setTimeout(() => {
                  router.push(`/checkout/failed?order_id=${result.order_id}`);
                }, 1000);
              },
              onClose: () => {
                toast.info("Payment window closed");
              },
            });
          } catch (error) {
            console.error("Error opening Snap payment:", error);
            toast.error("Failed to open payment gateway. Please try again.");
          }
        };

        openSnapPayment();
      } else {
        toast.error("Payment gateway not available");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error instanceof Error ? error.message : "Checkout failed");
      setIsProcessing(false);
    }
  }, [fetchPaymentDetails, products, router, user]);

  const handleCheckout = useCallback(() => {
    if (!user) {
      toast.error("Please login to continue");
      router.push("/signin?redirect=/checkout");
      return;
    }

    if (products.length === 0) {
      toast.error("No products to checkout");
      return;
    }

    if (!hasPaidProducts) {
      setShowFollowModal(true);
    } else {
      processCheckout();
    }
  }, [hasPaidProducts, processCheckout, products.length, router, user]);

  const handleFollowComplete = useCallback(async () => {
    setShowFollowModal(false);
    await processCheckout();
  }, [processCheckout]);

  const handleFollowStepClick = useCallback((step: Step) => {
    window.open(step.url, "_blank", "noopener,noreferrer");
    setFollowSteps((prevSteps) =>
      prevSteps.map((s) =>
        s.id === step.id ? { ...s, status: "in-progress" } : s
      )
    );
  }, []);

  const handleFollowStepComplete = useCallback((stepId: string) => {
    setFollowSteps((prevSteps) =>
      prevSteps.map((s) =>
        s.id === stepId ? { ...s, status: "completed" } : s
      )
    );
  }, []);

  const handleFollowConfirm = useCallback(async () => {
    if (!allFollowStepsCompleted || isFollowProcessing) return;
    setIsFollowProcessing(true);
    try {
      await handleFollowComplete();
    } finally {
      setIsFollowProcessing(false);
    }
  }, [allFollowStepsCompleted, handleFollowComplete, isFollowProcessing]);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity < 1) return;

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === productId ? { ...p, quantity: newQuantity } : p
        )
      );
    },
    []
  );

  const removeProduct = useCallback(
    (productId: string) => {
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.filter((p) => p._id !== productId);

        if (updatedProducts.length === 0) {
          router.push("/products");
          return updatedProducts;
        }

        const newProductIds = updatedProducts
          .map((p) => `${p._id}:${p.quantity}`)
          .join(",");
        router.push(`/checkout?products=${newProductIds}`);

        return updatedProducts;
      });
    },
    [router]
  );

  return {
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
    allFollowStepsCompleted,
    handleFollowStepClick,
    handleFollowStepComplete,
    handleFollowConfirm,
  };
};

export default useStateCheckout;
