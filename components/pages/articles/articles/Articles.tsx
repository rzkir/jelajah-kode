"use client"

import ArticlesCard from "@/components/ui/articles/ArticlesCard"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ScrollArea } from "@/components/ui/scroll-area"

import { useTranslation } from "@/hooks/useTranslation"

import { useStateArticles } from "./lib/useStateArticles"

import { Badge } from "@/components/ui/badge"

export default function Articles({ articles, categories, pagination, initialFilters, page = 1 }: ArticlesProps) {
    const { selectedCategory, filteredArticles, handleCategoryChange, buildPaginationUrl } = useStateArticles({
        articles,
        initialFilters,
    });

    const { t } = useTranslation();

    return (
        <section className="min-h-screen">
            <div className="container mx-auto px-4 py-2 md:py-4">
                {/* Header */}
                <div className="flex justify-center items-center gap-4 py-14">
                    <div className="flex flex-col gap-2 text-center items-center">
                        <Badge variant="outline" className="text-sm text-muted-foreground">
                            {pagination
                                ? `${t("articlesPage.badgeShowing")} ${filteredArticles.length} ${t("articlesPage.badgeOf")} ${pagination.total} ${t("articlesPage.badgeArticles")}`
                                : `${filteredArticles.length} ${t("articlesPage.badgeFallback")}`}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {t("articlesPage.title")}
                        </h1>
                        <p className="text-lg text-muted-foreground text-balance">
                            {t("articlesPage.subtitle")}
                        </p>
                    </div>
                </div>

                {/* Category Navigation */}
                <div className="mb-10 w-full">
                    <Tabs
                        value={selectedCategory}
                        onValueChange={handleCategoryChange}
                        className="w-full"
                    >
                        {/* Mobile: horizontal scroll using ScrollArea */}
                        <div className="block md:hidden">
                            <ScrollArea className="w-full">
                                <TabsList className="flex w-max gap-1 h-auto">
                                    <TabsTrigger value="all" className="text-sm">
                                        {t("articlesPage.tabAll")}
                                    </TabsTrigger>
                                    {categories.map((category) => {
                                        const categoryId = category.categoryId || category.title || ""
                                        return (
                                            <TabsTrigger
                                                key={category.categoryId || category._id}
                                                value={categoryId}
                                                className="text-sm"
                                            >
                                                {category.title}
                                            </TabsTrigger>
                                        )
                                    })}
                                </TabsList>
                            </ScrollArea>
                        </div>

                        {/* Desktop: full-width tabs */}
                        <TabsList className="hidden md:flex w-full flex-wrap h-auto gap-1 justify-start">
                            <TabsTrigger value="all" className="text-sm flex-1">
                                {t("articlesPage.tabAll")}
                            </TabsTrigger>
                            {categories.map((category) => {
                                const categoryId = category.categoryId || category.title || ""
                                return (
                                    <TabsTrigger
                                        key={category.categoryId || category._id}
                                        value={categoryId}
                                        className="text-sm flex-1"
                                    >
                                        {category.title}
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Articles Grid */}
                {filteredArticles.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                    {t("articlesPage.paginationPrevious")}
                                </a>
                                <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                    {t("articlesPage.paginationPage")} {pagination.page} {t("articlesPage.paginationOf")} {pagination.pages}
                                </span>
                                <a
                                    href={buildPaginationUrl(Math.min(pagination.pages, page + 1))}
                                    className={`px-4 py-2 rounded-md border transition-colors ${page === pagination.pages
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                    aria-disabled={page === pagination.pages}
                                >
                                    {t("articlesPage.paginationNext")}
                                </a>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                            {t("articlesPage.empty")}
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}
