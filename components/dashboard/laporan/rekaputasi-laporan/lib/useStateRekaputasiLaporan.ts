import { useState, useEffect, useMemo } from "react";

import { API_CONFIG } from "@/lib/config";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export function useStateRekaputasiLaporan() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_CONFIG.ENDPOINTS.products.base, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(API_CONFIG.SECRET && {
              Authorization: `Bearer ${API_CONFIG.SECRET}`,
            }),
          },
        });

        if (response.ok) {
          const data = await response.json();
          const productsList = Array.isArray(data) ? data : data?.data || [];
          setProducts(productsList);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const url = new URL(
          API_CONFIG.ENDPOINTS.transactions,
          window.location.origin
        );
        url.searchParams.append("page", "1");
        url.searchParams.append("limit", "1000");

        const response = await fetch(url.toString(), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const transactionsList = Array.isArray(data) ? data : [];
          setTransactions(transactionsList);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const processedData = useMemo(() => {
    if (isLoading || transactions.length === 0) {
      return {
        monthlyData: [],
        categoryData: [],
        statusData: [],
        cumulativeData: [],
        summaryStats: {
          totalPendapatan: 0,
          totalTransaksi: 0,
          totalPengguna: 0,
          rataRataTransaksi: 0,
          pertumbuhanPendapatan: 0,
          pertumbuhanTransaksi: 0,
        },
      };
    }

    const now = new Date();
    const last6Months: { month: string; monthIndex: number; year: number }[] =
      [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        month: monthNames[date.getMonth()],
        monthIndex: date.getMonth(),
        year: date.getFullYear(),
      });
    }

    const monthlyDataMap = new Map<
      string,
      { pendapatan: number; transaksi: number; pengguna: Set<string> }
    >();

    last6Months.forEach(({ monthIndex, year }) => {
      monthlyDataMap.set(`${year}-${monthIndex}`, {
        pendapatan: 0,
        transaksi: 0,
        pengguna: new Set(),
      });
    });

    transactions.forEach((txn) => {
      const txnDate = new Date(txn.created_at);
      const monthKey = `${txnDate.getFullYear()}-${txnDate.getMonth()}`;
      const monthData = monthlyDataMap.get(monthKey);

      if (monthData && txn.status === "success" && txn.total_amount) {
        monthData.pendapatan += txn.total_amount;
        monthData.transaksi += 1;
        monthData.pengguna.add(txn.user._id);
      }
    });

    const monthlyData = last6Months.map(({ month, monthIndex, year }) => {
      const monthKey = `${year}-${monthIndex}`;
      const data = monthlyDataMap.get(monthKey) || {
        pendapatan: 0,
        transaksi: 0,
        pengguna: new Set(),
      };
      return {
        month,
        pendapatan: data.pendapatan,
        transaksi: data.transaksi,
        pengguna: data.pengguna.size,
      };
    });

    let cumulativeTotal = 0;
    const cumulativeData = monthlyData.map((data) => {
      cumulativeTotal += data.pendapatan;
      return {
        month: data.month,
        total: cumulativeTotal,
      };
    });

    const categoryMap = new Map<string, number>();
    transactions.forEach((txn) => {
      if (txn.status === "success" && txn.total_amount) {
        txn.products.forEach((product) => {
          const productData = products.find(
            (p) => p.productsId === product.productsId
          );
          const categoryName = productData?.category?.title || "Lainnya";
          categoryMap.set(
            categoryName,
            (categoryMap.get(categoryName) || 0) + product.amount
          );
        });
      }
    });

    const categoryData = Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        color: [
          "#8884d8",
          "#82ca9d",
          "#ffc658",
          "#ff7c7c",
          "#8dd1e1",
          "#d084d0",
        ][categoryMap.size % 6],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const statusCounts = {
      success: 0,
      pending: 0,
      expired: 0,
      canceled: 0,
    };

    transactions.forEach((txn) => {
      if (txn.status === "success") statusCounts.success++;
      else if (txn.status === "pending") statusCounts.pending++;
      else if (txn.status === "expired") statusCounts.expired++;
      else if (txn.status === "canceled") statusCounts.canceled++;
    });

    const statusData = [
      { status: "Berhasil", jumlah: statusCounts.success, color: "#82ca9d" },
      { status: "Pending", jumlah: statusCounts.pending, color: "#ffc658" },
      { status: "Kadaluarsa", jumlah: statusCounts.expired, color: "#ffa500" },
      { status: "Dibatalkan", jumlah: statusCounts.canceled, color: "#ff7c7c" },
    ].filter((item) => item.jumlah > 0);

    const successTransactions = transactions.filter(
      (txn) => txn.status === "success" && txn.total_amount
    );
    const totalPendapatan = successTransactions.reduce(
      (sum, txn) => sum + (txn.total_amount || 0),
      0
    );
    const totalTransaksi = transactions.length;
    const uniqueUsers = new Set(transactions.map((txn) => txn.user._id)).size;
    const rataRataTransaksi =
      successTransactions.length > 0
        ? totalPendapatan / successTransactions.length
        : 0;

    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];
    const pertumbuhanPendapatan =
      previousMonth && previousMonth.pendapatan > 0
        ? ((currentMonth.pendapatan - previousMonth.pendapatan) /
            previousMonth.pendapatan) *
          100
        : 0;
    const pertumbuhanTransaksi =
      previousMonth && previousMonth.transaksi > 0
        ? ((currentMonth.transaksi - previousMonth.transaksi) /
            previousMonth.transaksi) *
          100
        : 0;

    return {
      monthlyData,
      categoryData,
      statusData,
      cumulativeData,
      summaryStats: {
        totalPendapatan,
        totalTransaksi,
        totalPengguna: uniqueUsers,
        rataRataTransaksi,
        pertumbuhanPendapatan,
        pertumbuhanTransaksi,
      },
    };
  }, [products, transactions, isLoading]);

  return {
    isLoading,
    isMobile,
    processedData,
  };
}
