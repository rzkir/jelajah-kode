"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import useFormatDate from "@/hooks/FormatDate";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
  description: string;
  price: number;
  stock: number;
  sold?: number;
  category: Array<{
    title: string;
    categoryId: string;
  }>;
  rating?: number;
  paymentType: "free" | "paid";
  status: "publish" | "draft";
  created_at?: string;
  updated_at?: string;
}

export default function useStateProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteItemTitle, setDeleteItemTitle] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const itemsPerPage = 10;

  const router = useRouter();

  const { formatDate } = useFormatDate();

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productsId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/products", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.data || data); // Handle both paginated and non-paginated responses
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const product = products.find((p) => p._id === id);
    setDeleteItemTitle(product?.title || null);
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/products?id=${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Product deleted successfully");
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      setDeleteItemTitle(null);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return {
    // Data
    products,
    currentProducts,
    filteredProducts,

    // Loading states
    isLoading,
    isSubmitting,

    // Modal states
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,

    // Delete states
    deleteId,
    setDeleteId,
    deleteItemTitle,
    setDeleteItemTitle,

    // Pagination states
    currentPage,
    setCurrentPage,
    totalPages,

    // Search and view states
    searchTerm,
    viewMode,
    setViewMode,

    // Functions
    handleDelete,
    confirmDelete,
    handleSearchChange,
    formatDate,
    router,
  };
}
