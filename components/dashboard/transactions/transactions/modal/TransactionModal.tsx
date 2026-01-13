"use client";

import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { formatIDR } from "@/hooks/FormatPrice";

import {
    Receipt,
    FileText,
    User,
    Package,
    Building2,
    Clock,
    CheckCircle2,
} from "lucide-react";

import useFormatDate from "@/hooks/FormatDate";

import { getStatusVariant, getStatusColor } from "@/hooks/TextFormatter";

export default function TransactionModal({
    transaction,
    isOpen,
    onClose,
}: TransactionModalProps) {
    const { formatDate: formatDateHook } = useFormatDate();

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return formatDateHook(dateString);
    };

    const formatCurrency = (amount?: number) => {
        if (!amount) return "Rp 0";
        return `Rp ${formatIDR(amount)}`;
    };

    if (!transaction) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Receipt className="h-6 w-6" />
                        Detail Transaksi
                    </DialogTitle>
                    <DialogDescription>
                        Informasi lengkap transaksi {transaction?.order_id || ""}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4 overflow-y-auto pr-2 py-4">
                    {/* Order Information */}
                    <Card className="border-2">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Informasi Pesanan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Order ID</p>
                                    <p className="font-mono font-semibold text-sm bg-muted px-3 py-2 rounded border">
                                        {transaction.order_id || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                                    <Badge
                                        variant={getStatusVariant(transaction.status)}
                                        className={`${getStatusColor(transaction.status)} border font-semibold capitalize text-sm`}
                                    >
                                        {transaction.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Payment Method</p>
                                    <Badge
                                        variant={transaction.paymentMethod === "paid" ? "default" : "outline"}
                                        className="font-semibold capitalize"
                                    >
                                        {transaction.paymentMethod}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Amount</p>
                                    <p className="font-bold text-lg text-primary">
                                        {formatCurrency(transaction.total_amount)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Tanggal Dibuat</p>
                                    <p className="text-sm flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        {formatDate(transaction.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Terakhir Diupdate</p>
                                    <p className="text-sm flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        {formatDate(transaction.updated_at)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Information */}
                    <Card className="border-2">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informasi Pengguna
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Nama</p>
                                    <p className="font-semibold">{transaction.user?.name || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                                    <p className="text-sm">{transaction.user?.email || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Role</p>
                                    <Badge variant="outline" className="capitalize">
                                        {transaction.user?.role || "N/A"}
                                    </Badge>
                                </div>
                                {transaction.user?.picture && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Foto Profil</p>
                                        <Image
                                            src={transaction.user.picture}
                                            alt={transaction.user.name}
                                            width={64}
                                            height={64}
                                            className="rounded-full border-2"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products Information */}
                    <Card className="border-2">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Produk ({transaction.products?.length || 0})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="space-y-4">
                                {transaction.products && Array.isArray(transaction.products) ? (
                                    transaction.products.map((product: TransactionProduct, idx: number) => (
                                        <div
                                            key={product._id || idx}
                                            className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border-2 hover:bg-muted/30 transition-colors"
                                        >
                                            {product.thumbnail && (
                                                <div className="relative shrink-0 w-full sm:w-32 md:w-40 aspect-square rounded-lg overflow-hidden border-2 mx-auto sm:mx-0">
                                                    <Image
                                                        src={product.thumbnail}
                                                        alt={product.title}
                                                        fill
                                                        loading="lazy"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 space-y-2 min-w-0">
                                                <div>
                                                    <p className="font-semibold text-sm sm:text-base wrap-break-word">{product.title}</p>
                                                    <p className="text-xs text-muted-foreground font-mono break-all">
                                                        ID: {product.productsId}
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 text-sm">
                                                    <div>
                                                        <p className="text-muted-foreground text-xs sm:text-sm">Quantity</p>
                                                        <p className="font-semibold text-sm sm:text-base">{product.quantity}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground text-xs sm:text-sm">Harga Satuan</p>
                                                        <p className="font-semibold text-sm sm:text-base wrap-break-word">{formatCurrency(product.price)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground text-xs sm:text-sm">Subtotal</p>
                                                        <p className="font-semibold text-sm sm:text-base text-primary wrap-break-word">
                                                            {formatCurrency((product.price || 0) * (product.quantity || 0))}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground text-xs sm:text-sm">Tipe</p>
                                                        <Badge variant={product.paymentType === "paid" ? "default" : "outline"} className="text-xs">
                                                            {product.paymentType}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                {product.discount && (
                                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2 w-full sm:w-fit">
                                                        <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 wrap-break-word">
                                                            Diskon: {product.discount.type === "percentage" ? `${product.discount.value}%` : formatCurrency(product.discount.value)}
                                                            {product.discount.until && ` (Berlaku hingga ${formatDate(product.discount.until)})`}
                                                        </p>
                                                    </div>
                                                )}
                                                {product.downloadUrl && (
                                                    <div>
                                                        <a
                                                            href={product.downloadUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-primary hover:underline flex items-center gap-1 break-all"
                                                        >
                                                            <FileText className="h-3 w-3 shrink-0" />
                                                            <span className="truncate">Download URL</span>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center py-4">No products</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Details */}
                    {transaction.payment_details && Object.keys(transaction.payment_details).length > 0 && (
                        <Card className="border-2">
                            <CardHeader className="bg-muted/30">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Detail Pembayaran
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {transaction.payment_details.payment_type && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">Tipe Pembayaran</p>
                                            <p className="font-semibold">{transaction.payment_details.payment_type}</p>
                                        </div>
                                    )}
                                    {transaction.payment_details.bank && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">Bank</p>
                                            <p className="font-semibold">{transaction.payment_details.bank}</p>
                                        </div>
                                    )}
                                    {transaction.payment_details.va_number && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">Nomor VA</p>
                                            <p className="font-mono font-semibold">{transaction.payment_details.va_number}</p>
                                        </div>
                                    )}
                                    {transaction.payment_details.transaction_id && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">Transaction ID</p>
                                            <p className="font-mono text-xs break-all">{transaction.payment_details.transaction_id}</p>
                                        </div>
                                    )}
                                    {transaction.payment_details.transaction_time && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">Waktu Transaksi</p>
                                            <p className="text-sm flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                {formatDate(transaction.payment_details.transaction_time)}
                                            </p>
                                        </div>
                                    )}
                                    {transaction.payment_details.settlement_time && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">Waktu Settlement</p>
                                            <p className="text-sm flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4" />
                                                {formatDate(transaction.payment_details.settlement_time)}
                                            </p>
                                        </div>
                                    )}
                                    {transaction.payment_details.currency && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-1">Currency</p>
                                            <p className="font-semibold">{transaction.payment_details.currency}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
