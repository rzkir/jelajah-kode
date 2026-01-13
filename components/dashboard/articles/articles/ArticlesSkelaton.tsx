"use client";

import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function ArticlesSkelaton() {
    const [viewMode] = useState<"card" | "table">("table");
    return (
        <section className="flex flex-col gap-6">
            {/* Summary Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-2 shadow-md">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-12 w-12 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search and Filter Section Skeleton */}
            <div className="flex flex-row justify-between items-center gap-3 flex-1 p-4 bg-muted/30 rounded-lg border">
                {/* Search Input Skeleton */}
                <div className="relative w-full">
                    <Skeleton className="h-10 w-full" />
                </div>

                {/* Desktop Filters Skeleton - hidden md:flex */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Category Filter Skeleton */}
                    <Skeleton className="h-10 w-[180px]" />

                    {/* Status Filter Skeleton */}
                    <Skeleton className="h-10 w-[180px]" />

                    {/* View Mode Toggle Skeleton */}
                    <div className="flex items-center border rounded-md p-1">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                </div>

                {/* Mobile Filter Button Skeleton - md:hidden */}
                <div className="md:hidden">
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>

            {/* Content Section Skeleton - Conditional based on viewMode */}
            {viewMode === "card" ? (
                <Card className="border-2 shadow-lg">
                    <CardHeader className="pb-4 border-b bg-muted/20">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl font-bold tracking-tight">
                                    <Skeleton className="h-8 w-40" />
                                </CardTitle>
                                <CardDescription className="mt-1.5 text-base">
                                    <Skeleton className="h-5 w-32 mt-2" />
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-10 w-40" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                            {[...Array(8)].map((_, i) => (
                                <Card key={i} className="overflow-hidden p-0 group">
                                    <div className="relative w-full aspect-4/3 overflow-hidden">
                                        <Skeleton className="w-full h-full" />
                                        <div className="absolute top-2 right-2">
                                            <Skeleton className="h-5 w-16 rounded-full" />
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-3/4" />
                                    </CardHeader>
                                    <CardContent className="space-y-4 pb-4 -mt-4">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <div className="flex gap-2">
                                            <Skeleton className="h-9 flex-1 rounded-md" />
                                            <Skeleton className="h-9 flex-1 rounded-md" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-2 shadow-lg">
                    <CardHeader className="pb-4 border-b bg-muted/20">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl font-bold tracking-tight">
                                    <Skeleton className="h-8 w-40" />
                                </CardTitle>
                                <CardDescription className="mt-1.5 text-base">
                                    <Skeleton className="h-5 w-32 mt-2" />
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-10 w-40" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border-2 overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2">
                                            <TableHead className="font-bold text-sm h-12">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-4 w-4" />
                                                    <Skeleton className="h-4 w-20" />
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-bold text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-4 w-4" />
                                                    <Skeleton className="h-4 w-16" />
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-bold text-sm">
                                                <Skeleton className="h-4 w-16" />
                                            </TableHead>
                                            <TableHead className="font-bold text-sm">
                                                <Skeleton className="h-4 w-16" />
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
                                                    <Skeleton className="w-16 h-16 rounded-md border-2" />
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Skeleton className="h-4 w-32" />
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Skeleton className="h-4 w-24" />
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Skeleton className="h-5 w-16 rounded-full" />
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <Skeleton className="h-9 w-9 rounded-md" />
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
                    </CardContent>
                </Card>
            )}

            {/* Pagination Section Skeleton */}
            <div className="flex justify-center">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-24 rounded-md" />
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-10 rounded-md" />
                        ))}
                    </div>
                    <Skeleton className="h-10 w-24 rounded-md" />
                </div>
            </div>
        </section>
    );
}

