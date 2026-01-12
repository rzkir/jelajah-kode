"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/utils/context/AuthContext";
import { API_CONFIG } from "@/lib/config";
import { toast } from "sonner";

export default function useStateOrderDetails() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const orderId = params?.order_id as string;

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
        router.push("/profile");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

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

  const handleCloseRatingModal = useCallback(() => {
    setRatingModalOpen(false);
    setRating(0);
    setComment("");
    setSelectedProduct(null);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error("Please login to view order details");
      router.push("/signin");
      return;
    }

    if (!orderId) {
      toast.error("Order ID is required");
      router.push("/profile");
      return;
    }

    fetchTransaction(orderId);
  }, [authLoading, fetchTransaction, router, orderId, user]);

  return {
    // State
    transaction,
    isLoading,
    ratingModalOpen,
    selectedProduct,
    rating,
    hoveredRating,
    comment,
    isSubmittingRating,
    productRatings,
    authLoading,
    // Setters
    setRatingModalOpen,
    setRating,
    setHoveredRating,
    setComment,
    // Functions
    fetchTransaction,
    handleDownload,
    handleOpenRatingModal,
    handleSubmitRating,
    handleCloseRatingModal,
  };
}
