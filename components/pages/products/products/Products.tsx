"use client"

import * as React from "react"

import { usePathname } from "next/navigation"

import ProductsCard from "@/components/ui/products/ProductsCard"

import SearchProductsFilter from "@/components/pages/search/SearchProductsFilter"

import { useStateProducts } from "@/components/pages/products/products/lib/useStateProducts"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { Filter, PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"

import { useTranslation } from "@/hooks/useTranslation"

export default function Products({ products, pagination, categories, types, initialFilters, page = 1, disabledCategories = false, disabledTypes = false }: ProductsProps) {
    const { t } = useTranslation();
    const productsArray = React.useMemo(() => Array.isArray(products) ? products : [], [products]);
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const pathname = usePathname()

    const {
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
    } = useStateProducts(initialFilters, page)

    const filterContent = (
        <SearchProductsFilter
            searchQuery={filters.searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategories={filters.selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedTypes={filters.selectedTypes}
            setSelectedTypes={setSelectedTypes}
            selectedTechStack={filters.selectedTechStack}
            setSelectedTechStack={setSelectedTechStack}
            priceRange={filters.priceRange}
            setPriceRange={setPriceRange}
            minRating={filters.minRating}
            setMinRating={setMinRating}
            popularOnly={filters.popularOnly}
            setPopularOnly={setPopularOnly}
            newArrivals={filters.newArrivals}
            setNewArrivals={setNewArrivals}
            products={productsArray}
            categories={categories}
            types={types}
            isCategoriesOpen={isCategoriesOpen}
            setIsCategoriesOpen={setIsCategoriesOpen}
            isTypeOpen={isTypeOpen}
            setIsTypeOpen={setIsTypeOpen}
            isRatingsOpen={isRatingsOpen}
            setIsRatingsOpen={setIsRatingsOpen}
            isTechStackOpen={isTechStackOpen}
            setIsTechStackOpen={setIsTechStackOpen}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            typeSelectMode="single"
            categorySelectMode="single"
            disabledCategories={disabledCategories}
            disabledTypes={disabledTypes}
        />
    )

    return (
        <section className="min-h-screen">
            <div className="container mx-auto px-2 md:px-4 py-2 md:py-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className={cn(
                        "hidden lg:block lg:sticky lg:top-8 lg:h-fit transition-all duration-300 ease-in-out relative",
                        isFilterOpen ? "lg:w-80" : "lg:w-12"
                    )}>
                        <div className={cn(
                            "transition-opacity duration-300",
                            isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                        )}>
                            {filterContent}
                        </div>
                        {!isFilterOpen && (
                            <div className="absolute top-0 left-0 flex items-start justify-center w-12 pt-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="size-7"
                                >
                                    <PanelLeft className="h-4 w-4" />
                                    <span className="sr-only">Toggle Filters</span>
                                </Button>
                            </div>
                        )}
                    </aside>

                    <main className="flex-1">
                        {/* Header */}
                        <div className="sticky top-14 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 lg:static lg:bg-transparent lg:backdrop-blur-0 mb-6 pb-4 lg:pb-0 border-b lg:border-b-0">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 lg:pt-0">
                                <div className="hidden sm:block">
                                    <h1 className="text-2xl font-bold mb-2" suppressHydrationWarning>{t("productsPage.title")}</h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400" suppressHydrationWarning>
                                        {t("productsPage.showing")} {productsArray.length} {t("productsPage.of")} {pagination.total} {t("productsPage.products")}
                                    </p>
                                </div>
                                <div className="flex gap-2 items-center w-full sm:w-auto">
                                    {/* Mobile Filter Button & Sheet */}
                                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                        <SheetTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="lg:hidden flex-1 sm:flex-initial"
                                            >
                                                <Filter className="w-4 h-4 mr-2" />
                                                <span suppressHydrationWarning>{t("productsPage.filters")}</span>
                                            </Button>
                                        </SheetTrigger>

                                        <SheetContent side="left" className="w-[85vw] sm:w-[400px] overflow-y-auto">
                                            <SheetHeader>
                                                <SheetTitle suppressHydrationWarning>{t("productsPage.filters")}</SheetTitle>
                                            </SheetHeader>
                                            <div className="p-4">
                                                {filterContent}
                                            </div>
                                        </SheetContent>
                                    </Sheet>

                                    <Button
                                        variant="outline"
                                        onClick={handleReset}
                                        disabled={isFiltersDefault}
                                        className="hidden sm:inline-flex"
                                    >
                                        <span suppressHydrationWarning>{t("productsPage.resetFilters")}</span>
                                    </Button>

                                    <Select value={filters.sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder={t("productsPage.sortBy")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest" suppressHydrationWarning>{t("productsPage.newestFirst")}</SelectItem>
                                            <SelectItem value="oldest" suppressHydrationWarning>{t("productsPage.oldestFirst")}</SelectItem>
                                            <SelectItem value="price-low" suppressHydrationWarning>{t("productsPage.priceLowToHigh")}</SelectItem>
                                            <SelectItem value="price-high" suppressHydrationWarning>{t("productsPage.priceHighToLow")}</SelectItem>
                                            <SelectItem value="rating" suppressHydrationWarning>{t("productsPage.highestRated")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {/* Mobile Title & Count */}
                            <div className="sm:hidden mt-4">
                                <h1 className="text-xl font-bold mb-1" suppressHydrationWarning>{t("productsPage.title")}</h1>
                                <p className="text-xs text-gray-600 dark:text-gray-400" suppressHydrationWarning>
                                    {t("productsPage.showing")} {productsArray.length} {t("productsPage.of")} {pagination.total} {t("productsPage.products")}
                                </p>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {productsArray.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                                    {productsArray.map((item, idx) => (
                                        <ProductsCard
                                            key={item.productsId || item._id || `product-${idx}`}
                                            item={item as Products}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (() => {
                                    const buildPaginationUrl = (pageNum: number) => {
                                        const params = new URLSearchParams();
                                        params.set("page", pageNum.toString());
                                        if (initialFilters?.q) params.set("q", initialFilters.q);

                                        // Don't add categories query param if we're on a category page (already in pathname)
                                        const isOnCategoryPage = pathname?.startsWith("/products/categories/");
                                        if (initialFilters?.categories && !isOnCategoryPage) {
                                            params.set("categories", initialFilters.categories);
                                        }

                                        // Don't add types query param if we're on a type page (already in pathname)
                                        const isOnTypePage = pathname?.startsWith("/products/types/");
                                        if (initialFilters?.types && !isOnTypePage) {
                                            params.set("types", initialFilters.types);
                                        }

                                        if (initialFilters?.tech) params.set("tech", initialFilters.tech);
                                        if (initialFilters?.minPrice) params.set("minPrice", initialFilters.minPrice);
                                        if (initialFilters?.maxPrice) params.set("maxPrice", initialFilters.maxPrice);
                                        if (initialFilters?.minRating) params.set("minRating", initialFilters.minRating);
                                        if (initialFilters?.popular) params.set("popular", initialFilters.popular);
                                        if (initialFilters?.new) params.set("new", initialFilters.new);
                                        if (initialFilters?.sort) params.set("sort", initialFilters.sort);
                                        const basePath = pathname || "/products";
                                        return `${basePath}${params.toString() ? `?${params.toString()}` : ""}`;
                                    };

                                    return (
                                        <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                                            <a
                                                href={buildPaginationUrl(Math.max(1, page - 1))}
                                                className={`px-4 py-2 rounded-md border transition-colors ${page === 1
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    }`}
                                                aria-disabled={page === 1}
                                            >
                                                <span suppressHydrationWarning>{t("productsPage.previous")}</span>
                                            </a>
                                            <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400" suppressHydrationWarning>
                                                {t("productsPage.page")} {pagination.page} {t("productsPage.of")} {pagination.pages}
                                            </span>
                                            <a
                                                href={buildPaginationUrl(Math.min(pagination.pages, page + 1))}
                                                className={`px-4 py-2 rounded-md border transition-colors ${page === pagination.pages
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    }`}
                                                aria-disabled={page === pagination.pages}
                                            >
                                                <span suppressHydrationWarning>{t("productsPage.next")}</span>
                                            </a>
                                        </div>
                                    );
                                })()}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-lg" suppressHydrationWarning>
                                    {t("productsPage.noProductsAvailable")}
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </section>
    )
}
