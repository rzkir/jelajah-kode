"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, FileText } from "lucide-react";

import { formatIDR } from "@/hooks/FormatPrice";

import { RekaputasiLaporanSkelaton } from "@/components/dashboard/laporan/LaporanSkelaton";

import { useStateRekaputasiLaporan } from "@/components/dashboard/laporan/rekaputasi-laporan/lib/useStateRekaputasiLaporan";

export default function RekaputasiLaporan() {
    const { isLoading, isMobile, processedData } = useStateRekaputasiLaporan();

    if (isLoading) {
        return (
            <RekaputasiLaporanSkelaton />
        );
    }

    const { monthlyData, categoryData, statusData, cumulativeData, summaryStats } = processedData;

    return (
        <section className="space-y-4 sm:space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total Pendapatan</CardTitle>
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold wrap-break-word">
                            Rp {formatIDR(summaryStats.totalPendapatan)}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 flex-wrap">
                            {summaryStats.pertumbuhanPendapatan >= 0 ? (
                                <>
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-green-500">+{summaryStats.pertumbuhanPendapatan.toFixed(1)}%</span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                    <span className="text-red-500">{summaryStats.pertumbuhanPendapatan.toFixed(1)}%</span>
                                </>
                            )}
                            {" "}dari bulan lalu
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total Transaksi</CardTitle>
                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{formatIDR(summaryStats.totalTransaksi)}</div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 flex-wrap">
                            {summaryStats.pertumbuhanTransaksi >= 0 ? (
                                <>
                                    <TrendingUp className="h-3 w-3 text-green-500" />
                                    <span className="text-green-500">+{summaryStats.pertumbuhanTransaksi.toFixed(1)}%</span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                    <span className="text-red-500">{summaryStats.pertumbuhanTransaksi.toFixed(1)}%</span>
                                </>
                            )}
                            {" "}dari bulan lalu
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total Pengguna</CardTitle>
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold">{formatIDR(summaryStats.totalPengguna)}</div>
                        <p className="text-xs text-muted-foreground">
                            Total pengguna unik
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Rata-rata Transaksi</CardTitle>
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg sm:text-2xl font-bold wrap-break-word">
                            Rp {formatIDR(Math.round(summaryStats.rataRataTransaksi))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Rata-rata per transaksi berhasil
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {/* Line Chart - Trend Pendapatan & Transaksi */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm sm:text-base">Trend Pendapatan & Transaksi</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Perkembangan pendapatan dan transaksi per bulan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-[250px] sm:h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        tickFormatter={(value) => formatIDR(value)}
                                        tick={{ fontSize: 10 }}
                                        width={60}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        tickFormatter={(value) => formatIDR(value)}
                                        tick={{ fontSize: 10 }}
                                        width={60}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                        }}
                                        formatter={(value: number | undefined, name: string | undefined) => {
                                            const val = value ?? 0;
                                            const label = name ?? "";
                                            if (label === "Pendapatan (Rp)") {
                                                return [`Rp ${formatIDR(val)}`, label];
                                            }
                                            return [formatIDR(val), label];
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="pendapatan"
                                        stroke="hsl(var(--chart-1))"
                                        strokeWidth={2}
                                        name="Pendapatan (Rp)"
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="transaksi"
                                        stroke="hsl(var(--chart-2))"
                                        strokeWidth={2}
                                        name="Transaksi"
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Bar Chart - Perbandingan Bulanan */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm sm:text-base">Perbandingan Bulanan</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Perbandingan pendapatan, transaksi, dan pengguna</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-[250px] sm:h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => formatIDR(value)}
                                        tick={{ fontSize: 10 }}
                                        width={60}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                        }}
                                        formatter={(value: number | undefined, name: string | undefined) => {
                                            const val = value ?? 0;
                                            const label = name ?? "";
                                            if (label === "Pendapatan") {
                                                return [`Rp ${formatIDR(val)}`, label];
                                            }
                                            return [formatIDR(val), label];
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                                    <Bar dataKey="pendapatan" fill="hsl(var(--chart-1))" name="Pendapatan" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="transaksi" fill="hsl(var(--chart-2))" name="Transaksi" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="pengguna" fill="hsl(var(--chart-3))" name="Pengguna" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Pie Chart - Distribusi Kategori */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm sm:text-base">Distribusi Kategori</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Persentase pendapatan berdasarkan kategori</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-[250px] sm:h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => {
                                            const percentage = ((percent || 0) * 100).toFixed(0);
                                            return isMobile
                                                ? `${percentage}%`
                                                : `${name} ${percentage}%`;
                                        }}
                                        outerRadius={isMobile ? 60 : 80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                        }}
                                        formatter={(value: number | undefined) =>
                                            `Rp ${formatIDR(value ?? 0)}`
                                        }
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Area Chart - Pendapatan Kumulatif */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm sm:text-base">Pendapatan Kumulatif</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Total pendapatan yang terkumpul sepanjang periode</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-[250px] sm:h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={cumulativeData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => formatIDR(value)}
                                        tick={{ fontSize: 10 }}
                                        width={60}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "hsl(var(--card))",
                                            border: "1px solid hsl(var(--border))",
                                            borderRadius: "8px",
                                            fontSize: "12px",
                                        }}
                                        formatter={(value: number | undefined) =>
                                            `Rp ${formatIDR(value ?? 0)}`
                                        }
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="hsl(var(--chart-1))"
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                        name="Total Pendapatan"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Status Transaksi Chart */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base">Status Transaksi</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Distribusi transaksi berdasarkan status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-[250px] sm:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    type="number"
                                    tickFormatter={(value) => formatIDR(value)}
                                    tick={{ fontSize: 10 }}
                                />
                                <YAxis
                                    dataKey="status"
                                    type="category"
                                    width={isMobile ? 60 : 80}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                    formatter={(value: number | undefined) => formatIDR(value ?? 0)}
                                />
                                <Bar dataKey="jumlah" radius={[0, 8, 8, 0]}>
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
