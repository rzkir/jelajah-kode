"use client"

import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"

import { ScrollArea } from "@/components/ui/scroll-area"

import { cn } from "@/lib/utils"

interface BottomSheetsFilterProps {
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    selectedType: string
    setSelectedType: (type: string) => void
    handleApplyFilters: () => void
    categories: Array<{ value: string; label: string }>
    types: Array<{ value: string; label: string }>
}

export default function BottomSheetsFilter({
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    handleApplyFilters,
    categories,
    types,
}: BottomSheetsFilterProps) {
    return (
        <ScrollArea className="h-[calc(80vh-120px)] min-h-[400px]">
            <div className="flex flex-col gap-6 p-4">
                {/* Category Filter */}
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Kategori
                    </label>
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={() => setSelectedCategory("")}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-colors",
                                selectedCategory === ""
                                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400"
                                    : "bg-white dark:bg-[#1e1e1e] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#2d2d2d]"
                            )}
                        >
                            <span>Semua Kategori</span>
                            {selectedCategory === "" && (
                                <Check className="h-4 w-4" />
                            )}
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                type="button"
                                onClick={() => {
                                    setSelectedCategory(
                                        selectedCategory === category.value ? "" : category.value
                                    )
                                }}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-colors",
                                    selectedCategory === category.value
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400"
                                        : "bg-white dark:bg-[#1e1e1e] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#2d2d2d]"
                                )}
                            >
                                <span>{category.label}</span>
                                {selectedCategory === category.value && (
                                    <Check className="h-4 w-4" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Type Filter */}
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                        Tipe
                    </label>
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={() => setSelectedType("")}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-colors",
                                selectedType === ""
                                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400"
                                    : "bg-white dark:bg-[#1e1e1e] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#2d2d2d]"
                            )}
                        >
                            <span>Semua Tipe</span>
                            {selectedType === "" && (
                                <Check className="h-4 w-4" />
                            )}
                        </button>
                        {types.map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => {
                                    setSelectedType(
                                        selectedType === type.value ? "" : type.value
                                    )
                                }}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-colors",
                                    selectedType === type.value
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400"
                                        : "bg-white dark:bg-[#1e1e1e] border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-[#2d2d2d]"
                                )}
                            >
                                <span>{type.label}</span>
                                {selectedType === type.value && (
                                    <Check className="h-4 w-4" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Apply Button */}
                <Button
                    type="button"
                    onClick={handleApplyFilters}
                    className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm"
                >
                    Terapkan
                </Button>
            </div>
        </ScrollArea>
    )
}

