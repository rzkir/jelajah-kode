import { Skeleton } from "@/components/ui/skeleton";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PenjualanProductsSkelaton() {
    return (
        <section className="space-y-6">
            {/* Summary Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-4 rounded" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-24 mb-2" />
                            <Skeleton className="h-3 w-40" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart Card Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[400px] w-full" />
                </CardContent>
            </Card>

            {/* Filters and Table Card Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    {/* Filters Skeleton */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full md:w-[200px]" />
                        <Skeleton className="h-10 w-full md:w-[200px]" />
                    </div>

                    {/* Table Skeleton */}
                    <div className="rounded-md border">
                        <div className="border-b">
                            <div className="grid grid-cols-7 gap-4 p-4">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                        </div>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="border-b grid grid-cols-7 gap-4 p-4">
                                <Skeleton className="h-16 w-16 rounded-md" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-5 w-16" />
                                </div>
                                <div className="flex justify-center">
                                    <Skeleton className="h-6 w-20" />
                                </div>
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="flex justify-center">
                                    <Skeleton className="h-5 w-16" />
                                </div>
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-28" />
                                </div>
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}

export function RekaputasiLaporanSkelaton() {
    return (
        <section className="space-y-4 sm:space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-3 w-24 sm:h-4 sm:w-32" />
                            <Skeleton className="h-3 w-3 sm:h-4 sm:w-4 rounded" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-6 w-32 sm:h-8 sm:w-40 mb-2" />
                            <Skeleton className="h-3 w-36 sm:w-48" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Line Chart - Trend Pendapatan & Transaksi */}
                <Card>
                    <CardHeader className="pb-3">
                        <Skeleton className="h-4 w-48 sm:h-5 sm:w-56 mb-2" />
                        <Skeleton className="h-3 w-64 sm:h-4 sm:w-72" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full h-[250px] sm:h-[300px]" />
                    </CardContent>
                </Card>

                {/* Bar Chart - Perbandingan Bulanan */}
                <Card>
                    <CardHeader className="pb-3">
                        <Skeleton className="h-4 w-40 sm:h-5 sm:w-48 mb-2" />
                        <Skeleton className="h-3 w-56 sm:h-4 sm:w-64" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full h-[250px] sm:h-[300px]" />
                    </CardContent>
                </Card>

                {/* Pie Chart - Distribusi Kategori */}
                <Card>
                    <CardHeader className="pb-3">
                        <Skeleton className="h-4 w-36 sm:h-5 sm:w-44 mb-2" />
                        <Skeleton className="h-3 w-52 sm:h-4 sm:w-60" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full h-[250px] sm:h-[300px]" />
                    </CardContent>
                </Card>

                {/* Area Chart - Pendapatan Kumulatif */}
                <Card>
                    <CardHeader className="pb-3">
                        <Skeleton className="h-4 w-40 sm:h-5 sm:w-48 mb-2" />
                        <Skeleton className="h-3 w-56 sm:h-4 sm:w-64" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full h-[250px] sm:h-[300px]" />
                    </CardContent>
                </Card>
            </div>

            {/* Status Transaksi Chart */}
            <Card>
                <CardHeader className="pb-3">
                    <Skeleton className="h-4 w-32 sm:h-5 sm:w-40 mb-2" />
                    <Skeleton className="h-3 w-48 sm:h-4 sm:w-56" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="w-full h-[250px] sm:h-[300px]" />
                </CardContent>
            </Card>
        </section>
    )
}

export function RatingsProductsSkelaton() {
    return (
        <section className="space-y-6">
            {/* Summary Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-4 rounded" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-24 mb-2" />
                            <Skeleton className="h-3 w-40" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Pie Chart Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>

                {/* Bar Chart Skeleton */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Table Card Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    {/* Filters Skeleton */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full md:w-[180px]" />
                        <Skeleton className="h-10 w-full md:w-[200px]" />
                        <Skeleton className="h-10 w-full md:w-[180px]" />
                    </div>

                    {/* Table Skeleton */}
                    <div className="rounded-md border">
                        <div className="border-b">
                            <div className="grid grid-cols-5 gap-4 p-4">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="border-b grid grid-cols-5 gap-4 p-4">
                                {/* Produk */}
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-12 w-12 rounded-md" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                {/* User */}
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                </div>
                                {/* Rating */}
                                <div className="flex justify-center items-center gap-1">
                                    <Skeleton className="h-5 w-5 rounded" />
                                    <Skeleton className="h-6 w-8" />
                                </div>
                                {/* Komentar */}
                                <div className="max-w-md">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4 mt-1" />
                                </div>
                                {/* Tanggal */}
                                <div className="flex justify-center">
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}