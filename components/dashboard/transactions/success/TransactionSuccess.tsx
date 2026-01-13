"use client";

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

import { Search, Filter, X, Calendar, DollarSign, User, Package, CreditCard, TrendingUp } from "lucide-react";

import { getStatusVariant, getStatusColor } from "@/hooks/TextFormatter";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import { useStateTransactionSuccess } from "@/components/dashboard/transactions/success/lib/useStateTransactionSuccess";

import TransactionSkelaton from "@/components/dashboard/transactions/transactions/TransactionSkelaton";

export default function TransactionSuccess() {
    const {
        transactions,
        isLoading,
        error,
        searchTerm,
        selectedPaymentMethod,
        pagination,
        filteredTransactions,
        setSearchTerm,
        setSelectedPaymentMethod,
        setPage,
        formatDate,
        hasActiveFilters,
        totalFilteredAmount,
        totalAllAmount,
        totalPaidAmount,
        totalFreeAmount,
    } = useStateTransactionSuccess();

    if (isLoading) {
        return (
            <TransactionSkelaton />
        );
    }

    return (
        <section className="flex flex-col gap-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-2 shadow-md">
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Success Revenue</p>
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
                                <p className="text-sm font-medium text-muted-foreground">Total Success Transactions</p>
                                <p className="text-2xl font-bold mt-1">
                                    {filteredTransactions.length}
                                </p>
                                {hasActiveFilters && filteredTransactions.length !== transactions.length && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        All: {transactions.length}
                                    </p>
                                )}
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-md">
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Paid Revenue</p>
                                <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                                    Rp {formatIDR(totalPaidAmount)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {filteredTransactions.filter(t => t.paymentMethod === "paid").length} transaction(s)
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
                                <p className="text-sm font-medium text-muted-foreground">Free Revenue</p>
                                <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                                    Rp {formatIDR(totalFreeAmount)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {filteredTransactions.filter(t => t.paymentMethod === "free").length} transaction(s)
                                </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-2 shadow-lg">
                <CardHeader className="pb-4 border-b bg-muted/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Success Transactions</CardTitle>
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
                            <p className="text-foreground font-semibold text-lg mb-2">No success transactions found</p>
                            {hasActiveFilters ? (
                                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                    No success transactions match your current filters. Try adjusting your search criteria.
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    There are no success transactions available at this time.
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
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                                {pagination.total} transactions
                            </div>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => {
                                                if (pagination.hasPrevPage) {
                                                    setPage((prev) => Math.max(1, prev - 1));
                                                }
                                            }}
                                            className={
                                                !pagination.hasPrevPage
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>

                                    {/* Page numbers */}
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
                                        const showPage =
                                            pageNum === 1 ||
                                            pageNum === pagination.totalPages ||
                                            (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1);

                                        if (!showPage) {
                                            if (
                                                pageNum === pagination.page - 2 ||
                                                pageNum === pagination.page + 2
                                            ) {
                                                return (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }
                                            return null;
                                        }

                                        return (
                                            <PaginationItem key={pageNum}>
                                                <PaginationLink
                                                    onClick={() => setPage(pageNum)}
                                                    isActive={pageNum === pagination.page}
                                                    className="cursor-pointer"
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => {
                                                if (pagination.hasNextPage) {
                                                    setPage((prev) => prev + 1);
                                                }
                                            }}
                                            className={
                                                !pagination.hasNextPage
                                                    ? "pointer-events-none opacity-50"
                                                    : "cursor-pointer"
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
