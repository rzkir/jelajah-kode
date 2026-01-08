"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import {
  fetchProductsBySearch,
  fetchProductCategories,
  fetchProductType,
} from "@/utils/fetching/FetchProducts";

export function useStateFilter() {
  const router = useRouter();

  const [categoryOpen, setCategoryOpen] = React.useState(false);
  const [typeOpen, setTypeOpen] = React.useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = React.useState(false);

  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [selectedType, setSelectedType] = React.useState<string>("");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const [suggestions, setSuggestions] = React.useState<ProductsSearchItem[]>(
    []
  );
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const [categories, setCategories] = React.useState<
    Array<{ value: string; label: string }>
  >([]);
  const [types, setTypes] = React.useState<
    Array<{ value: string; label: string }>
  >([]);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const suggestionsRef = React.useRef<HTMLDivElement>(null);

  const showSuggestions =
    suggestions.length > 0 && searchQuery.trim().length > 0;

  const clearSuggestions = React.useCallback(() => {
    setSuggestions([]);
    setSelectedIndex(-1);
  }, []);

  const navigateToSearch = React.useCallback(
    (query: string, category?: string, type?: string) => {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set("q", query.trim());
      }
      if (category) {
        params.set("categories", category);
      }
      if (type) {
        params.set("types", type);
      }
      router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
    },
    [router]
  );

  const transformToFilterOptions = React.useCallback(
    (
      items: Array<{
        _id?: string;
        categoryId?: string;
        typeId?: string;
        title: string;
      }>,
      idKey: "categoryId" | "typeId"
    ) => {
      return items.map((item) => ({
        value: item[idKey] || item._id || "",
        label: item.title,
      }));
    },
    []
  );

  React.useEffect(() => {
    const fetchCategoriesAndTypes = async () => {
      try {
        const [categoriesData, typesData] = await Promise.all([
          fetchProductCategories(),
          fetchProductType(),
        ]);

        setCategories(transformToFilterOptions(categoriesData, "categoryId"));
        setTypes(transformToFilterOptions(typesData, "typeId"));
      } catch (error) {
        console.error("Error fetching categories and types:", error);
      }
    };

    fetchCategoriesAndTypes();
  }, [transformToFilterOptions]);

  React.useEffect(() => {
    if (!searchQuery.trim()) {
      clearSuggestions();
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const results = await fetchProductsBySearch({
          q: searchQuery.trim(),
          page: "1",
        });
        setSuggestions(results.data);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        clearSuggestions();
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, clearSuggestions]);

  const handleSelectSuggestion = React.useCallback(
    (title: string) => {
      setSearchQuery(title);
      clearSuggestions();
      navigateToSearch(title, selectedCategory, selectedType);
    },
    [navigateToSearch, selectedCategory, selectedType, clearSuggestions]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSelectSuggestion(suggestions[selectedIndex].title);
          } else {
            navigateToSearch(searchQuery, selectedCategory, selectedType);
          }
          break;
        case "Escape":
          clearSuggestions();
          break;
      }
    },
    [
      showSuggestions,
      suggestions,
      selectedIndex,
      searchQuery,
      selectedCategory,
      selectedType,
      navigateToSearch,
      clearSuggestions,
      handleSelectSuggestion,
    ]
  );

  const handleSearch = React.useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      clearSuggestions();
      navigateToSearch(searchQuery, selectedCategory, selectedType);
    },
    [
      searchQuery,
      selectedCategory,
      selectedType,
      navigateToSearch,
      clearSuggestions,
    ]
  );

  const handleApplyFilters = React.useCallback(() => {
    setFilterSheetOpen(false);
    clearSuggestions();
    navigateToSearch(searchQuery, selectedCategory, selectedType);
  }, [
    searchQuery,
    selectedCategory,
    selectedType,
    navigateToSearch,
    clearSuggestions,
  ]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        clearSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [clearSuggestions]);

  return {
    categoryOpen,
    setCategoryOpen,
    typeOpen,
    setTypeOpen,
    filterSheetOpen,
    setFilterSheetOpen,

    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    searchQuery,
    setSearchQuery,

    suggestions,
    isLoadingSuggestions,
    selectedIndex,
    showSuggestions,

    categories,
    types,

    inputRef,
    suggestionsRef,

    handleKeyDown,
    handleSelectSuggestion,
    handleSearch,
    handleApplyFilters,
  };
}
