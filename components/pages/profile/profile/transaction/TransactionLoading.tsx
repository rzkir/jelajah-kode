import { Skeleton } from "@/components/ui/skeleton"

export default function TransactionLoading() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="p-4 border border-border rounded-lg"
                >
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-3 w-40" />
                        </div>
                        <div className="text-right">
                            <Skeleton className="h-6 w-24 mb-1" />
                            <Skeleton className="h-3 w-16 ml-auto" />
                        </div>
                    </div>

                    {/* Optional Button Section */}
                    <div className="mt-3 pt-3 border-t border-border">
                        <Skeleton className="h-9 w-full rounded-md" />
                    </div>

                    {/* Products List Section */}
                    <div className="space-y-2 mt-3 pt-3 border-t border-border">
                        {Array.from({ length: 2 }).map((_, productIndex) => (
                            <div
                                key={productIndex}
                                className="relative flex items-center gap-3"
                            >
                                <Skeleton className="w-16 h-16 shrink-0 rounded" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                <Skeleton className="h-4 w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
