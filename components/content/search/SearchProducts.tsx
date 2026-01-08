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

export default function SearchProducts({ products, pagination, query, page, categories, types, initialFilters }: SearchProductsProps) {
    const productsArray = React.useMemo(() => Array.isArray(products) ? products : [], [products]);

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
    } = useStateSearch(initialFilters, query, page)

    return (
        <section className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <aside className="lg:sticky lg:top-8 lg:h-fit">
                        <div className="">
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
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">Search Products</h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Showing {productsArray.length} of {pagination.total} products
                                    </p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Button
                                        variant="outline"
                                        onClick={handleReset}
                                        disabled={isFiltersDefault}
                                    >
                                        Reset Filters
                                    </Button>
                                    <Select value={filters.sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-[180px]">
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
                        </div>
                    </main>
                </div>
            </div>
        </section>
    )
}
