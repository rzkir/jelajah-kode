"use client";

import { Button } from "@/components/ui/button";

import { Pencil, Trash2, Plus, FolderPlus } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import useStateProductsType from "@/components/dashboard/products/Type/lib/useStateProductsType";

import FormModalProductsType from "@/components/dashboard/products/Type/modal/FormModalProductsType";

import DeleteModalProductsType from "@/components/dashboard/products/Type/modal/DeleteModalProductsType";

import useFormatDate from "@/hooks/FormatDate";

export default function TypeLayout() {
  const {
    // data
    types,
    formData,
    editingType,
    typeToDelete,
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
    setTypeToDelete,
    setEditingType,
    // handlers
    handleSubmit,
    handleDelete,
    handleEdit,
    handleDeleteClick,
    resetForm,
  } = useStateProductsType();

  const { formatDate, formatUpdatedAt } = useFormatDate();

  return (
    <section className="flex flex-col gap-6">
      <Card className="border-2 shadow-lg">
        <CardHeader className="pb-4 border-b bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">Types</CardTitle>
              <CardDescription className="mt-1.5 text-base">
                <span className="font-semibold text-foreground">{types.length}</span> type(s)
              </CardDescription>
            </div>
            <Button
              variant="default"
              className="px-6 py-2 font-medium"
              onClick={() => {
                setEditingType(null);
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Type
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="rounded-lg border-2 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2">
                      <TableHead className="font-bold text-sm h-12">Name</TableHead>
                      <TableHead className="font-bold text-sm">Type ID</TableHead>
                      <TableHead className="font-bold text-sm">Created At</TableHead>
                      <TableHead className="font-bold text-sm">Updated At</TableHead>
                      <TableHead className="font-bold text-sm text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index} className="border-b">
                        <TableCell className="pl-4">
                          <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-28" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-28" />
                        </TableCell>
                        <TableCell className="text-center">
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
          ) : types.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <FolderPlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-semibold text-lg mb-2">No types found</p>
              <p className="text-sm text-muted-foreground mb-4">
                Types help you organize your content. Get started by creating your first type.
              </p>
              <Button
                variant="default"
                onClick={() => {
                  setEditingType(null);
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Type
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border-2 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2">
                      <TableHead className="font-bold text-sm h-12">Name</TableHead>
                      <TableHead className="font-bold text-sm">Type ID</TableHead>
                      <TableHead className="font-bold text-sm">Created At</TableHead>
                      <TableHead className="font-bold text-sm">Updated At</TableHead>
                      <TableHead className="font-bold text-sm text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {types.map((type) => (
                      <TableRow key={type._id} className="border-b hover:bg-muted/30 transition-colors">
                        <TableCell className="pl-4">{type.title}</TableCell>
                        <TableCell>{type.typeId}</TableCell>
                        <TableCell>{type.createdAt ? formatDate(type.createdAt) : "N/A"}</TableCell>
                        <TableCell>{type.updatedAt ? formatUpdatedAt(type.updatedAt) : "N/A"}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(type)}
                              disabled={isSubmitting || isDeleting}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(type)}
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

      <FormModalProductsType
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        editingType={editingType}
        formData={formData}
        setFormData={(v) => setFormData(v)}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        resetForm={resetForm}
      />

      <DeleteModalProductsType
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setTypeToDelete(null);
        }}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemTitle={typeToDelete?.title}
      />
    </section>
  );
}
