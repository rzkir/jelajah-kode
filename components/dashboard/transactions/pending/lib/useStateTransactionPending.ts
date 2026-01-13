import { useState, useEffect } from "react";

import { toast } from "sonner";

import { API_CONFIG } from "@/lib/config";

import useFormatDate from "@/hooks/FormatDate";

export function useStateTransactionPending() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("all");
  const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
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
        url.searchParams.append("status", "pending");

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
      url.searchParams.append("status", "pending");

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

    // Payment method filter
    const matchesPaymentMethod =
      selectedPaymentMethod === "all" ||
      transaction.paymentMethod === selectedPaymentMethod;

    return matchesSearch && matchesPaymentMethod;
  });

  const { formatDate: formatDateHook } = useFormatDate();

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return formatDateHook(dateString);
  };

  const hasActiveFilters = searchTerm || selectedPaymentMethod !== "all";

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

  // Calculate totals by payment method
  const totalPaidAmount = filteredTransactions
    .filter((t) => t.paymentMethod === "paid")
    .reduce((sum, transaction) => sum + (transaction.total_amount || 0), 0);

  const totalFreeAmount = filteredTransactions
    .filter((t) => t.paymentMethod === "free")
    .reduce((sum, transaction) => sum + (transaction.total_amount || 0), 0);

  return {
    // State
    transactions,
    isLoading,
    error,
    searchTerm,
    selectedPaymentMethod,
    sendingEmails,
    deleteModalOpen,
    selectedTransaction,
    isDeleting,
    pagination,
    filteredTransactions,
    formatDate,
    hasActiveFilters,
    totalFilteredAmount,
    totalAllAmount,
    totalPaidAmount,
    totalFreeAmount,
    // Setters
    setSearchTerm,
    setSelectedPaymentMethod,
    setPage,
    setDeleteModalOpen,
    // Handlers
    handleSendEmail,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    refreshTransactions,
  };
}
