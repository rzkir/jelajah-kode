"use client";

import * as React from "react";

import { useRouter, usePathname } from "next/navigation";

const createInitialState = (initialFilters?: InitialFilters): FilterState => ({
  searchQuery: initialFilters?.q || "",
  selectedCategories: initialFilters?.categories
    ? [initialFilters.categories]
    : [],
  selectedTypes: initialFilters?.types ? [initialFilters.types] : [],
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

// Helper function to build URL params from filters
const buildFilterParams = (
  filters: FilterState,
  page?: number,
  excludeCategories = false,
  excludeTypes = false
): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.searchQuery) params.set("q", filters.searchQuery);
  if (!excludeCategories && filters.selectedCategories.length > 0) {
    params.set("categories", filters.selectedCategories[0]);
  }
  if (!excludeTypes && filters.selectedTypes.length > 0) {
    params.set("types", filters.selectedTypes[0]);
  }
  if (filters.selectedTechStack.length > 0) {
    params.set("tech", filters.selectedTechStack.join(","));
  }
  if (filters.priceRange[1] < 200) {
    params.set("maxPrice", filters.priceRange[1].toString());
  }
  if (filters.minRating) {
    params.set("minRating", filters.minRating.toString());
  }
  if (filters.popularOnly) params.set("popular", "true");
  if (filters.newArrivals) params.set("new", "true");
  if (filters.sortBy !== "newest") params.set("sort", filters.sortBy);
  if (page && page > 1) params.set("page", page.toString());

  return params;
};

// Helper function to build redirect URL
const buildRedirectUrl = (
  basePath: string,
  params: URLSearchParams
): string => {
  return `${basePath}${params.toString() ? `?${params.toString()}` : ""}`;
};

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
  initialFilters?: InitialFilters,
  page?: number
) {
  const router = useRouter();
  const pathname = usePathname();

  const [filters, dispatch] = React.useReducer(
    filterReducer,
    createInitialState(initialFilters)
  );

  // Auto-open collapsed sections if category/type is selected from pathname or initialFilters
  const hasCategoryFromPath = pathname?.startsWith("/products/categories/");
  const hasTypeFromPath = pathname?.startsWith("/products/types/");
  const hasCategoryFromFilter = Boolean(initialFilters?.categories);
  const hasTypeFromFilter = Boolean(initialFilters?.types);

  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(
    hasCategoryFromPath || hasCategoryFromFilter
  );
  const [isTypeOpen, setIsTypeOpen] = React.useState(
    hasTypeFromPath || hasTypeFromFilter
  );
  const [isRatingsOpen, setIsRatingsOpen] = React.useState(false);
  const [isTechStackOpen, setIsTechStackOpen] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(true);

  const setSearchQuery = React.useCallback((query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  }, []);

  const setSelectedCategories = React.useCallback(
    (categories: React.SetStateAction<string[]>) => {
      const newCategories =
        typeof categories === "function"
          ? categories(filters.selectedCategories)
          : categories;
      const singleCategory =
        Array.isArray(newCategories) && newCategories.length > 0
          ? [newCategories[0]]
          : [];
      dispatch({
        type: "SET_CATEGORIES",
        payload: singleCategory,
      });
    },
    [filters.selectedCategories]
  );

  const setSelectedTypes = React.useCallback(
    (types: React.SetStateAction<string[]>) => {
      const newTypes =
        typeof types === "function" ? types(filters.selectedTypes) : types;
      const singleType =
        Array.isArray(newTypes) && newTypes.length > 0 ? [newTypes[0]] : [];
      dispatch({
        type: "SET_TYPES",
        payload: singleType,
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

  const isFiltersDefault = React.useMemo(
    () =>
      !filters.searchQuery &&
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

  const handleReset = React.useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
    // Reset to /products only if we're on a filter page (tags, categories, types)
    const currentPath = pathname || "/products";
    if (
      currentPath.startsWith("/products/tags") ||
      currentPath.startsWith("/products/categories") ||
      currentPath.startsWith("/products/types")
    ) {
      router.push("/products");
    } else {
      router.push(currentPath);
    }
  }, [router, pathname]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const isOnCategoryPage = pathname?.startsWith("/products/categories/");
      const isOnTypePage = pathname?.startsWith("/products/types/");
      const isOnTagsPage = pathname?.startsWith("/products/tags/");

      // If on tags page, redirect to /products with all filters
      if (isOnTagsPage) {
        const newParams = buildFilterParams(filters, page);
        const newUrl = buildRedirectUrl("/products", newParams);
        const currentUrl = window.location.pathname + window.location.search;
        if (currentUrl !== newUrl) {
          router.push(newUrl);
          return;
        }
      }

      // If on category page, handle category changes
      if (isOnCategoryPage) {
        const currentCategoryId = pathname
          ?.split("/products/categories/")[1]
          ?.split("?")[0];
        const newCategoryId = filters.selectedCategories[0];

        // If category changed or cleared, redirect to /products
        if (newCategoryId !== currentCategoryId) {
          const newParams = buildFilterParams(filters, page);
          const newUrl = buildRedirectUrl("/products", newParams);
          router.push(newUrl);
          return;
        }
      }

      // If on type page, handle type changes
      if (isOnTypePage) {
        const currentTypeId = pathname
          ?.split("/products/types/")[1]
          ?.split("?")[0];
        const newTypeId = filters.selectedTypes[0];

        // If type changed or cleared, redirect to /products
        if (newTypeId !== currentTypeId) {
          const newParams = buildFilterParams(filters, page);
          const newUrl = buildRedirectUrl("/products", newParams);
          router.push(newUrl);
          return;
        }
      }

      // Normal flow: build params for current page
      const params = buildFilterParams(
        filters,
        page,
        isOnCategoryPage,
        isOnTypePage
      );
      const basePath = pathname || "/products";
      const newUrl = buildRedirectUrl(basePath, params);
      const currentUrl = window.location.pathname + window.location.search;

      if (currentUrl !== newUrl) {
        router.push(newUrl);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, page, router, pathname]);

  // Auto-open collapsed sections when pathname changes
  React.useEffect(() => {
    if (pathname?.startsWith("/products/categories/")) {
      setIsCategoriesOpen(true);
    }
    if (pathname?.startsWith("/products/types/")) {
      setIsTypeOpen(true);
    }
  }, [pathname]);

  // Keyboard shortcut to toggle filter sidebar (Ctrl+B or Cmd+B)
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "b" &&
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        !event.altKey
      ) {
        event.preventDefault();
        setIsFilterOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsFilterOpen]);

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
    isCategoriesOpen,
    setIsCategoriesOpen,
    isTypeOpen,
    setIsTypeOpen,
    isRatingsOpen,
    setIsRatingsOpen,
    isTechStackOpen,
    setIsTechStackOpen,
    isFilterOpen,
    setIsFilterOpen,
  };
}
