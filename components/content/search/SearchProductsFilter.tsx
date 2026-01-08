"use client"

import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Progress } from "@/components/ui/progress"

import { Label } from "@/components/ui/label"

import { useSearchProductsFilter } from "@/components/content/search/lib/useStateSearch"

export default function SearchProductsFilter({
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategories,
    selectedTypes,
    setSelectedTypes,
    selectedTechStack,
    setSelectedTechStack,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    popularOnly,
    setPopularOnly,
    newArrivals,
    setNewArrivals,
    products,
    categories: categoriesData,
    types: typesData,
}: SearchProductsFilterProps) {
    const {
        categories,
        types,
        techStackOptions,
        toggleCategory,
        toggleType,
        toggleTechStack,
    } = useSearchProductsFilter(
        categoriesData,
        typesData,
        products,
        selectedCategories,
        setSelectedCategories,
        selectedTypes,
        setSelectedTypes,
        selectedTechStack,
        setSelectedTechStack
    )

    return (
        <div className="w-full lg:w-80 space-y-6">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>

            {/* Search Input */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <input
                    type="text"
                    placeholder="Q Search code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Categories</label>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label
                            key={category.value}
                            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category.value)}
                                onChange={() => toggleCategory(category.value)}
                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{category.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Price Range</label>
                <div className="space-y-3">
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer accent-blue-600 slider-thumb"
                    />
                    <Progress value={(priceRange[1] / 200) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Rp {priceRange[0].toLocaleString('id-ID')}</span>
                        <span>Rp {priceRange[1].toLocaleString('id-ID')}</span>
                    </div>
                </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Tech Stack</label>
                <div className="flex flex-wrap gap-2">
                    {techStackOptions.map((tech) => (
                        <button
                            key={tech}
                            type="button"
                            onClick={() => toggleTechStack(tech)}
                            className={cn(
                                "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                                selectedTechStack.includes(tech)
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-blue-500"
                            )}
                        >
                            {tech}
                        </button>
                    ))}
                </div>
            </div>

            {/* Type */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Type</label>
                <div className="space-y-2">
                    {types.map((type) => (
                        <label
                            key={type.value}
                            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(type.value)}
                                onChange={() => toggleType(type.value)}
                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{type.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Minimum Rating</label>
                <RadioGroup
                    value={minRating?.toString() || ""}
                    onValueChange={(value) => setMinRating(value ? parseInt(value) : null)}
                >
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                            <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                            <Label
                                htmlFor={`rating-${rating}`}
                                className="flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{rating} star{rating > 1 ? "s" : ""} & up</span>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            {/* Additional Filters */}
            <div className="space-y-3">
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
                        <input
                            type="checkbox"
                            checked={popularOnly}
                            onChange={(e) => setPopularOnly(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">Popular only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
                        <input
                            type="checkbox"
                            checked={newArrivals}
                            onChange={(e) => setNewArrivals(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">New Arrivals</span>
                    </label>
                </div>
            </div>
        </div>
    )
}

