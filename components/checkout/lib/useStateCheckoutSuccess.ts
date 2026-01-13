"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "sonner";

import confetti from "canvas-confetti";

import { API_CONFIG } from "@/lib/config";

import { useAuth } from "@/utils/context/AuthContext";

import { useCart } from "@/utils/context/CartContext";

const useStateCheckoutSuccess = ({ status }: UseStateCheckoutSuccessParams) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { clearCart } = useCart();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<TransactionProduct | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [productRatings, setProductRatings] = useState<
    Record<string, RatingData>
  >({});
  const [isContinuingPayment, setIsContinuingPayment] = useState(false);
  const confettiTriggered = useRef(false);
  const cartCleared = useRef(false);

  const fetchTransaction = useCallback(
    async (orderId: string) => {
      try {
        setIsLoading(true);
        // Always use proxy route to handle cookie forwarding (works in both dev and production)
        const transactionsUrl = API_CONFIG.ENDPOINTS.transactions;

        const response = await fetch(`${transactionsUrl}?order_id=${orderId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch transaction");
        }

        const data = await response.json();

        if (status && data.status.toLowerCase() !== status.toLowerCase()) {
          toast.error(
            `Transaction status mismatch. Expected ${status}, got ${data.status}`
          );
          router.push("/products");
          return;
        }

        setTransaction(data);

        if (data.paymentMethod === "paid" && data.order_id) {
          try {
            // Always use proxy route to handle cookie forwarding (works in both dev and production)
            const transactionsUrl = API_CONFIG.ENDPOINTS.transactions;

            const refreshResponse = await fetch(
              `${transactionsUrl}?order_id=${orderId}`,
              {
                credentials: "include",
              }
            );

            if (refreshResponse.ok) {
              const refreshedData = await refreshResponse.json();
              setTransaction(refreshedData);
            }
          } catch (error) {
            console.error(
              "Failed to refresh transaction from Midtrans:",
              error
            );
          }
        }

        if (data.status === "success" && data.products) {
          const ratings: Record<string, RatingData> = {};
          for (const product of data.products) {
            try {
              // Always use proxy route to handle cookie forwarding (works in both dev and production)
              const ratingsUrl = API_CONFIG.ENDPOINTS.ratings;

              const ratingResponse = await fetch(
                `${ratingsUrl}?productsId=${product.productsId}`,
                {
                  credentials: "include",
                }
              );
              if (ratingResponse.ok) {
                const ratingData = await ratingResponse.json();
                ratings[product.productsId] = ratingData;
              }
            } catch (error) {
              console.error(
                `Failed to fetch rating for product ${product.productsId}:`,
                error
              );
            }
          }
          setProductRatings(ratings);
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to load transaction"
        );
        router.push("/products");
      } finally {
        setIsLoading(false);
      }
    },
    [router, status]
  );

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error("Please login to view transaction");
      router.push("/signin");
      return;
    }

    if (status) {
      const validStatuses = ["success", "pending", "cancelled", "expired"];
      if (!validStatuses.includes(status.toLowerCase())) {
        toast.error("Invalid transaction status");
        router.push("/products");
        return;
      }
    }

    const orderId = searchParams.get("order_id");
    if (!orderId) {
      toast.error("Order ID is required");
      router.push("/products");
      return;
    }

    fetchTransaction(orderId);
  }, [authLoading, fetchTransaction, router, searchParams, status, user]);

  // Clear cart when transaction is successful (only once)
  useEffect(() => {
    if (
      !authLoading &&
      !isLoading &&
      transaction?.status === "success" &&
      !cartCleared.current
    ) {
      // Clear cart when checkout is successful
      clearCart();
      cartCleared.current = true;
    }
  }, [authLoading, isLoading, transaction?.status, clearCart]);

  // Trigger confetti celebration when success page is first loaded
  // Wait for loading to complete before showing confetti
  useEffect(() => {
    // Only trigger if loading is complete and transaction is success
    if (
      !authLoading &&
      !isLoading &&
      transaction?.status === "success" &&
      !confettiTriggered.current
    ) {
      // Add a small delay to ensure loading overlay is fully gone
      const timer = setTimeout(() => {
        confettiTriggered.current = true;

        // Main confetti burst
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [
            "#10b981",
            "#3b82f6",
            "#f59e0b",
            "#ef4444",
            "#8b5cf6",
            "#ec4899",
          ],
        });

        // Additional bursts for more celebration
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#10b981", "#3b82f6", "#f59e0b"],
          });
        }, 250);

        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#10b981", "#3b82f6", "#f59e0b"],
          });
        }, 400);
      }, 300); // 300ms delay to ensure overlay is gone

      return () => clearTimeout(timer);
    }
  }, [authLoading, isLoading, transaction?.status]);

  const handleDownload = useCallback(
    async (downloadUrl?: string, productsId?: string) => {
      if (!downloadUrl) {
        toast.error("Download URL not available");
        return;
      }

      if (productsId) {
        try {
          const response = await fetch(
            `${API_CONFIG.ENDPOINTS.products.base}/${productsId}/download`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (!response.ok) {
            console.error("Failed to update download count");
          }
        } catch (error) {
          console.error("Failed to update download count:", error);
        }
      }

      window.open(downloadUrl, "_blank");
    },
    []
  );

  const handleOpenRatingModal = useCallback(
    (product: TransactionProduct) => {
      setSelectedProduct(product);
      const existingRating = productRatings[product.productsId];
      if (existingRating?.hasRated && existingRating.rating) {
        setRating(existingRating.rating.rating);
        setComment(existingRating.rating.comment);
      } else {
        setRating(0);
        setComment("");
      }
      setRatingModalOpen(true);
    },
    [productRatings]
  );

  const handleSubmitRating = useCallback(async () => {
    if (!selectedProduct || rating === 0 || !comment.trim()) {
      toast.error("Please provide a rating and comment");
      return;
    }

    setIsSubmittingRating(true);
    try {
      // For development: use proxy route to handle cookie forwarding
      // For production: use direct backend call
      // Always use proxy route to handle cookie forwarding (works in both dev and production)
      const ratingsUrl = API_CONFIG.ENDPOINTS.ratings;

      const response = await fetch(ratingsUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productsId: selectedProduct.productsId,
          rating,
          comment: comment.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit rating");
      }

      const data = await response.json();

      setProductRatings((prev) => ({
        ...prev,
        [selectedProduct.productsId]: {
          hasRated: true,
          rating: {
            _id: data._id,
            rating: data.rating,
            comment: data.comment,
          },
        },
      }));

      toast.success("Thank you for your rating!");
      setRatingModalOpen(false);
      setRating(0);
      setComment("");
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit rating"
      );
    } finally {
      setIsSubmittingRating(false);
    }
  }, [comment, rating, selectedProduct]);

  const handleContinuePayment = useCallback(() => {
    if (!transaction?.snap_token) {
      toast.error("Payment token not available");
      return;
    }

    setIsContinuingPayment(true);

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
          setIsContinuingPayment(false);
          return;
        }
        setTimeout(openSnapPayment, 100);
        return;
      }

      try {
        if (!transaction.snap_token) {
          throw new Error("Snap token not available");
        }

        window.snap.pay(transaction.snap_token, {
          onSuccess: async (result: { order_id: string }) => {
            setIsContinuingPayment(false);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (result.order_id) {
              try {
                await fetchTransaction(result.order_id);
                toast.success("Payment successful! Transaction updated.");
              } catch (error) {
                console.error("Error refreshing transaction:", error);
                toast.success("Payment successful!");
              }
            } else {
              toast.success("Payment successful!");
            }

            setTimeout(() => {
              router.push(`/checkout/success?order_id=${result.order_id}`);
            }, 1500);
          },
          onPending: async (result: { order_id: string }) => {
            setIsContinuingPayment(false);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (result.order_id) {
              try {
                await fetchTransaction(result.order_id);
                toast.info("Payment pending. Transaction updated.");
              } catch (error) {
                console.error("Error refreshing transaction:", error);
                toast.info("Payment pending. Please complete the payment.");
              }
            } else {
              toast.info("Payment pending. Please complete the payment.");
            }

            setTimeout(() => {
              router.push(`/checkout/pending?order_id=${result.order_id}`);
            }, 1500);
          },
          onError: () => {
            toast.error("Payment failed. Please try again.");
            setIsContinuingPayment(false);
          },
          onClose: () => {
            toast.info("Payment window closed");
            setIsContinuingPayment(false);
          },
        });
      } catch (error) {
        console.error("Error opening Snap payment:", error);
        toast.error("Failed to open payment gateway. Please try again.");
        setIsContinuingPayment(false);
      }
    };

    openSnapPayment();
  }, [fetchTransaction, router, transaction]);

  return {
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
  };
};

export default useStateCheckoutSuccess;
