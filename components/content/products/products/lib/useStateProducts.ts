"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

const createInitialState = (initialFilters?: {
  categories?: string;
  types?: string;
  tech?: string;
  maxPrice?: string;
  minRating?: string;
  popular?: string;
  new?: string;
  sort?: string;
}): FilterState => ({
  searchQuery: "",
  selectedCategories:
    initialFilters?.categories?.split(",").filter(Boolean) || [],
  selectedTypes: initialFilters?.types?.split(",").filter(Boolean) || [],
  selectedTechStack: initialFilters?.tech?.split(",").filter(Boolean) || [],
  priceRange: [
    0,
    initialFilters?.maxPrice ? parseInt(initialFilters.maxPrice) : 200,
  ],
  minRating: initialFilters?.minRating
    ? parseFloat(initialFilters.minRating)
    : null,
  popularOnly: initialFilters?.popular === "true",
  newArrivals: initialFilters?.new === "true",
  sortBy: initialFilters?.sort || "newest",
});

const filterReducer = (
  state: FilterState,
  action: FilterAction
): FilterState => {
  switch (action.type) {
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_CATEGORIES":
      return { ...state, selectedCategories: action.payload };
    case "SET_TYPES":
      return { ...state, selectedTypes: action.payload };
    case "SET_TECH_STACK":
      return { ...state, selectedTechStack: action.payload };
    case "SET_PRICE_RANGE":
      return { ...state, priceRange: action.payload };
    case "SET_MIN_RATING":
      return { ...state, minRating: action.payload };
    case "SET_POPULAR_ONLY":
      return { ...state, popularOnly: action.payload };
    case "SET_NEW_ARRIVALS":
      return { ...state, newArrivals: action.payload };
    case "SET_SORT_BY":
      return { ...state, sortBy: action.payload };
    case "RESET_FILTERS":
      return createInitialState();
    default:
      return state;
  }
};

export function useStateProducts(
  initialFilters?: {
    categories?: string;
    types?: string;
    tech?: string;
    maxPrice?: string;
    minRating?: string;
    popular?: string;
    new?: string;
    sort?: string;
  },
  page?: number
) {
  const router = useRouter();

  // Use reducer for all filter states
  const [filters, dispatch] = React.useReducer(
    filterReducer,
    createInitialState(initialFilters)
  );

  // Memoized setters
  const setSearchQuery = React.useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  }, []);

  const setSelectedCategories = React.useCallback(
    (categories: React.SetStateAction<string[]>) => {
      dispatch({
        type: "SET_CATEGORIES",
        payload:
          typeof categories === "function"
            ? categories(filters.selectedCategories)
            : categories,
      });
    },
    [filters.selectedCategories]
  );

  const setSelectedTypes = React.useCallback(
    (types: React.SetStateAction<string[]>) => {
      dispatch({
        type: "SET_TYPES",
        payload:
          typeof types === "function" ? types(filters.selectedTypes) : types,
      });
    },
    [filters.selectedTypes]
  );

  const setSelectedTechStack = React.useCallback(
    (tech: React.SetStateAction<string[]>) => {
      dispatch({
        type: "SET_TECH_STACK",
        payload:
          typeof tech === "function" ? tech(filters.selectedTechStack) : tech,
      });
    },
    [filters.selectedTechStack]
  );

  const setPriceRange = React.useCallback((range: [number, number]) => {
    dispatch({ type: "SET_PRICE_RANGE", payload: range });
  }, []);

  const setMinRating = React.useCallback((rating: number | null) => {
    dispatch({ type: "SET_MIN_RATING", payload: rating });
  }, []);

  const setPopularOnly = React.useCallback((value: boolean) => {
    dispatch({ type: "SET_POPULAR_ONLY", payload: value });
  }, []);

  const setNewArrivals = React.useCallback((value: boolean) => {
    dispatch({ type: "SET_NEW_ARRIVALS", payload: value });
  }, []);

  const setSortBy = React.useCallback((sort: string) => {
    dispatch({ type: "SET_SORT_BY", payload: sort });
  }, []);

  // Check if filters are at default
  const isFiltersDefault = React.useMemo(
    () =>
      filters.selectedCategories.length === 0 &&
      filters.selectedTypes.length === 0 &&
      filters.selectedTechStack.length === 0 &&
      filters.priceRange[1] === 200 &&
      !filters.minRating &&
      !filters.popularOnly &&
      !filters.newArrivals &&
      filters.sortBy === "newest",
    [filters]
  );

  // Reset all filters
  const handleReset = React.useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
    router.push("/products");
  }, [router]);

  // Apply filters to URL with debounce
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.selectedCategories.length > 0)
        params.set("categories", filters.selectedCategories.join(","));
      if (filters.selectedTypes.length > 0)
        params.set("types", filters.selectedTypes.join(","));
      if (filters.selectedTechStack.length > 0)
        params.set("tech", filters.selectedTechStack.join(","));
      if (filters.priceRange[1] < 200)
        params.set("maxPrice", filters.priceRange[1].toString());
      if (filters.minRating)
        params.set("minRating", filters.minRating.toString());
      if (filters.popularOnly) params.set("popular", "true");
      if (filters.newArrivals) params.set("new", "true");
      if (filters.sortBy !== "newest") params.set("sort", filters.sortBy);
      if (page && page > 1) params.set("page", page.toString());

      const newUrl = `/products${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      if (window.location.pathname + window.location.search !== newUrl) {
        router.push(newUrl);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [filters, page, router]);

  return {
    filters,
    setSearchQuery,
    setSelectedCategories,
    setSelectedTypes,
    setSelectedTechStack,
    setPriceRange,
    setMinRating,
    setPopularOnly,
    setNewArrivals,
    setSortBy,
    isFiltersDefault,
    handleReset,
  };
}
