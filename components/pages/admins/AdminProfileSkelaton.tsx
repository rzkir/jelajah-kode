"use client"

import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs"

export default function AdminProfileSkelaton() {
    return (
        <section className="container mx-auto px-4 py-8 space-y-8">
            {/* Back Button Skeleton */}
            <div className="inline-flex items-center gap-2">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-24" />
            </div>

            {/* Profile Card Skeleton */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Avatar Skeleton */}
                        <Skeleton className="w-24 h-24 rounded-full" />

                        {/* Profile Info Skeleton */}
                        <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <Skeleton className="h-9 w-48" />
                                <Skeleton className="h-6 w-28 rounded-full" />
                            </div>
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-full max-w-2xl" />
                            <Skeleton className="h-4 w-64" />
                            <div className="flex flex-wrap gap-4">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex gap-3">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Card key={index}>
                        <CardContent className="p-6 text-center space-y-2">
                            <Skeleton className="h-8 w-16 mx-auto" />
                            <Skeleton className="h-4 w-20 mx-auto" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabs Skeleton */}
            <Tabs value="products" onValueChange={() => { }}>
                <TabsList className="w-full md:w-auto">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-24" />
                </TabsList>

                <TabsContent value="products" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Card key={index}>
                                <CardContent className="p-6 space-y-4">
                                    <Skeleton className="h-48 w-full rounded-lg" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-5 w-20" />
                                        <Skeleton className="h-9 w-24" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </section>
    )
}
