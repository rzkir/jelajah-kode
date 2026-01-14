"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { Search, TrendingUp, Package, DollarSign, ShoppingCart } from "lucide-react";

import Image from "next/image";

import { formatIDR } from "@/hooks/FormatPrice";

import { useStatePenjualanProducts } from "@/components/dashboard/laporan/penjualan-products/lib/useStatePenjualanProducts";

import { PenjualanProductsSkelaton } from "@/components/dashboard/laporan/LaporanSkelaton"

export default function PenjualanProducts() {
    const {
        isLoading,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        soldProducts,
        filteredAndSortedProducts,
        categories,
        summaryStats,
        chartData,
    } = useStatePenjualanProducts();

    if (isLoading) {
        return (
            <PenjualanProductsSkelaton />
        );
    }

    return (
        <section className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products Terjual</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatIDR(summaryStats.totalProducts)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Produk yang pernah terjual
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Unit Terjual</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatIDR(summaryStats.totalSold)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total unit yang terjual
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            Rp {formatIDR(summaryStats.totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total pendapatan dari penjualan
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatIDR(summaryStats.totalTransactions)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Jumlah transaksi berhasil
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart - Top 10 Products */}
            {chartData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Top 10 Products Terjual</CardTitle>
                        <CardDescription>Produk dengan penjualan tertinggi</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />
                                <YAxis tickFormatter={(value) => formatIDR(value)} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                    formatter={(value: number | undefined, name: string | undefined) => {
                                        const val = value ?? 0;
                                        const label = name ?? "";
                                        if (label === "pendapatan") {
                                            return [`Rp ${formatIDR(val)}`, "Pendapatan"];
                                        }
                                        return [formatIDR(val), "Terjual"];
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="terjual" fill="hsl(var(--chart-1))" name="Unit Terjual" />
                                <Bar dataKey="pendapatan" fill="hsl(var(--chart-2))" name="Pendapatan" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Products Terjual</CardTitle>
                    <CardDescription>
                        {filteredAndSortedProducts.length} dari {soldProducts.length} produk terjual
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari produk..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Semua Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Kategori</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.categoryId} value={cat.categoryId}>
                                        {cat.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sold">Terbanyak Terjual</SelectItem>
                                <SelectItem value="revenue">Pendapatan Tertinggi</SelectItem>
                                <SelectItem value="name">Nama A-Z</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    {filteredAndSortedProducts.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                {searchTerm || selectedCategory !== "all"
                                    ? "Tidak ada produk yang sesuai dengan filter"
                                    : "Belum ada produk yang terjual"}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Gambar</TableHead>
                                        <TableHead>Produk</TableHead>
                                        <TableHead className="text-center">Kategori</TableHead>
                                        <TableHead className="text-center">Harga</TableHead>
                                        <TableHead className="text-center">Unit Terjual</TableHead>
                                        <TableHead className="text-center">Total Pendapatan</TableHead>
                                        <TableHead className="text-center">Jumlah Transaksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAndSortedProducts.map((item) => (
                                        <TableRow key={item.product.productsId}>
                                            <TableCell>
                                                {item.product.thumbnail ? (
                                                    <Image
                                                        src={item.product.thumbnail}
                                                        alt={item.product.title}
                                                        width={64}
                                                        height={64}
                                                        className="w-16 h-16 object-cover rounded-md border-2 border-border"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center border-2 border-border">
                                                        <Package className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold">{item.product.title}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    ID: {item.product.productsId}
                                                </div>
                                                <Badge
                                                    variant={item.product.paymentType === "paid" ? "default" : "secondary"}
                                                    className="mt-1"
                                                >
                                                    {item.product.paymentType === "paid" ? "Berbayar" : "Gratis"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {item.product.category ? (
                                                    <Badge variant="outline">
                                                        {item.product.category.title}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="font-bold text-primary">
                                                    Rp {formatIDR(item.product.price)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="font-semibold text-lg">
                                                    {formatIDR(item.totalSold)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="font-bold text-green-600">
                                                    Rp {formatIDR(item.totalRevenue)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="font-semibold">
                                                    {formatIDR(item.transactionCount)}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
