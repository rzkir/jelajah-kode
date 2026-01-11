import { useState, useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/utils/context/AuthContext";

import { toast } from "sonner";

import { API_CONFIG } from "@/lib/config";

export function useStateProfile() {
  const { user, loading, refreshUserData } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [isUpdating, setIsUpdating] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [continuingPayment, setContinuingPayment] = useState<Set<string>>(
    new Set()
  );
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  interface Review {
    id: string;
    product: string;
    rating: number;
    title: string;
    comment: string;
    date: string;
  }

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Fetch transactions when user is available
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      setTransactionsLoading(true);
      try {
        // For development: use proxy route to handle cookie forwarding
        // For production: use direct backend call
        const transactionsUrl =
          process.env.NODE_ENV === "development"
            ? "/api/proxy-transactions" // Use proxy in development
            : API_CONFIG.ENDPOINTS.transactions; // Direct call in production

        const response = await fetch(transactionsUrl, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transactions");
      } finally {
        setTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  // Fetch user reviews when user is available
  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;

      setReviewsLoading(true);
      try {
        // For development: use proxy route to handle cookie forwarding
        // For production: use direct backend call
        const ratingsUrl =
          process.env.NODE_ENV === "development"
            ? "/api/proxy-ratings" // Use proxy in development
            : API_CONFIG.ENDPOINTS.ratings; // Direct call in production

        const response = await fetch(`${ratingsUrl}?userId=me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        // Transform the data to match the Review interface
        const transformedReviews: Review[] = (data.reviews || []).map(
          (review: {
            _id: string;
            rating: number;
            comment: string;
            created_at?: string;
            updated_at?: string;
            product?: { title: string; productsId: string } | null;
          }) => ({
            id: review._id,
            product: review.product?.title || "Unknown Product",
            rating: review.rating,
            title:
              review.comment.substring(0, 50) +
              (review.comment.length > 50 ? "..." : ""),
            comment: review.comment,
            date: review.created_at || review.updated_at,
          })
        );
        setReviews(transformedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews");
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  // Refresh transactions after payment
  const refreshTransactions = async () => {
    if (!user) return;

    try {
      // For development: use proxy route to handle cookie forwarding
      // For production: use direct backend call
      const transactionsUrl =
        process.env.NODE_ENV === "development"
          ? "/api/proxy-transactions" // Use proxy in development
          : API_CONFIG.ENDPOINTS.transactions; // Direct call in production

      const response = await fetch(transactionsUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    if (!formData.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsUpdating(true);

    try {
      // For development: use proxy route to handle cookie forwarding
      // For production: use direct backend call
      const meUrl =
        process.env.NODE_ENV === "development"
          ? "/api/auth/proxy-me" // Use proxy in development
          : API_CONFIG.ENDPOINTS.me; // Direct call in production

      const response = await fetch(meUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      // Refresh user data
      await refreshUserData();

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle picture upload
  const handleEditPicture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploadingPicture(true);

    try {
      // Upload to ImageKit
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(API_CONFIG.ENDPOINTS.uploadPicture, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const uploadResult = await uploadResponse.json();

      // Update user profile with new picture URL
      // For development: use proxy route to handle cookie forwarding
      // For production: use direct backend call
      const meUrl =
        process.env.NODE_ENV === "development"
          ? "/api/auth/proxy-me" // Use proxy in development
          : API_CONFIG.ENDPOINTS.me; // Direct call in production

      const updateResponse = await fetch(meUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          picture: uploadResult.url,
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      // Refresh user data
      await refreshUserData();

      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading picture:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload picture. Please try again."
      );
    } finally {
      setIsUploadingPicture(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle continue payment
  const handleContinuePayment = async (transaction: Transaction) => {
    if (!transaction.snap_token) {
      toast.error("Payment token tidak tersedia");
      return;
    }

    if (!transaction.order_id) {
      toast.error("Order ID tidak ditemukan");
      return;
    }

    setContinuingPayment((prev) =>
      new Set(prev).add(transaction.order_id || transaction._id)
    );

    let retryCount = 0;
    const maxRetries = 50;

    const openSnapPayment = () => {
      if (typeof window === "undefined" || !window.snap) {
        retryCount++;
        if (retryCount >= maxRetries) {
          toast.error("Payment gateway gagal dimuat. Silakan refresh halaman.");
          console.error("Snap script not available after timeout");
          setContinuingPayment((prev) => {
            const newSet = new Set(prev);
            newSet.delete(transaction.order_id || transaction._id);
            return newSet;
          });
          return;
        }
        setTimeout(openSnapPayment, 100);
        return;
      }

      try {
        if (!transaction.snap_token) {
          throw new Error("Snap token tidak tersedia");
        }

        window.snap.pay(transaction.snap_token, {
          onSuccess: async (result: { order_id: string }) => {
            setContinuingPayment((prev) => {
              const newSet = new Set(prev);
              newSet.delete(transaction.order_id || transaction._id);
              return newSet;
            });

            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Refresh transactions
            await refreshTransactions();

            toast.success("Pembayaran berhasil!");
            setTimeout(() => {
              router.push(`/checkout/success?order_id=${result.order_id}`);
            }, 1500);
          },
          onPending: async (result: { order_id: string }) => {
            setContinuingPayment((prev) => {
              const newSet = new Set(prev);
              newSet.delete(transaction.order_id || transaction._id);
              return newSet;
            });

            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Refresh transactions
            await refreshTransactions();

            toast.info("Pembayaran pending. Silakan selesaikan pembayaran.");
            setTimeout(() => {
              router.push(`/checkout/pending?order_id=${result.order_id}`);
            }, 1500);
          },
          onError: () => {
            setContinuingPayment((prev) => {
              const newSet = new Set(prev);
              newSet.delete(transaction.order_id || transaction._id);
              return newSet;
            });
            toast.error("Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: () => {
            setContinuingPayment((prev) => {
              const newSet = new Set(prev);
              newSet.delete(transaction.order_id || transaction._id);
              return newSet;
            });
            toast.info("Jendela pembayaran ditutup");
          },
        });
      } catch (error) {
        console.error("Error opening Snap payment:", error);
        toast.error("Gagal membuka payment gateway. Silakan coba lagi.");
        setContinuingPayment((prev) => {
          const newSet = new Set(prev);
          newSet.delete(transaction.order_id || transaction._id);
          return newSet;
        });
      }
    };

    openSnapPayment();
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeletingAccount(true);

    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.deleteAccount, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete account");
      }

      toast.success("Account deleted successfully");
      setIsDeleteAccountOpen(false);

      // Sign out and redirect to signin
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/signin?deleted=true");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete account. Please try again."
      );
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return {
    // State
    activeTab,
    setActiveTab,
    isUpdating,
    transactions,
    transactionsLoading,
    continuingPayment,
    isUploadingPicture,
    fileInputRef,
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    isDeleteAccountOpen,
    setIsDeleteAccountOpen,
    isDeletingAccount,
    formData,
    setFormData,
    user,
    loading,
    reviews,
    reviewsLoading,

    // Functions
    handleUpdateProfile,
    handleEditPicture,
    handleFileChange,
    handleContinuePayment,
    handleDeleteAccount,
    refreshTransactions,
  };
}
