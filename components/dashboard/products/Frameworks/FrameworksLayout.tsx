"use client";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import useFormatDate from "@/hooks/FormatDate";

import { Grid3X3, List, Pencil, Trash2 } from "lucide-react";

import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";

import FormModalFramework from "@/components/dashboard/products/Frameworks/modal/FormModalProductsFrameworks";

import DeleteModalFramework from "@/components/dashboard/products/Frameworks/modal/DeleteModalProductsFrameworks";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import useStateFrameworks from "@/components/dashboard/products/Frameworks/lib/useStateProductsFrameworks";

export default function FrameworkLayout() {
  const {
    frameworks,
    isEditing,
    isUploading,
    isDialogOpen,
    isDeleteDialogOpen,
    deleteId,
    fileInputRef,
    isLoading,
    isDeleting,
    isSubmitting,
    currentPage,
    pendingUploads,
    uploadProgress,
    isDragging,
    dropZoneRef,
    totalPages,
    currentFrameworks,
    viewMode,
    setViewMode,
    searchTerm,
    setIsEditing,
    setIsDialogOpen,
    setIsDeleteDialogOpen,
    setDeleteId,
    setCurrentPage,
    setPendingUploads,
    setUploadProgress,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleMultipleFileUpload,
    handleSubmit,
    handleDelete,
    handleEdit,
    openDeleteDialog,
    handleSearchChange,
  } = useStateFrameworks();

  const { formatDate } = useFormatDate();

  const renderPaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(totalPages);
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Content Section */}
      {viewMode === "card" ? (
        <Card className="border-2 shadow-lg">
          <CardHeader className="pb-4 border-b bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-bold tracking-tight">Frameworks</CardTitle>
                <CardDescription className="mt-1.5 text-base">
                  <span className="font-semibold text-foreground">{currentFrameworks.length}</span> framework(s)
                  {searchTerm && frameworks.length !== currentFrameworks.length && (
                    <span className="text-muted-foreground"> of <span className="font-semibold">{frameworks.length}</span> total</span>
                  )}
                </CardDescription>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Input
                      placeholder="Search frameworks..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-64 pl-9"
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <div className="flex items-center border rounded-md p-1">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setViewMode("card")}
                      className="h-8 px-2"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("table")}
                      className="h-8 px-2"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    variant="default"
                    className="px-8 py-3 font-medium shadow-sm hover:shadow-md transition-all bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setIsEditing(false);
                      setIsDialogOpen(true);
                    }}
                  >
                    Create Content
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index}>
                    <div className="flex flex-col gap-4 sm:gap-6 p-6">
                      <Skeleton className="w-full h-48 rounded-xl" />
                      <div className="flex-1">
                        <div className="flex flex-col justify-between items-start gap-4">
                          <div className="space-y-3 w-full">
                            <Skeleton className="h-7 w-40" />
                          </div>
                          <div className="flex gap-3 w-full">
                            <Skeleton className="h-10 flex-1" />
                            <Skeleton className="h-10 flex-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : frameworks.length === 0 || currentFrameworks.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="p-8 flex flex-col items-center gap-4">
                    <svg
                      className="w-16 h-16 text-muted-foreground/50"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                      {searchTerm
                        ? "No Matching Frameworks Found"
                        : "No Frameworks Found"}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm
                        ? `No frameworks match your search for "${searchTerm}".`
                        : 'Start by creating your first framework using the "Create Content" button above.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                currentFrameworks.map((framework) => (
                  <Card key={framework._id}>
                    <div className="flex flex-col gap-4 sm:gap-6 p-6">
                      <div className="relative w-full aspect-4/3 shrink-0">
                        {framework.thumbnail ? (
                          <Image
                            src={framework.thumbnail}
                            alt={framework.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
                            <span className="text-muted-foreground text-sm">
                              No image
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col justify-between items-start gap-4">
                          <div className="space-y-2 w-full">
                            <h4 className="text-lg sm:text-xl font-bold">
                              {framework.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {framework.createdAt
                                ? formatDate(framework.createdAt)
                                : "N/A"}
                            </p>
                          </div>
                          <div className="flex gap-3 w-full">
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={() => {
                                handleEdit(framework);
                                setIsDialogOpen(true);
                              }}
                              className="flex-1"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="lg"
                              onClick={() =>
                                framework._id && openDeleteDialog(framework._id)
                              }
                              className="flex-1"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
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
                <CardTitle className="text-2xl font-bold tracking-tight">Frameworks</CardTitle>
                <CardDescription className="mt-1.5 text-base">
                  <span className="font-semibold text-foreground">{currentFrameworks.length}</span> framework(s)
                  {searchTerm && frameworks.length !== currentFrameworks.length && (
                    <span className="text-muted-foreground"> of <span className="font-semibold">{frameworks.length}</span> total</span>
                  )}
                </CardDescription>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Input
                      placeholder="Search frameworks..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-64 pl-9"
                    />
                    <svg
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <div className="flex items-center border rounded-md p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("card")}
                      className="h-8 px-2"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setViewMode("table")}
                      className="h-8 px-2"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    variant="default"
                    className="px-8 py-3 font-medium shadow-sm hover:shadow-md transition-all bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setIsEditing(false);
                      setIsDialogOpen(true);
                    }}
                  >
                    Create Content
                  </Button>
                </div>
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
                        <TableHead className="font-bold text-sm h-12">Thumbnail</TableHead>
                        <TableHead className="font-bold text-sm">Title</TableHead>
                        <TableHead className="font-bold text-sm">Framework ID</TableHead>
                        <TableHead className="font-bold text-sm">Created At</TableHead>
                        <TableHead className="font-bold text-sm text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index} className="border-b">
                          <TableCell className="px-4">
                            <Skeleton className="w-16 h-16 rounded-md" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-32" />
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-24" />
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
            ) : frameworks.length === 0 || currentFrameworks.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <svg
                    className="h-8 w-8 text-muted-foreground"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>
                </div>
                <p className="text-foreground font-semibold text-lg mb-2">
                  {searchTerm
                    ? "No Matching Frameworks Found"
                    : "No Frameworks Found"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm
                    ? `No frameworks match your search for "${searchTerm}".`
                    : 'Start by creating your first framework using the "Create Content" button above.'}
                </p>
              </div>
            ) : (
              <div className="rounded-lg border-2 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2">
                        <TableHead className="font-bold text-sm h-12">Thumbnail</TableHead>
                        <TableHead className="font-bold text-sm">Title</TableHead>
                        <TableHead className="font-bold text-sm">Framework ID</TableHead>
                        <TableHead className="font-bold text-sm">Created At</TableHead>
                        <TableHead className="font-bold text-sm text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentFrameworks.map((framework) => (
                        <TableRow key={framework._id} className="border-b hover:bg-muted/30 transition-colors">
                          <TableCell className="px-4">
                            {framework.thumbnail ? (
                              <div className="w-16 h-16 rounded-md overflow-hidden">
                                <Image
                                  src={framework.thumbnail}
                                  alt={framework.title}
                                  width={64}
                                  height={64}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">
                                  No image
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {framework.title}
                          </TableCell>
                          <TableCell>{framework.frameworkId}</TableCell>
                          <TableCell>
                            {framework.createdAt
                              ? formatDate(framework.createdAt)
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  handleEdit(framework);
                                  setIsDialogOpen(true);
                                }}
                                disabled={isSubmitting || isDeleting}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  framework._id && openDeleteDialog(framework._id)
                                }
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
      )}

      {/* Pagination Section */}
      {!isLoading && (frameworks.length > 0 || searchTerm) && (
        <div className="flex justify-center pt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Render page numbers with ellipsis */}
              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <FormModalFramework
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        isEditing={isEditing}
        handleSubmit={handleSubmit}
        dropZoneRef={dropZoneRef}
        isDragging={isDragging}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        pendingUploads={pendingUploads}
        setPendingUploads={setPendingUploads}
        uploadProgress={uploadProgress}
        setUploadProgress={setUploadProgress}
        fileInputRef={fileInputRef}
        isUploading={isUploading}
        isSubmitting={isSubmitting}
        handleMultipleFileUpload={handleMultipleFileUpload}
      />

      <DeleteModalFramework
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setDeleteId(null);
        }}
        onConfirm={() => {
          if (deleteId) handleDelete(deleteId);
        }}
        isDeleting={isDeleting}
      />
    </section>
  );
}
