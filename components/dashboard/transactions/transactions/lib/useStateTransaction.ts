import { useState, useEffect } from "react";

import { toast } from "sonner";

import { API_CONFIG } from "@/lib/config";

import useFormatDate from "@/hooks/FormatDate";

import { fetchProductsRatings } from "@/utils/fetching/FetchProducts";

export function useStateTransaction() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRatingsDialogOpen, setIsRatingsDialogOpen] = useState(false);
  const [productRatings, setProductRatings] = useState<
    Record<string, Rating | null>
  >({});
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        const url = new URL(
          API_CONFIG.ENDPOINTS.transactions,
          window.location.origin
        );
        url.searchParams.append("page", page.toString());
        url.searchParams.append("limit", limit.toString());

        const response = await fetch(url.toString(), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Failed to fetch transactions: ${response.status}`
          );
        }

        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);

        // Get pagination info from headers
        const paginationPage = response.headers.get("X-Pagination-Page");
        const paginationLimit = response.headers.get("X-Pagination-Limit");
        const paginationTotal = response.headers.get("X-Pagination-Total");
        const paginationTotalPages = response.headers.get(
          "X-Pagination-TotalPages"
        );
        const paginationHasNextPage = response.headers.get(
          "X-Pagination-HasNextPage"
        );
        const paginationHasPrevPage = response.headers.get(
          "X-Pagination-HasPrevPage"
        );

        if (paginationPage && paginationTotal) {
          setPagination({
            page: parseInt(paginationPage, 10),
            limit: parseInt(paginationLimit || "10", 10),
            total: parseInt(paginationTotal, 10),
            totalPages: parseInt(paginationTotalPages || "1", 10),
            hasNextPage: paginationHasNextPage === "true",
            hasPrevPage: paginationHasPrevPage === "true",
          });
        } else {
          setPagination(null);
        }
        setError(null);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
        setError(
          error instanceof Error ? error.message : "Failed to load transactions"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [page, limit]);

  // Refresh transactions after delete
  const refreshTransactions = async () => {
    try {
      const url = new URL(
        API_CONFIG.ENDPOINTS.transactions,
        window.location.origin
      );
      url.searchParams.append("page", page.toString());
      url.searchParams.append("limit", limit.toString());

      const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);

        // Get pagination info from headers
        const paginationPage = response.headers.get("X-Pagination-Page");
        const paginationLimit = response.headers.get("X-Pagination-Limit");
        const paginationTotal = response.headers.get("X-Pagination-Total");
        const paginationTotalPages = response.headers.get(
          "X-Pagination-TotalPages"
        );
        const paginationHasNextPage = response.headers.get(
          "X-Pagination-HasNextPage"
        );
        const paginationHasPrevPage = response.headers.get(
          "X-Pagination-HasPrevPage"
        );

        if (paginationPage && paginationTotal) {
          setPagination({
            page: parseInt(paginationPage, 10),
            limit: parseInt(paginationLimit || "10", 10),
            total: parseInt(paginationTotal, 10),
            totalPages: parseInt(paginationTotalPages || "1", 10),
            hasNextPage: paginationHasNextPage === "true",
            hasPrevPage: paginationHasPrevPage === "true",
          });
        } else {
          setPagination(null);
        }
      }
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    }
  };

  // Handle view details
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  // Handle view ratings
  const handleViewRatings = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsRatingsDialogOpen(true);
  };

  // Fetch ratings for products
  const fetchRatings = async (transaction: Transaction) => {
    if (
      !transaction ||
      transaction.status !== "success" ||
      !transaction.products
    ) {
      return;
    }

    setRatingsLoading(true);
    const ratings: Record<string, Rating | null> = {};

    for (const product of transaction.products) {
      try {
        // Mengambil semua ratings dari collection ratings seperti di product details
        const allRatings = await fetchProductsRatings(
          product.productsId,
          1,
          100
        );

        // Filter untuk mendapatkan rating dari user yang melakukan transaksi
        const userRating = allRatings.find(
          (rating: Rating) => rating.author._id === transaction.user._id
        );

        ratings[product.productsId] = userRating || null;
      } catch (error) {
        console.error(
          `Failed to fetch rating for product ${product.productsId}:`,
          error
        );
        ratings[product.productsId] = null;
      }
    }

    setProductRatings(ratings);
    setRatingsLoading(false);
  };

  // Fetch ratings when ratings dialog opens
  useEffect(() => {
    if (isRatingsDialogOpen && selectedTransaction) {
      fetchRatings(selectedTransaction);
    } else {
      // Reset ratings when dialog closes
      setProductRatings({});
      setRatingsLoading(false);
    }
  }, [isRatingsDialogOpen, selectedTransaction]);

  // Send email notification
  const handleSendEmail = async (transaction: Transaction) => {
    if (!transaction.order_id) {
      toast.error("Order ID tidak ditemukan");
      return;
    }

    setSendingEmails((prev) => new Set(prev).add(transaction.order_id!));

    try {
      const response = await fetch(
        `${API_CONFIG.ENDPOINTS.transactions}/send-email`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: transaction.order_id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to send email");
      }

      toast.success(
        `Email berhasil dikirim ke ${transaction.user?.email || "pengguna"}`
      );
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengirim email"
      );
    } finally {
      setSendingEmails((prev) => {
        const newSet = new Set(prev);
        newSet.delete(transaction.order_id!);
        return newSet;
      });
    }
  };

  // Handle delete transaction
  const handleDeleteClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return;

    setIsDeleting(true);

    try {
      const transactionId = selectedTransaction._id;
      const orderId = selectedTransaction.order_id;

      const url = new URL(
        `${API_CONFIG.ENDPOINTS.transactions}/delete`,
        window.location.origin
      );
      if (transactionId) {
        url.searchParams.append("id", transactionId);
      } else if (orderId) {
        url.searchParams.append("order_id", orderId);
      }

      const response = await fetch(url.toString(), {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete transaction");
      }

      toast.success("Transaction deleted successfully");
      setDeleteModalOpen(false);
      setSelectedTransaction(null);

      // Refresh transactions list
      await refreshTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus transaksi"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedTransaction(null);
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter - search by order_id, user name/email, or product titles
    const matchesSearch =
      searchTerm === "" ||
      transaction.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.user?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.products?.some((product) =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Status filter
    const matchesStatus =
      selectedStatus === "all" || transaction.status === selectedStatus;

    // Payment method filter
    const matchesPaymentMethod =
      selectedPaymentMethod === "all" ||
      transaction.paymentMethod === selectedPaymentMethod;

    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const { formatDate: formatDateHook } = useFormatDate();

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return formatDateHook(dateString);
  };

  const hasActiveFilters =
    searchTerm || selectedStatus !== "all" || selectedPaymentMethod !== "all";

  // Calculate totals
  const totalFilteredAmount = filteredTransactions.reduce(
    (sum, transaction) => {
      return sum + (transaction.total_amount || 0);
    },
    0
  );

  const totalAllAmount = transactions.reduce((sum, transaction) => {
    return sum + (transaction.total_amount || 0);
  }, 0);

  // Calculate totals by status
  const totalSuccessAmount = filteredTransactions
    .filter((t) => t.status === "success")
    .reduce((sum, transaction) => sum + (transaction.total_amount || 0), 0);

  const totalPendingAmount = filteredTransactions
    .filter((t) => t.status === "pending")
    .reduce((sum, transaction) => sum + (transaction.total_amount || 0), 0);

  return {
    // State
    transactions,
    isLoading,
    error,
    searchTerm,
    selectedStatus,
    selectedPaymentMethod,
    selectedTransaction,
    isDialogOpen,
    isRatingsDialogOpen,
    productRatings,
    ratingsLoading,
    sendingEmails,
    deleteModalOpen,
    isDeleting,
    page,
    limit,
    pagination,
    filteredTransactions,
    formatDate,
    hasActiveFilters,
    totalFilteredAmount,
    totalAllAmount,
    totalSuccessAmount,
    totalPendingAmount,
    // Setters
    setSearchTerm,
    setSelectedStatus,
    setSelectedPaymentMethod,
    setPage,
    setIsDialogOpen,
    setIsRatingsDialogOpen,
    setDeleteModalOpen,
    // Handlers
    handleViewDetails,
    handleViewRatings,
    handleSendEmail,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    refreshTransactions,
    fetchRatings,
  };
}
