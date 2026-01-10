"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

const createInitialState = (
  initialFilters?: SearchProductsProps["initialFilters"],
  query?: string
): FilterState => ({
  searchQuery: initialFilters?.q || query || "",
  selectedCategories:
    initialFilters?.categories?.split(",").filter(Boolean) || [],
  selectedTypes: initialFilters?.types?.split(",").filter(Boolean) || [],
  selectedTechStack: initialFilters?.tech?.split(",").filter(Boolean) || [],
  priceRange: [
    initialFilters?.minPrice ? parseInt(initialFilters.minPrice) : 0,
    initialFilters?.maxPrice ? parseInt(initialFilters.maxPrice) : 200000,
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

export function useStateSearch(
  initialFilters?: SearchProductsProps["initialFilters"],
  query?: string,
  page?: number
) {
  const router = useRouter();

  const [filters, dispatch] = React.useReducer(
    filterReducer,
    createInitialState(initialFilters, query)
  );

  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false);
  const [isTypeOpen, setIsTypeOpen] = React.useState(false);
  const [isRatingsOpen, setIsRatingsOpen] = React.useState(false);
  const [isTechStackOpen, setIsTechStackOpen] = React.useState(false);
  const [isFilterOpen, setIsFilterOpen] = React.useState(true);

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
      const newTech =
        typeof tech === "function" ? tech(filters.selectedTechStack) : tech;
      const singleTech = Array.isArray(newTech) && newTech.length > 0 ? [newTech[0]] : [];
      dispatch({
        type: "SET_TECH_STACK",
        payload: singleTech,
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
      filters.priceRange[0] === 0 &&
      filters.priceRange[1] === 200000 &&
      !filters.minRating &&
      !filters.popularOnly &&
      !filters.newArrivals &&
      filters.sortBy === "newest",
    [filters]
  );

  const handleReset = React.useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
    router.push("/search");
  }, [router]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.searchQuery) params.set("q", filters.searchQuery);
      if (filters.selectedCategories.length > 0)
        params.set("categories", filters.selectedCategories.join(","));
      if (filters.selectedTypes.length > 0)
        params.set("types", filters.selectedTypes.join(","));
      if (filters.selectedTechStack.length > 0)
        params.set("tech", filters.selectedTechStack[0]);
      if (filters.priceRange[0] > 0)
        params.set("minPrice", filters.priceRange[0].toString());
      if (filters.priceRange[1] < 200000)
        params.set("maxPrice", filters.priceRange[1].toString());
      if (filters.minRating)
        params.set("minRating", filters.minRating.toString());
      if (filters.popularOnly) params.set("popular", "true");
      if (filters.newArrivals) params.set("new", "true");
      if (filters.sortBy !== "newest") params.set("sort", filters.sortBy);
      if (page && page > 1) params.set("page", page.toString());

      const newUrl = `/search${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      if (window.location.pathname + window.location.search !== newUrl) {
        router.push(newUrl);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, page, router]);

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

export function useSearchProductsFilter(
  categoriesData: Array<{ _id?: string; categoryId?: string; title: string }>,
  typesData: Array<{ _id?: string; typeId?: string; title: string }>,
  products: ProductsSearchItem[],
  selectedCategories: string[],
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>,
  selectedTypes: string[],
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>,
  selectedTechStack: string[],
  setSelectedTechStack: React.Dispatch<React.SetStateAction<string[]>>
) {
  const categories = React.useMemo(
    () =>
      categoriesData.map((cat) => ({
        value: cat.categoryId || cat._id || "",
        label: cat.title,
      })),
    [categoriesData]
  );

  const types = React.useMemo(
    () =>
      typesData.map((type) => ({
        value: type.typeId || type._id || "",
        label: type.title,
      })),
    [typesData]
  );

  const techStackOptions = React.useMemo(() => {
    const frameworksSet = new Set<string>();
    products.forEach((product) => {
      if (product.frameworks && Array.isArray(product.frameworks)) {
        product.frameworks.forEach((framework) => {
          if (framework.title) {
            frameworksSet.add(framework.title);
          }
        });
      }
    });
    return Array.from(frameworksSet).sort();
  }, [products]);

  const toggleCategory = React.useCallback(
    (categoryValue: string) => {
      setSelectedCategories((prev: string[]) =>
        prev.includes(categoryValue)
          ? prev.filter((c: string) => c !== categoryValue)
          : [...prev, categoryValue]
      );
    },
    [setSelectedCategories]
  );

  const toggleType = React.useCallback(
    (typeValue: string) => {
      setSelectedTypes((prev: string[]) =>
        prev.includes(typeValue)
          ? prev.filter((t: string) => t !== typeValue)
          : [...prev, typeValue]
      );
    },
    [setSelectedTypes]
  );

  const toggleTechStack = React.useCallback(
    (tech: string) => {
      setSelectedTechStack((prev: string[]) =>
        prev.includes(tech)
          ? prev.filter((t: string) => t !== tech)
          : [...prev, tech]
      );
    },
    [setSelectedTechStack]
  );

  return {
    categories,
    types,
    techStackOptions,
    toggleCategory,
    toggleType,
    toggleTechStack,
  };
}
