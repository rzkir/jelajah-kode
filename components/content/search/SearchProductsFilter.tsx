"use client"

import { Star } from "lucide-react"

import { cn } from "@/lib/utils"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Progress } from "@/components/ui/progress"

import { Label } from "@/components/ui/label"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

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
            <h2 className="text-xl font-semibold mb-6 hidden lg:block">Filters</h2>

            {/* Search Input */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Search</Label>
                <Input
                    type="text"
                    placeholder="Q Search code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Categories</Label>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <Label
                            key={category.value}
                            htmlFor={`category-${category.value}`}
                            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <Input
                                id={`category-${category.value}`}
                                type="checkbox"
                                checked={selectedCategories.includes(category.value)}
                                onChange={() => toggleCategory(category.value)}
                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{category.label}</span>
                        </Label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="space-y-3">
                    <Input
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-transparent rounded-lg border-0 appearance-none cursor-pointer accent-blue-600 slider-thumb"
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
                <Label className="text-sm font-medium">Tech Stack</Label>
                <div className="flex flex-wrap gap-2">
                    {techStackOptions.map((tech) => (
                        <Button
                            key={tech}
                            type="button"
                            variant={selectedTechStack.includes(tech) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleTechStack(tech)}
                            className={cn(
                                selectedTechStack.includes(tech)
                                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                                    : ""
                            )}
                        >
                            {tech}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Type */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Type</Label>
                <div className="space-y-2">
                    {types.map((type) => (
                        <Label
                            key={type.value}
                            htmlFor={`type-${type.value}`}
                            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <Input
                                id={`type-${type.value}`}
                                type="checkbox"
                                checked={selectedTypes.includes(type.value)}
                                onChange={() => toggleType(type.value)}
                                className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">{type.label}</span>
                        </Label>
                    ))}
                </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Minimum Rating</Label>
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
                    <Label
                        htmlFor="popular-only"
                        className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        <Input
                            id="popular-only"
                            type="checkbox"
                            checked={popularOnly}
                            onChange={(e) => setPopularOnly(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">Popular only</span>
                    </Label>
                    <Label
                        htmlFor="new-arrivals"
                        className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        <Input
                            id="new-arrivals"
                            type="checkbox"
                            checked={newArrivals}
                            onChange={(e) => setNewArrivals(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">New Arrivals</span>
                    </Label>
                </div>
            </div>
        </div>
    )
}