"use client"

import ArticlesCard from "@/components/ui/articles/ArticlesCard"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

import { useStateArticles } from "./lib/useStateArticles"

export default function Articles({ articles, categories, pagination, initialFilters, page = 1 }: ArticlesProps) {
    const { selectedCategory, filteredArticles, isOnCategoryPage, handleCategoryChange, buildPaginationUrl } = useStateArticles({
        articles,
        initialFilters,
    });

    return (
        <section className="min-h-screen">
            <div className="container mx-auto px-4 py-2 md:py-4">
                {/* Header */}
                <div className="sticky top-14 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 lg:static lg:bg-transparent lg:backdrop-blur-0 mb-6 pb-4 lg:pb-0 border-b lg:border-b-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 lg:pt-0">
                        <div className="hidden sm:block">
                            <p className="text-sm text-muted-foreground mb-1">
                                {pagination ? `Showing ${filteredArticles.length} of ${pagination.total} articles` : `${filteredArticles.length} Articles`}
                            </p>
                            <h1 className="text-3xl font-bold mb-2">Developer Resources</h1>
                            <p className="text-sm text-muted-foreground">
                                Learn from detailed guides, tutorials, and best practices for modern web development.
                            </p>
                        </div>
                    </div>
                    {/* Mobile Title & Count */}
                    <div className="sm:hidden mt-4">
                        <p className="text-xs text-muted-foreground mb-1">
                            {pagination ? `Showing ${filteredArticles.length} of ${pagination.total} articles` : `${filteredArticles.length} Articles`}
                        </p>
                        <h1 className="text-2xl font-bold mb-2">Developer Resources</h1>
                        <p className="text-xs text-muted-foreground">
                            Learn from detailed guides, tutorials, and best practices for modern web development.
                        </p>
                    </div>
                </div>

                {/* Category Navigation */}
                <div className="mb-6 overflow-x-auto">
                    <div className="flex gap-2 pb-2">
                        <Button
                            variant={selectedCategory === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleCategoryChange("all")}
                            className={cn(
                                "whitespace-nowrap",
                                selectedCategory === "all" && "bg-primary text-primary-foreground"
                            )}
                        >
                            All
                        </Button>
                        {categories.map((category) => {
                            const categoryId = category.categoryId || category.title || "";
                            const isSelected = selectedCategory === categoryId ||
                                (isOnCategoryPage && initialFilters?.category === categoryId);
                            return (
                                <Button
                                    key={category.categoryId || category._id}
                                    variant={isSelected ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleCategoryChange(categoryId)}
                                    className={cn(
                                        "whitespace-nowrap",
                                        isSelected && "bg-primary text-primary-foreground"
                                    )}
                                >
                                    {category.title}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {/* Articles Grid */}
                {filteredArticles.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-6">
                            {filteredArticles.map((item, idx) => (
                                <ArticlesCard
                                    key={item.articlesId || item._id || `article-${idx}`}
                                    item={item as Articles}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.pages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                                <a
                                    href={buildPaginationUrl(Math.max(1, page - 1))}
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
                                    href={buildPaginationUrl(Math.min(pagination.pages, page + 1))}
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
                            No articles available
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}
