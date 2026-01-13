"use client";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { Pencil, Trash2, Plus, FolderPlus } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useStateArticlesCategories from "@/components/dashboard/articles/category/lib/useStateArticlesCategories";

import FormModalArticlesCategories from "@/components/dashboard/articles/category/modal/FormModalArticlesCategories";

import DeleteModalArticlesCategories from "@/components/dashboard/articles/category/modal/DeleteModalArticlesCategories";

import useFormatDate from "@/hooks/FormatDate";

export default function CategoriesLayout() {
  const {
    // data
    categories,
    formData,
    editingCategory,
    categoryToDelete,
    // loading state
    isLoading,
    isSubmitting,
    isDeleting,
    // modal state
    isDialogOpen,
    isDeleteDialogOpen,
    // setters
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    setFormData,
    setCategoryToDelete,
    setEditingCategory,
    // handlers
    handleSubmit,
    handleDelete,
    handleEdit,
    handleDeleteClick,
    resetForm,
  } = useStateArticlesCategories();

  const { formatDate, formatUpdatedAt } = useFormatDate();

  return (
    <section className="flex flex-col gap-6">
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">All Categories</CardTitle>
              <CardDescription className="mt-1.5 text-base">
                <span className="font-semibold text-foreground">{categories.length}</span> category(ies)
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="default"
                className="px-6 py-2 font-medium"
                onClick={() => {
                  setEditingCategory(null);
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Category
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="rounded-lg border-2 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2">
                      <TableHead className="font-bold text-sm h-12">
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead className="font-bold text-sm">
                        <Skeleton className="h-4 w-24" />
                      </TableHead>
                      <TableHead className="font-bold text-sm">
                        <Skeleton className="h-4 w-24" />
                      </TableHead>
                      <TableHead className="font-bold text-sm">
                        <Skeleton className="h-4 w-24" />
                      </TableHead>
                      <TableHead className="font-bold text-sm text-center">
                        <Skeleton className="h-4 w-20 mx-auto" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(10)].map((_, i) => (
                      <TableRow
                        key={i}
                        className="border-b hover:bg-muted/30 transition-colors group"
                      >
                        <TableCell className="py-4">
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell className="py-4">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="py-4">
                          <Skeleton className="h-4 w-28" />
                        </TableCell>
                        <TableCell className="py-4">
                          <Skeleton className="h-4 w-28" />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex justify-center gap-2">
                            <Skeleton className="h-9 w-9 rounded-md" />
                            <Skeleton className="h-9 w-9 rounded-md" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <FolderPlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-semibold text-lg mb-2">No categories found</p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                Categories help you organize your content. Get started by creating your first category.
              </p>
              <Button
                variant="default"
                className="mt-4"
                onClick={() => {
                  setEditingCategory(null);
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Category
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border-2 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2">
                      <TableHead className="font-bold text-sm h-12">Name</TableHead>
                      <TableHead className="font-bold text-sm">Category ID</TableHead>
                      <TableHead className="font-bold text-sm">Created At</TableHead>
                      <TableHead className="font-bold text-sm">Updated At</TableHead>
                      <TableHead className="font-bold text-sm text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow
                        key={category._id}
                        className="border-b hover:bg-muted/30 transition-colors group"
                      >
                        <TableCell className="py-4">
                          <span className="font-semibold text-sm">{category.title}</span>
                        </TableCell>
                        <TableCell className="py-4">{category.categoryId}</TableCell>
                        <TableCell className="py-4">
                          {category.createdAt ? formatDate(category.createdAt) : "N/A"}
                        </TableCell>
                        <TableCell className="py-4">
                          {category.updatedAt ? formatUpdatedAt(category.updatedAt) : "N/A"}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(category)}
                              disabled={isSubmitting || isDeleting}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(category)}
                              disabled={isSubmitting || isDeleting}
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

      <FormModalArticlesCategories
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingCategory={editingCategory}
        formData={formData}
        setFormData={(v) => setFormData(v)}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />

      <DeleteModalArticlesCategories
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemTitle={categoryToDelete?.title}
      />
    </section>
  );
}
