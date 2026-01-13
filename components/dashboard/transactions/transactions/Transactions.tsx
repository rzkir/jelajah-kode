"use client";

import { useState, useEffect } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Skeleton } from "@/components/ui/skeleton";

import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { formatIDR } from "@/hooks/FormatPrice";

import Image from "next/image";

import { Search, Filter, X, Calendar, DollarSign, User, Package, CreditCard, TrendingUp, Eye, Mail, Loader2, Trash2, Star } from "lucide-react";

import TransactionModal from "@/components/dashboard/transactions/transactions/modal/TransactionModal";

import TransactionRatings from "@/components/dashboard/transactions/transactions/modal/TransactionRatings";

import DeleteModalTransaction from "@/components/dashboard/transactions/pending/modal/DeleteModalTransaction";

import { getStatusVariant, getStatusColor } from "@/hooks/TextFormatter";

import { toast } from "sonner";

import { API_CONFIG } from "@/lib/config";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar";

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("all");
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRatingsDialogOpen, setIsRatingsDialogOpen] = useState(false);
    const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set());
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(API_CONFIG.ENDPOINTS.transactions, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `Failed to fetch transactions: ${response.status}`);
                }

                const data = await response.json();
                setTransactions(Array.isArray(data) ? data : []);
                setError(null);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setTransactions([]);
                setError(error instanceof Error ? error.message : "Failed to load transactions");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // Refresh transactions after delete
    const refreshTransactions = async () => {
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.transactions, {
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

    // Format date helper
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
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

    // Send email notification
    const handleSendEmail = async (transaction: Transaction) => {
        if (!transaction.order_id) {
            toast.error("Order ID tidak ditemukan");
            return;
        }

        setSendingEmails((prev) => new Set(prev).add(transaction.order_id!));

        try {
            const response = await fetch(`${API_CONFIG.ENDPOINTS.transactions}/send-email`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    order_id: transaction.order_id,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to send email");
            }

            toast.success(`Email berhasil dikirim ke ${transaction.user?.email || "pengguna"}`);
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

            const url = new URL(`${API_CONFIG.ENDPOINTS.transactions}/delete`, window.location.origin);
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
            (transaction.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                transaction.products?.some((product) =>
                    product.title?.toLowerCase().includes(searchTerm.toLowerCase())
                ));

        // Status filter
        const matchesStatus =
            selectedStatus === "all" || transaction.status === selectedStatus;

        // Payment method filter
        const matchesPaymentMethod =
            selectedPaymentMethod === "all" ||
            transaction.paymentMethod === selectedPaymentMethod;

        return matchesSearch && matchesStatus && matchesPaymentMethod;
    });

    if (isLoading) {
        return (
            <section className="flex flex-col gap-6">
                <Card className="border-2">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold">Transactions</CardTitle>
                                <CardDescription className="mt-1">Loading transaction data...</CardDescription>
                            </div>
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 mb-6">
                            <Skeleton className="h-10 w-full" />
                            <div className="flex gap-3">
                                <Skeleton className="h-10 w-40" />
                                <Skeleton className="h-10 w-40" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-24 w-full rounded-lg" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>
        );
    }

    const hasActiveFilters = searchTerm || selectedStatus !== "all" || selectedPaymentMethod !== "all";

    // Calculate totals
    const totalFilteredAmount = filteredTransactions.reduce((sum, transaction) => {
        return sum + (transaction.total_amount || 0);
    }, 0);

    const totalAllAmount = transactions.reduce((sum, transaction) => {
        return sum + (transaction.total_amount || 0);
    }, 0);

    // Calculate totals by status
    const totalSuccessAmount = filteredTransactions
        .filter(t => t.status === "success")
        .reduce((sum, transaction) => sum + (transaction.total_amount || 0), 0);

    const totalPendingAmount = filteredTransactions
        .filter(t => t.status === "pending")
        .reduce((sum, transaction) => sum + (transaction.total_amount || 0), 0);

    return (
        <section className="flex flex-col gap-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-2 shadow-md">
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                                <p className="text-2xl font-bold mt-1 text-primary">
                                    Rp {formatIDR(totalFilteredAmount)}
                                </p>
                                {hasActiveFilters && totalFilteredAmount !== totalAllAmount && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        All: {formatIDR(totalAllAmount)}
                                    </p>
                                )}
                            </div>
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-md">
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                                <p className="text-2xl font-bold mt-1">
                                    {filteredTransactions.length}
                                </p>
                                {hasActiveFilters && filteredTransactions.length !== transactions.length && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        All: {transactions.length}
                                    </p>
                                )}
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Package className="h-6 w-6 text-blue-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-md">
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Success Revenue</p>
                                <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                                    Rp {formatIDR(totalSuccessAmount)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {filteredTransactions.filter(t => t.status === "success").length} transaction(s)
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-md">
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Pending Revenue</p>
                                <p className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                                    Rp {formatIDR(totalPendingAmount)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {filteredTransactions.filter(t => t.status === "pending").length} transaction(s)
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-2 shadow-lg">
                <CardHeader className="pb-4 border-b bg-muted/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">All Transactions</CardTitle>
                            <CardDescription className="mt-1.5 text-base">
                                <span className="font-semibold text-foreground">{filteredTransactions.length}</span> transaction(s)
                                {filteredTransactions.length !== transactions.length && (
                                    <span className="text-muted-foreground"> of <span className="font-semibold">{transactions.length}</span> total</span>
                                )}
                            </CardDescription>
                        </div>
                        {hasActiveFilters && (
                            <Badge variant="outline" className="w-fit gap-2 px-3 py-1.5">
                                <Filter className="h-3.5 w-3.5" />
                                Filters Active
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filter Controls */}
                    <div className="flex flex-col lg:flex-row gap-4 mb-6 p-4 bg-muted/30 rounded-lg border">
                        {/* Search Input */}
                        <div className="relative flex-1 group">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                type="text"
                                placeholder="Search by Order ID, User, or Product..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11 border-2 focus:border-primary/50 transition-colors"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Status Filter */}
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-full sm:w-[180px] h-11 border-2">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="Filter by Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="success">Success</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="canceled">Canceled</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Payment Method Filter */}
                            <Select
                                value={selectedPaymentMethod}
                                onValueChange={setSelectedPaymentMethod}
                            >
                                <SelectTrigger className="w-full sm:w-[180px] h-11 border-2">
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="Filter by Payment" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Payment Methods</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="free">Free</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {error ? (
                        <div className="text-center py-16 px-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                                <X className="h-8 w-8 text-destructive" />
                            </div>
                            <p className="text-destructive font-semibold text-lg mb-2">Error Loading Transactions</p>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                {error}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Please check your connection and try again.
                            </p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                <Package className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-foreground font-semibold text-lg mb-2">No transactions found</p>
                            {hasActiveFilters ? (
                                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                    No transactions match your current filters. Try adjusting your search criteria.
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    There are no transactions available at this time.
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-lg border-2 overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2">
                                            <TableHead className="font-bold text-sm h-12">
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    Order ID
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-bold text-sm">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    User
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-bold text-sm">Products</TableHead>
                                            <TableHead className="font-bold text-sm">Status</TableHead>
                                            <TableHead className="font-bold text-sm">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4" />
                                                    Payment
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-bold text-sm">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4" />
                                                    Total Amount
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-bold text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Date
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-bold text-sm text-center">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTransactions.map((transaction) => (
                                            <TableRow
                                                key={transaction._id}
                                                className="border-b hover:bg-muted/30 transition-colors group"
                                            >
                                                <TableCell className="py-4">
                                                    <div className="font-mono text-xs font-semibold bg-muted/50 px-2 py-1 rounded border inline-block group-hover:bg-muted transition-colors">
                                                        {transaction.order_id || "N/A"}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-semibold text-sm">
                                                            {transaction.user?.name || "N/A"}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                            {transaction.user?.email || "N/A"}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex flex-col gap-3 max-w-xs">
                                                        {transaction.products && Array.isArray(transaction.products) ? (
                                                            transaction.products.map((product: TransactionProduct, idx: number) => (
                                                                <div
                                                                    key={product._id || idx}
                                                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                                                >
                                                                    {product.thumbnail && (
                                                                        <div className="relative shrink-0">
                                                                            <Image
                                                                                src={product.thumbnail}
                                                                                alt={product.title}
                                                                                width={48}
                                                                                height={48}
                                                                                className="rounded-lg object-cover border-2 border-border"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex flex-col min-w-0 flex-1">
                                                                        <span className="text-sm font-medium truncate">
                                                                            {product.title}
                                                                        </span>
                                                                        <span className="text-xs text-muted-foreground">
                                                                            Qty: {product.quantity} × Rp{" "}
                                                                            Rp {formatIDR(product.price)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">No products</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge
                                                        variant={getStatusVariant(transaction.status)}
                                                        className={`${getStatusColor(transaction.status)} border font-semibold capitalize`}
                                                    >
                                                        {transaction.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge
                                                        variant={
                                                            transaction.paymentMethod === "paid"
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        className="font-semibold capitalize"
                                                    >
                                                        {transaction.paymentMethod}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="font-bold text-base text-primary">
                                                        Rp {formatIDR(transaction.total_amount || 0)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="text-sm text-muted-foreground">
                                                        {formatDate(transaction.created_at)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Menubar className="border-none shadow-none p-0 h-auto">
                                                        <MenubarMenu>
                                                            <MenubarTrigger className="h-8 py-1 data-[state=open]:bg-accent">
                                                                <span className="text-sm">Actions</span>
                                                            </MenubarTrigger>
                                                            <MenubarContent align="end">
                                                                <MenubarItem
                                                                    onClick={() => handleViewDetails(transaction)}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    Lihat Details
                                                                </MenubarItem>
                                                                <MenubarItem
                                                                    onClick={() => handleViewRatings(transaction)}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Star className="h-4 w-4 mr-2" />
                                                                    Lihat Reviews
                                                                </MenubarItem>
                                                                <MenubarItem
                                                                    onClick={() => handleSendEmail(transaction)}
                                                                    disabled={sendingEmails.has(transaction.order_id || "")}
                                                                    className="cursor-pointer"
                                                                >
                                                                    {sendingEmails.has(transaction.order_id || "") ? (
                                                                        <>
                                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                            Sending...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Mail className="h-4 w-4 mr-2" />
                                                                            Send Email
                                                                        </>
                                                                    )}
                                                                </MenubarItem>
                                                                <MenubarSeparator />
                                                                <MenubarItem
                                                                    onClick={() => handleDeleteClick(transaction)}
                                                                    variant="destructive"
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete
                                                                </MenubarItem>
                                                            </MenubarContent>
                                                        </MenubarMenu>
                                                    </Menubar>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Detail Dialog */}
            <TransactionModal
                transaction={selectedTransaction}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />

            {/* Ratings Dialog */}
            <TransactionRatings
                transaction={selectedTransaction}
                isOpen={isRatingsDialogOpen}
                onClose={() => setIsRatingsDialogOpen(false)}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModalTransaction
                isOpen={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                orderId={selectedTransaction?.order_id}
            />
        </section>
    );
}
