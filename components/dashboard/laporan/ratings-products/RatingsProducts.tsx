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
    PieChart,
    Pie,
    Cell,
} from "recharts";

import { Search, Star, MessageSquare, TrendingUp, Package } from "lucide-react";

import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { formatIDR } from "@/hooks/FormatPrice";

import useFormatDate from "@/hooks/FormatDate";

import { useStateRatingsProducts } from "./lib/useStateRatingsProducts";

import { RatingsProductsSkelaton } from "@/components/dashboard/laporan/LaporanSkelaton";

export default function RatingsProducts() {
    const { formatDate } = useFormatDate();
    const {
        ratings,
        products,
        isLoading,
        searchTerm,
        ratingFilter,
        sortBy,
        selectedProduct,
        ratingDistributionData,
        statistics,
        ratingBarData,
        setSearchTerm,
        setRatingFilter,
        setSortBy,
        setSelectedProduct,
    } = useStateRatingsProducts();

    if (isLoading) {
        return <RatingsProductsSkelaton />;
    }

    return (
        <section className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatIDR(statistics.totalRatings)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total rating yang diberikan
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Rata-rata Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {statistics.averageRating.toFixed(1)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Dari {formatIDR(statistics.totalRatings)} rating
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatIDR(products.length)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Produk yang memiliki rating
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">5 Bintang</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatIDR(statistics.ratingDistribution[5])}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Rating tertinggi
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Rating Distribution Pie Chart */}
                {ratingDistributionData.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Distribusi Rating</CardTitle>
                            <CardDescription>Persentase rating berdasarkan bintang</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={ratingDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name} ${((percent || 0) * 100).toFixed(0)}%`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {ratingDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Rating Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Jumlah Rating per Bintang</CardTitle>
                        <CardDescription>Distribusi jumlah rating berdasarkan nilai</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={ratingBarData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="rating" />
                                <YAxis tickFormatter={(value) => formatIDR(value)} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                    formatter={(value: number | undefined) => formatIDR(value ?? 0)}
                                />
                                <Legend />
                                <Bar dataKey="jumlah" fill="hsl(var(--chart-1))" name="Jumlah Rating" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Ratings</CardTitle>
                    <CardDescription>
                        {ratings.length} dari {statistics.totalRatings} rating
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari rating, produk, atau user..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select
                            value={ratingFilter !== null ? ratingFilter.toString() : "all"}
                            onValueChange={(value) =>
                                setRatingFilter(value === "all" ? null : parseInt(value))
                            }
                        >
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter Rating" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Rating</SelectItem>
                                <SelectItem value="5">5 Bintang</SelectItem>
                                <SelectItem value="4">4 Bintang</SelectItem>
                                <SelectItem value="3">3 Bintang</SelectItem>
                                <SelectItem value="2">2 Bintang</SelectItem>
                                <SelectItem value="1">1 Bintang</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={selectedProduct}
                            onValueChange={setSelectedProduct}
                        >
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Filter Produk" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Produk</SelectItem>
                                {products.map((product) => (
                                    <SelectItem key={product.productsId} value={product.productsId}>
                                        {product.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Terbaru</SelectItem>
                                <SelectItem value="oldest">Terlama</SelectItem>
                                <SelectItem value="highest">Rating Tertinggi</SelectItem>
                                <SelectItem value="lowest">Rating Terendah</SelectItem>
                                <SelectItem value="product">Nama Produk A-Z</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    {ratings.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                {searchTerm || ratingFilter !== null || selectedProduct !== "all"
                                    ? "Tidak ada rating yang sesuai dengan filter"
                                    : "Belum ada rating"}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Produk</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead className="text-center">Rating</TableHead>
                                        <TableHead>Komentar</TableHead>
                                        <TableHead className="text-center">Tanggal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ratings.map((rating) => (
                                        <TableRow key={rating._id}>
                                            <TableCell>
                                                {rating.product ? (
                                                    <div className="flex items-center gap-3">
                                                        {rating.product.thumbnail ? (
                                                            <Image
                                                                src={rating.product.thumbnail}
                                                                alt={rating.product.title}
                                                                width={48}
                                                                height={48}
                                                                className="w-12 h-12 object-cover rounded-md border"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center border">
                                                                <Package className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <div className="font-semibold text-sm">
                                                            {rating.product.title}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        Produk tidak ditemukan
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage
                                                            src={rating.author.picture}
                                                            alt={rating.author.name}
                                                        />
                                                        <AvatarFallback>
                                                            {rating.author.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div>
                                                        <div className="font-semibold text-sm">
                                                            {rating.author.name}
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                rating.author.role === "admins"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                            className="text-xs"
                                                        >
                                                            {rating.author.role === "admins"
                                                                ? "Admin"
                                                                : "User"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-bold text-lg">
                                                        {rating.rating}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-md">
                                                    <p className="text-sm line-clamp-2">
                                                        {rating.comment}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="text-sm text-muted-foreground">
                                                    {formatDate(rating.created_at)}
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
