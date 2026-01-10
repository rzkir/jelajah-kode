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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import BottomSheet from "@/helper/bottomsheets/BottomShets";

import { Search, Plus, Pencil, Trash2, Eye, Grid3X3, List, Filter } from "lucide-react";

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
  } = useStateArticles();

  if (isLoading) {
    return <ArticlesSkelaton />;
  }

  return (
    <section className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 py-6 border rounded-2xl">
        <div className="flex flex-col gap-3">
          <h3 className="text-3xl font-bold">Articles</h3>

          <ol className="flex gap-2 items-center text-sm text-muted-foreground">
            <li className="flex items-center hover:text-primary transition-colors">
              <span>Dashboard</span>
              <svg
                className="w-4 h-4 mx-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
            <li className="flex items-center text-primary font-medium">
              <span>Articles</span>
            </li>
          </ol>
        </div>

        <div className="flex items-center gap-3">
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

      <div className="flex flex-wrap items-center gap-3 flex-1">
        <div className="relative">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-64 pl-9"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>

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

      {/* Content Section */}
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentArticles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="mx-auto h-12 w-12 text-muted-foreground/50">
                <svg
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium">No articles found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? `No articles match your search for "${searchTerm}".`
                  : "Get started by creating a new article."}
              </p>
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
      ) : (
        <div className="border rounded-2xl border-border bg-card shadow-sm overflow-hidden">
          {currentArticles.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto h-12 w-12 text-muted-foreground/50">
                <svg
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium">No articles found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? `No articles match your search for "${searchTerm}".`
                  : "Get started by creating a new article."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentArticles.map((article) => (
                  <TableRow key={article._id}>
                    <TableCell className="px-4">
                      {article.thumbnail ? (
                        <Image
                          src={article.thumbnail}
                          alt={article.title}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            No image
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {article.title}
                    </TableCell>
                    <TableCell>
                      {article.category?.title || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          article.status === "publish" ? "default" : "secondary"
                        }
                      >
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
          )}
        </div>
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
