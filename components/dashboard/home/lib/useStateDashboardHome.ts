"use client";

import { useState, useEffect, useMemo } from "react";

import { API_CONFIG } from "@/lib/config";

interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  totalTransactions: number;
  successTransactions: number;
  pendingTransactions: number;
  canceledTransactions: number;
  totalRevenue: number;
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  totalArticles: number;
  publishedArticles: number;
}

interface Transaction {
  _id: string;
  order_id?: string;
  status: string;
  total_amount?: number;
  user?: {
    name: string;
    email: string;
  };
  created_at?: string;
}

interface Product {
  _id: string;
  productsId: string;
  title: string;
  price: number;
  sold?: number;
  stock?: number;
}

export function useStateDashboardHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    publishedProducts: 0,
    draftProducts: 0,
    totalTransactions: 0,
    successTransactions: 0,
    pendingTransactions: 0,
    canceledTransactions: 0,
    totalRevenue: 0,
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    totalArticles: 0,
    publishedArticles: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const apiSecret = API_CONFIG.SECRET;
        
        // Prepare headers for users and articles (require Authorization)
        const authHeaders: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (apiSecret) {
          authHeaders.Authorization = `Bearer ${apiSecret}`;
        }

        // Fetch all data in parallel
        const [productsRes, transactionsRes, usersRes, articlesRes] = await Promise.all([
          fetch(`${API_CONFIG.ENDPOINTS.products.base}?limit=1000`, {
            credentials: "include",
            headers: authHeaders,
          }),
          fetch(`${API_CONFIG.ENDPOINTS.transactions}?page=1&limit=1000`, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }),
          fetch(`${API_CONFIG.ENDPOINTS.users.base}?limit=1000`, {
            credentials: "include",
            headers: authHeaders,
          }),
          fetch(`${API_CONFIG.ENDPOINTS.articles.base}?limit=1000`, {
            credentials: "include",
            headers: authHeaders,
          }),
        ]);

        // Process Products
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const products = productsData.data || productsData.products || [];
          const publishedProducts = products.filter(
            (p: { status: string }) => p.status === "publish"
          ).length;
          const draftProducts = products.filter(
            (p: { status: string }) => p.status === "draft"
          ).length;

          // Get top products by sold count
          const sortedProducts = [...products]
            .sort((a: Product, b: Product) => (b.sold || 0) - (a.sold || 0))
            .slice(0, 5);
          setTopProducts(sortedProducts);

          setStats((prev) => ({
            ...prev,
            totalProducts: products.length,
            publishedProducts,
            draftProducts,
          }));
        } else {
          console.warn("Failed to fetch products:", productsRes.status, productsRes.statusText);
        }

        // Process Transactions
        if (transactionsRes.ok) {
          const transactionsData = await transactionsRes.json();
          // Transactions API returns array directly, not wrapped in data property
          const transactions = Array.isArray(transactionsData) 
            ? transactionsData 
            : transactionsData.data || transactionsData.transactions || [];
          
          const successTransactions = transactions.filter(
            (t: { status: string }) => t.status === "success"
          );
          const pendingTransactions = transactions.filter(
            (t: { status: string }) => t.status === "pending"
          );
          const canceledTransactions = transactions.filter(
            (t: { status: string }) => t.status === "canceled"
          );

          const totalRevenue = successTransactions.reduce(
            (sum: number, t: { total_amount?: number }) => sum + (t.total_amount || 0),
            0
          );

          // Get recent transactions (sorted by date)
          const sortedTransactions = [...transactions]
            .sort(
              (a: Transaction, b: Transaction) =>
                new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime()
            )
            .slice(0, 5);
          setRecentTransactions(sortedTransactions);
          setAllTransactions(transactions);

          setStats((prev) => ({
            ...prev,
            totalTransactions: transactions.length,
            successTransactions: successTransactions.length,
            pendingTransactions: pendingTransactions.length,
            canceledTransactions: canceledTransactions.length,
            totalRevenue,
          }));
        } else {
          console.warn("Failed to fetch transactions:", transactionsRes.status, transactionsRes.statusText);
          const errorText = await transactionsRes.text().catch(() => "");
          console.warn("Error response:", errorText);
        }

        // Process Users
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          const users = usersData.data || usersData.users || [];
          const activeUsers = users.filter(
            (u: { status?: string }) => u.status === "active"
          ).length;
          const verifiedUsers = users.filter(
            (u: { isVerified?: string | boolean }) =>
              u.isVerified === "true" || u.isVerified === true
          ).length;

          setStats((prev) => ({
            ...prev,
            totalUsers: users.length,
            activeUsers,
            verifiedUsers,
          }));
        } else {
          console.warn("Failed to fetch users:", usersRes.status, usersRes.statusText);
        }

        // Process Articles
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json();
          const articles = articlesData.data || articlesData.articles || [];
          const publishedArticles = articles.filter(
            (a: { status: string }) => a.status === "publish"
          ).length;

          setStats((prev) => ({
            ...prev,
            totalArticles: articles.length,
            publishedArticles,
          }));
        } else {
          console.warn("Failed to fetch articles:", articlesRes.status, articlesRes.statusText);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data - Monthly Revenue
  const monthlyRevenueData = useMemo(() => {
    const now = new Date();
    const months: { [key: string]: number } = {};
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      months[monthKey] = 0;
    }

    // Calculate revenue per month from success transactions
    allTransactions
      .filter((t) => t.status === "success" && t.total_amount)
      .forEach((t) => {
        if (t.created_at) {
          const date = new Date(t.created_at);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          if (months[monthKey] !== undefined) {
            months[monthKey] += t.total_amount || 0;
          }
        }
      });

    return Object.entries(months).map(([key, value]) => {
      const [year, month] = key.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return {
        month: date.toLocaleDateString("id-ID", { month: "short" }),
        revenue: value,
      };
    });
  }, [allTransactions]);

  // Chart data - Transaction Status (Pie Chart)
  const transactionStatusData = useMemo(() => {
    const statusCounts: { [key: string]: number } = {
      success: 0,
      pending: 0,
      canceled: 0,
      expired: 0,
    };

    allTransactions.forEach((t) => {
      if (statusCounts[t.status] !== undefined) {
        statusCounts[t.status]++;
      }
    });

    const colors = {
      success: "#22c55e",
      pending: "#eab308",
      canceled: "#ef4444",
      expired: "#6b7280",
    };

    return Object.entries(statusCounts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
        color: colors[status as keyof typeof colors] || "#8884d8",
      }));
  }, [allTransactions]);

  // Chart data - Top Products Sales (Bar Chart)
  const topProductsChartData = useMemo(() => {
    return topProducts.map((product) => ({
      name: product.title.length > 20 
        ? product.title.substring(0, 20) + "..." 
        : product.title,
      sold: product.sold || 0,
      revenue: (product.sold || 0) * product.price,
    }));
  }, [topProducts]);

  return {
    stats,
    isLoading,
    recentTransactions,
    topProducts,
    monthlyRevenueData,
    transactionStatusData,
    topProductsChartData,
  };
}