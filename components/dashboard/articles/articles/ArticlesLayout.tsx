"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import BottomSheet from "@/helper/bottomsheets/BottomShets";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search, Plus, Pencil, Trash2, Eye, Grid3X3, List, Filter, FileText, CheckCircle } from "lucide-react";

import Image from "next/image";

import DeleteModalArticles from "@/components/dashboard/articles/articles/modal/DeleteModalArticles";

import useStateArticles from "@/components/dashboard/articles/articles/lib/useStateArticles";

import ArticlesSkelaton from "@/components/dashboard/articles/articles/ArticlesSkelaton";

export default function ArticlesLayout() {
  const {
    // Data
    articles,
    categories,
    currentArticles,

    // Loading states
    isLoading,
    isSubmitting,

    // Modal states
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,

    // Delete states
    setDeleteId,
    deleteItemTitle,
    setDeleteItemTitle,

    // Pagination states
    currentPage,
    setCurrentPage,
    totalPages,

    // Search and view states
    searchTerm,
    selectedCategory,
    selectedStatus,
    viewMode,
    setViewMode,

    // Filter sheet state
    isFilterSheetOpen,
    setIsFilterSheetOpen,

    // Functions
    handleDelete,
    confirmDelete,
    handleSearchChange,
    handleCategoryChange,
    handleStatusChange,
    router,
    totalArticles,
    filteredArticlesCount,
    publishedArticles,
    draftArticles,
    hasActiveFilters,
  } = useStateArticles();

  if (isLoading) {
    return <ArticlesSkelaton />;
  }

  return (
    <section className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Articles</p>
                <p className="text-2xl font-bold mt-1 text-primary">
                  {filteredArticlesCount}
                </p>
                {hasActiveFilters && filteredArticlesCount !== totalArticles && (
                  <p className="text-xs text-muted-foreground mt-1">
                    All: {totalArticles}
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                  {publishedArticles}
                </p>
                {hasActiveFilters && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {articles.filter(a => a.status === "publish").length} total
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                  {draftArticles}
                </p>
                {hasActiveFilters && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {articles.filter(a => a.status === "draft").length} total
                  </p>
                )}
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold mt-1">
                  {categories.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Unique categories
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-row justify-between items-center gap-3 flex-1 p-4 bg-muted/30 rounded-lg border">
        <div className="relative w-full">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-9"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>

        {/* Desktop Filters - Select Components */}
        <div className="hidden md:flex items-center gap-3">
          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.categoryId} value={category.categoryId}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={selectedStatus}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="publish">Publish</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex items-center border rounded-md p-1">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
              className="h-8 px-3"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Card
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="h-8 px-3"
            >
              <List className="w-4 h-4 mr-2" />
              Table
            </Button>
          </div>
        </div>

        {/* Mobile Filter - BottomSheet */}
        <div className="md:hidden">
          <BottomSheet
            open={isFilterSheetOpen}
            onOpenChange={setIsFilterSheetOpen}
            trigger={
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            }
            title="Filter Articles"
            description="Filter articles by category, status, and view mode"
            side="right"
            contentClassName="w-full max-w-full"
            className="space-y-6 px-4 pb-4"
          >
            {/* Category Filter */}
            <div className="flex flex-col gap-3 mb-2">
              <label className="text-sm font-medium">Category</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange("all")}
                  className="h-9"
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.categoryId}
                    variant={
                      selectedCategory === category.categoryId
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleCategoryChange(category.categoryId)}
                    className="h-9"
                  >
                    {category.title}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col gap-3 mb-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("all")}
                  className="h-9"
                >
                  All Status
                </Button>
                <Button
                  variant={selectedStatus === "publish" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("publish")}
                  className="h-9"
                >
                  Publish
                </Button>
                <Button
                  variant={selectedStatus === "draft" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange("draft")}
                  className="h-9"
                >
                  Draft
                </Button>
              </div>
            </div>

            {/* View Mode */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">View Mode</label>
              <div className="flex items-center border rounded-md p-1 w-fit">
                <Button
                  variant={viewMode === "card" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("card")}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Card
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4 mr-2" />
                  Table
                </Button>
              </div>
            </div>
          </BottomSheet>
        </div>
      </div>

      {/* Content Section */}
      {viewMode === "card" ? (
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4 border-b bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">All Articles</CardTitle>
                <CardDescription className="mt-1.5 text-base">
                  <span className="font-semibold text-foreground">{currentArticles.length}</span> article(s)
                  {hasActiveFilters && filteredArticlesCount !== totalArticles && (
                    <span className="text-muted-foreground"> of <span className="font-semibold">{totalArticles}</span> total</span>
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <Badge variant="outline" className="w-fit gap-2 px-3 py-1.5">
                    <Filter className="h-3.5 w-3.5" />
                    Filters Active
                  </Badge>
                )}
                <Button
                  variant="default"
                  className="px-6 py-2 font-medium"
                  onClick={() => router.push("/dashboard/articles/articles/new")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Article
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {currentArticles.length === 0 ? (
                <div className="col-span-full text-center py-16 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-semibold text-lg mb-2">No articles found</p>
                  {hasActiveFilters ? (
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      No articles match your current filters. Try adjusting your search criteria.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {searchTerm
                        ? `No articles match your search for "${searchTerm}".`
                        : "Get started by creating a new article."}
                    </p>
                  )}
                </div>
              ) : (
                currentArticles.map((article) => (
                  <Card key={article._id} className="overflow-hidden p-0 group">
                    <div className="relative w-full aspect-4/3 overflow-hidden">
                      {article.thumbnail ? (
                        <Image
                          src={article.thumbnail}
                          alt={article.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={
                            article.status === "publish" ? "default" : "secondary"
                          }
                        >
                          {article.status}
                        </Badge>
                      </div>
                      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/articles/articles/${article.articlesId}`
                            )
                          }
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-lg truncate">
                        {article.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 pb-4 -mt-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.description}
                      </p>

                      <p className="text-xs text-muted-foreground truncate">
                        Tags: {article.tags?.map((tag) => tag.title).join(", ") || "N/A"}
                      </p>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            router.push(
                              `/dashboard/articles/articles/edit?id=${article.articlesId}`
                            )
                          }
                        >
                          <Pencil className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDelete(article._id)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4 border-b bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">All Articles</CardTitle>
                <CardDescription className="mt-1.5 text-base">
                  <span className="font-semibold text-foreground">{currentArticles.length}</span> article(s)
                  {hasActiveFilters && filteredArticlesCount !== totalArticles && (
                    <span className="text-muted-foreground"> of <span className="font-semibold">{totalArticles}</span> total</span>
                  )}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <Badge variant="outline" className="w-fit gap-2 px-3 py-1.5">
                    <Filter className="h-3.5 w-3.5" />
                    Filters Active
                  </Badge>
                )}
                <Button
                  variant="default"
                  className="px-6 py-2 font-medium"
                  onClick={() => router.push("/dashboard/articles/articles/new")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Article
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentArticles.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-semibold text-lg mb-2">No articles found</p>
                {hasActiveFilters ? (
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    No articles match your current filters. Try adjusting your search criteria.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {searchTerm
                      ? `No articles match your search for "${searchTerm}".`
                      : "Get started by creating a new article."}
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border-2 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2">
                        <TableHead className="font-bold text-sm h-12">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Thumbnail
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Title
                          </div>
                        </TableHead>
                        <TableHead className="font-bold text-sm">Category</TableHead>
                        <TableHead className="font-bold text-sm">Status</TableHead>
                        <TableHead className="font-bold text-sm text-center">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentArticles.map((article) => (
                        <TableRow
                          key={article._id}
                          className="border-b hover:bg-muted/30 transition-colors group"
                        >
                          <TableCell className="py-4">
                            {article.thumbnail ? (
                              <Image
                                src={article.thumbnail}
                                alt={article.title}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded-md border-2 border-border"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center border-2 border-border">
                                <span className="text-xs text-muted-foreground">
                                  No image
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="font-semibold text-sm">
                              {article.title}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            {article.category?.title || "N/A"}
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant={
                                article.status === "publish" ? "default" : "secondary"
                              }
                              className="border font-semibold capitalize"
                            >
                              {article.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/articles/articles/${article.articlesId}`
                                  )
                                }
                                disabled={isSubmitting}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/articles/articles/edit?id=${article.articlesId}`
                                  )
                                }
                                disabled={isSubmitting}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(article._id)}
                                disabled={isSubmitting}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination Section */}
      {articles.length > 0 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      <DeleteModalArticles
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setDeleteId(null);
          setDeleteItemTitle(null);
        }}
        onConfirm={confirmDelete}
        isDeleting={isSubmitting}
        itemTitle={deleteItemTitle || undefined}
      />
    </section>
  );
}
