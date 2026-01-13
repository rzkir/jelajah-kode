"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import useFormatDate from "@/hooks/FormatDate";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/lib/config";

interface Article {
  _id: string;
  articlesId: string;
  title: string;
  thumbnail: string;
  description: string;
  category: {
    title: string;
    categoryId: string;
  };
  tags?: Array<{
    title: string;
    tagsId: string;
  }>;
  status: "publish" | "draft";
  created_at?: string;
  updated_at?: string;
}

export default function useStateArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteItemTitle, setDeleteItemTitle] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [isViewModeInitialized, setIsViewModeInitialized] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const itemsPerPage = 10;

  const router = useRouter();

  const { formatDate } = useFormatDate();

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.articlesId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Handle backward compatibility: check if category is array or object
    const category = Array.isArray(article.category)
      ? article.category[0]
      : article.category;
    const matchesCategory =
      selectedCategory === "all" ||
      (category &&
        (category.categoryId === selectedCategory ||
          category.title === selectedCategory));

    // Status filter
    const matchesStatus =
      selectedStatus === "all" || article.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // Extract unique categories from articles
  const categories = useMemo(() => {
    const categoryMap = new Map<
      string,
      { title: string; categoryId: string }
    >();

    articles.forEach((article) => {
      // Handle backward compatibility: check if category is array or object
      if (article.category) {
        const categoryList = Array.isArray(article.category)
          ? article.category
          : [article.category];

        categoryList.forEach((cat) => {
          if (cat && !categoryMap.has(cat.categoryId)) {
            categoryMap.set(cat.categoryId, {
              title: cat.title,
              categoryId: cat.categoryId,
            });
          }
        });
      }
    });

    return Array.from(categoryMap.values());
  }, [articles]);

  useEffect(() => {
    fetchArticles();
  }, []);

  // Load viewMode from localStorage after component mounts (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedViewMode = localStorage.getItem("articlesViewMode");
      if (savedViewMode === "card" || savedViewMode === "table") {
        setViewMode(savedViewMode);
      }
      setIsViewModeInitialized(true);
    }
  }, []);

  // Save viewMode to localStorage whenever it changes (only after initialization)
  useEffect(() => {
    if (typeof window !== "undefined" && isViewModeInitialized) {
      localStorage.setItem("articlesViewMode", viewMode);
    }
  }, [viewMode, isViewModeInitialized]);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const apiSecret = API_CONFIG.SECRET;
      const url = API_CONFIG.ENDPOINTS.articles.base;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (apiSecret) {
        headers.Authorization = `Bearer ${apiSecret}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }

      const data = await response.json();
      setArticles(data.data || data); // Handle both paginated and non-paginated responses
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Failed to fetch articles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const article = articles.find((a) => a._id === id);
    setDeleteItemTitle(article?.title || null);
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setIsSubmitting(true);
      const apiSecret = API_CONFIG.SECRET;
      const url = apiSecret
        ? `${API_CONFIG.ENDPOINTS.articles.base}?id=${deleteId}`
        : `/api/articles?id=${deleteId}`;

      const headers: HeadersInit = {};

      if (apiSecret) {
        headers.Authorization = `Bearer ${apiSecret}`;
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to delete article");
      }

      toast.success("Article deleted successfully");
      fetchArticles(); // Refresh the list
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const totalArticles = articles.length;
  const filteredArticlesCount = filteredArticles.length;
  const publishedArticles = filteredArticles.filter(
    (a) => a.status === "publish"
  ).length;
  const draftArticles = filteredArticles.filter(
    (a) => a.status === "draft"
  ).length;
  const hasActiveFilters =
    selectedCategory !== "all" || selectedStatus !== "all" || searchTerm !== "";

  return {
    // Data
    articles,
    categories,
    currentArticles: currentArticles,
    filteredArticles,
    totalArticles,
    filteredArticlesCount,
    publishedArticles,
    draftArticles,
    hasActiveFilters,

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
    selectedCategory,
    selectedStatus,
    viewMode,
    setViewMode,

    // Filter sheet state
    isFilterSheetOpen,
    setIsFilterSheetOpen,

    // Functions
    handleDelete,
    confirmDelete,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    formatDate,
    router,
  };
}
