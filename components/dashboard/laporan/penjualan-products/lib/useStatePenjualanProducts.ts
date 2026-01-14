import { useState, useEffect, useMemo } from "react";

import { API_CONFIG } from "@/lib/config";

interface Product {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
  price: number;
  sold?: number;
  category?: {
    title: string;
    categoryId: string;
  };
  paymentType: "free" | "paid";
}

interface SoldProduct {
  product: Product;
  totalSold: number;
  totalRevenue: number;
  transactionCount: number;
}

export function useStatePenjualanProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"sold" | "revenue" | "name">("sold");

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

  const soldProducts = useMemo(() => {
    if (isLoading || transactions.length === 0 || products.length === 0) {
      return [];
    }

    const successTransactions = transactions.filter(
      (txn) => txn.status === "success"
    );

    const soldMap = new Map<string, SoldProduct>();

    successTransactions.forEach((txn) => {
      txn.products.forEach((txnProduct) => {
        const product = products.find(
          (p) => p.productsId === txnProduct.productsId
        );
        if (product) {
          const existing = soldMap.get(product.productsId);
          if (existing) {
            existing.totalSold += txnProduct.quantity;
            existing.totalRevenue += txnProduct.amount;
            existing.transactionCount += 1;
          } else {
            soldMap.set(product.productsId, {
              product,
              totalSold: txnProduct.quantity,
              totalRevenue: txnProduct.amount,
              transactionCount: 1,
            });
          }
        }
      });
    });

    return Array.from(soldMap.values());
  }, [products, transactions, isLoading]);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = soldProducts.filter((item) => {
      const matchesSearch =
        item.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.productsId
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        item.product.category?.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "sold":
          return b.totalSold - a.totalSold;
        case "revenue":
          return b.totalRevenue - a.totalRevenue;
        case "name":
          return a.product.title.localeCompare(b.product.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [soldProducts, searchTerm, selectedCategory, sortBy]);

  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    soldProducts.forEach((item) => {
      if (item.product.category) {
        categorySet.add(item.product.category.categoryId);
      }
    });
    return Array.from(categorySet).map((catId) => {
      const product = soldProducts.find(
        (item) => item.product.category?.categoryId === catId
      );
      return {
        categoryId: catId,
        title: product?.product.category?.title || "",
      };
    });
  }, [soldProducts]);

  const summaryStats = useMemo(() => {
    const totalProducts = soldProducts.length;
    const totalSold = soldProducts.reduce(
      (sum, item) => sum + item.totalSold,
      0
    );
    const totalRevenue = soldProducts.reduce(
      (sum, item) => sum + item.totalRevenue,
      0
    );
    const totalTransactions = soldProducts.reduce(
      (sum, item) => sum + item.transactionCount,
      0
    );

    return {
      totalProducts,
      totalSold,
      totalRevenue,
      totalTransactions,
    };
  }, [soldProducts]);

  const chartData = useMemo(() => {
    return filteredAndSortedProducts.slice(0, 10).map((item) => ({
      name:
        item.product.title.length > 20
          ? item.product.title.substring(0, 20) + "..."
          : item.product.title,
      terjual: item.totalSold,
      pendapatan: item.totalRevenue,
    }));
  }, [filteredAndSortedProducts]);

  return {
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
  };
}
