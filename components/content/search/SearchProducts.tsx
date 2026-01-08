"use client"

import * as React from "react"

import ProductsCard from "@/components/ui/products/ProductsCard"

import SearchProductsFilter from "@/components/content/search/SearchProductsFilter"

import { useStateSearch } from "@/components/content/search/lib/useStateSearch"

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

import { Filter } from "lucide-react"

export default function SearchProducts({ products, pagination, query, page, categories, types, initialFilters }: SearchProductsProps) {
    const productsArray = React.useMemo(() => Array.isArray(products) ? products : [], [products]);
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)

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
    } = useStateSearch(initialFilters, query, page)

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
        />
    )

    return (
        <section className="min-h-screen">
            <div className="container mx-auto px-2 md:px-4 py-2 md:py-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar - Desktop */}
                    <aside className="hidden lg:block lg:sticky lg:top-8 lg:h-fit">
                        <div className="">
                            {filterContent}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Header */}
                        <div className="sticky top-14 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 lg:static lg:bg-transparent lg:backdrop-blur-0 mb-6 pb-4 lg:pb-0 border-b lg:border-b-0">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 lg:pt-0">
                                <div className="hidden sm:block">
                                    <h1 className="text-2xl font-bold mb-2">Search Products</h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Showing {productsArray.length} of {pagination.total} products
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
                                                Filters
                                            </Button>
                                        </SheetTrigger>

                                        <SheetContent side="left" className="w-[85vw] sm:w-[400px] overflow-y-auto">
                                            <SheetHeader>
                                                <SheetTitle>Filters</SheetTitle>
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
                                        Reset Filters
                                    </Button>

                                    <Select value={filters.sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-full sm:w-[180px]">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="newest">Newest First</SelectItem>
                                            <SelectItem value="oldest">Oldest First</SelectItem>
                                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                                            <SelectItem value="rating">Highest Rated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {/* Mobile Title & Count */}
                            <div className="sm:hidden mt-4">
                                <h1 className="text-xl font-bold mb-1">Search Products</h1>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Showing {productsArray.length} of {pagination.total} products
                                </p>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {productsArray.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {productsArray.map((item, idx) => (
                                        <ProductsCard
                                            key={item.productsId || item._id || `product-${idx}`}
                                            item={item as Products}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                                        <a
                                            href={`/search?q=${encodeURIComponent(query)}&page=${Math.max(
                                                1,
                                                page - 1
                                            )}`}
                                            className={`px-4 py-2 rounded-md border transition-colors ${page === 1
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                                }`}
                                            aria-disabled={page === 1}
                                        >
                                            Previous
                                        </a>
                                        <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                            Page {pagination.page} of {pagination.pages}
                                        </span>
                                        <a
                                            href={`/search?q=${encodeURIComponent(query)}&page=${Math.min(
                                                pagination.pages,
                                                page + 1
                                            )}`}
                                            className={`px-4 py-2 rounded-md border transition-colors ${page === pagination.pages
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                                }`}
                                            aria-disabled={page === pagination.pages}
                                        >
                                            Next
                                        </a>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground text-lg">
                                    {query
                                        ? `No products found for "${query}"`
                                        : "No products available"}
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </section>
    )
}