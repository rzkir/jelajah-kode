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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/hooks/FormatPrice";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/config";
import DeleteModalTransaction from "../pending/modal/DeleteModalTransaction";

export default function TransactionCanceled() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
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
                // Filter hanya transaksi dengan status "canceled"
                const canceledTransactions = Array.isArray(data)
                    ? data.filter((txn: Transaction) => txn.status === "canceled")
                    : [];
                setTransactions(canceledTransactions);
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
            const response = await fetch("API_CONFIG.ENDPOINTS.transactions", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                const canceledTransactions = Array.isArray(data)
                    ? data.filter((txn: Transaction) => txn.status === "canceled")
                    : [];
                setTransactions(canceledTransactions);
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

    // Format currency helper
    const formatCurrency = (amount?: number) => {
        if (!amount) return "Rp 0";
        return `Rp ${formatIDR(amount)}`;
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

    if (isLoading) {
        return (
            <section className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Canceled Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-20 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>
        );
    }

    return (
        <section className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Canceled Transactions</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Total: {transactions.length} canceled transaction(s)
                    </p>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <div className="text-center py-12">
                            <p className="text-destructive font-medium">Error: {error}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Please check your connection and try again.
                            </p>
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No canceled transactions found</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Products</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                    <TableHead>Total Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow key={transaction._id}>
                                        <TableCell className="font-mono text-xs">
                                            {transaction.order_id || "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {transaction.user?.name || "N/A"}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {transaction.user?.email || "N/A"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-2 max-w-xs">
                                                {transaction.products && Array.isArray(transaction.products) ? (
                                                    transaction.products.map((product: TransactionProduct, idx: number) => (
                                                        <div
                                                            key={product._id || idx}
                                                            className="flex items-center gap-2"
                                                        >
                                                            {product.thumbnail && (
                                                                <Image
                                                                    src={product.thumbnail}
                                                                    alt={product.title}
                                                                    width={40}
                                                                    height={40}
                                                                    className="rounded object-cover"
                                                                />
                                                            )}
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="text-sm font-medium truncate">
                                                                    {product.title}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    Qty: {product.quantity} × Rp{" "}
                                                                    {formatIDR(product.price)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">No products</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="destructive">
                                                {transaction.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    transaction.paymentMethod === "paid"
                                                        ? "default"
                                                        : "outline"
                                                }
                                            >
                                                {transaction.paymentMethod}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {formatCurrency(transaction.total_amount)}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {formatDate(transaction.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteClick(transaction)}
                                                className="gap-2"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

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
