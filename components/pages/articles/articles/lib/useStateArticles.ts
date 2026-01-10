"use client";

import * as React from "react";

import { useRouter, usePathname } from "next/navigation";

export function useStateArticles({
  articles,
  initialFilters,
}: UseStateArticlesProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isOnCategoryPage = pathname?.startsWith("/articles/categories/");
  const selectedCategory = React.useMemo(() => {
    return isOnCategoryPage
      ? initialFilters?.category || "all"
      : initialFilters?.category || "all";
  }, [isOnCategoryPage, initialFilters?.category]);

  const articlesArray = React.useMemo(
    () => (Array.isArray(articles) ? articles : []),
    [articles]
  );

  const filteredArticles = React.useMemo(() => {
    if (isOnCategoryPage) {
      return articlesArray;
    }
    if (selectedCategory === "all") {
      return articlesArray;
    }
    return articlesArray.filter((article) => {
      const category = article.category;
      if (!category) return false;
      return (
        category.categoryId === selectedCategory ||
        category.title === selectedCategory
      );
    });
  }, [articlesArray, selectedCategory, isOnCategoryPage]);

  const handleCategoryChange = React.useCallback(
    (categoryId: string) => {
      if (categoryId === "all") {
        router.push("/articles");
      } else {
        router.push(`/articles/categories/${categoryId}`);
      }
    },
    [router]
  );

  const buildPaginationUrl = React.useCallback(
    (pageNum: number) => {
      const params = new URLSearchParams();
      params.set("page", pageNum.toString());
      if (initialFilters?.category && !isOnCategoryPage) {
        params.set("category", initialFilters.category);
      }
      if (initialFilters?.sort) params.set("sort", initialFilters.sort);
      const basePath = pathname || "/articles";
      return `${basePath}${params.toString() ? `?${params.toString()}` : ""}`;
    },
    [pathname, initialFilters, isOnCategoryPage]
  );

  return {
    selectedCategory,
    filteredArticles,
    isOnCategoryPage,
    handleCategoryChange,
    buildPaginationUrl,
  };
}
