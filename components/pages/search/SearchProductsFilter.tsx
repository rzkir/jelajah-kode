"use client"

import { Star, ChevronDown, ChevronUp, PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Label } from "@/components/ui/label"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

import { useSearchProductsFilter } from "@/components/pages/search/lib/useStateSearch"

import { formatIDR } from "@/hooks/FormatPrice"

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
    isCategoriesOpen,
    setIsCategoriesOpen,
    isTypeOpen,
    setIsTypeOpen,
    isRatingsOpen,
    setIsRatingsOpen,
    isTechStackOpen,
    setIsTechStackOpen,
    isFilterOpen,
    setIsFilterOpen,
    typeSelectMode = "multiple",
    categorySelectMode = "multiple",
    disabledCategories = false,
    disabledTypes = false,
}: SearchProductsFilterProps & {
    typeSelectMode?: "single" | "multiple";
    categorySelectMode?: "single" | "multiple";
    isFilterOpen?: boolean;
    setIsFilterOpen?: (open: boolean) => void;
    disabledCategories?: boolean;
    disabledTypes?: boolean;
}) {
    const {
        categories,
        types,
        techStackOptions,
        toggleCategory,
        toggleType,
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
            <div className="hidden lg:flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                {setIsFilterOpen && isFilterOpen && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="size-7"
                    >
                        <PanelLeft className="h-4 w-4" />
                        <span className="sr-only">Toggle Filters</span>
                    </Button>
                )}
            </div>

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
            <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
                <div className="space-y-3">
                    <CollapsibleTrigger className="flex items-center justify-between w-full" disabled={disabledCategories}>
                        <Label className={cn("text-sm font-medium", disabledCategories ? "cursor-not-allowed opacity-50" : "cursor-pointer")}>Categories</Label>
                        {isCategoriesOpen ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        {categorySelectMode === "single" ? (
                            <RadioGroup
                                value={selectedCategories[0] || "all"}
                                onValueChange={(value) => {
                                    if (disabledCategories) return;
                                    if (value === "all") {
                                        setSelectedCategories([]);
                                    } else if (value) {
                                        setSelectedCategories([value]);
                                    } else {
                                        setSelectedCategories([]);
                                    }
                                }}
                                disabled={disabledCategories}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="all" id="category-all" disabled={disabledCategories} />
                                        <Label
                                            htmlFor="category-all"
                                            className={cn("flex items-center gap-2", disabledCategories ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400")}
                                        >
                                            <span className="text-sm">All Categories</span>
                                        </Label>
                                    </div>
                                    {categories.map((category) => (
                                        <div key={category.value} className="flex items-center gap-2">
                                            <RadioGroupItem value={category.value} id={`category-${category.value}`} disabled={disabledCategories} />
                                            <Label
                                                htmlFor={`category-${category.value}`}
                                                className={cn("flex items-center gap-2", disabledCategories ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400")}
                                            >
                                                <span className="text-sm">{category.label}</span>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                        ) : (
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <Label
                                        key={category.value}
                                        htmlFor={`category-${category.value}`}
                                        className={cn("flex items-center gap-2", disabledCategories ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400")}
                                    >
                                        <Input
                                            id={`category-${category.value}`}
                                            type="checkbox"
                                            checked={selectedCategories.includes(category.value)}
                                            onChange={() => !disabledCategories && toggleCategory(category.value)}
                                            disabled={disabledCategories}
                                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm">{category.label}</span>
                                    </Label>
                                ))}
                            </div>
                        )}
                    </CollapsibleContent>
                </div>
            </Collapsible>

            {/* Price Range */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="grid grid-cols-2 gap-3">
                    {/* Min Price Input */}
                    <div className="space-y-2">
                        <Label htmlFor="min-price" className="text-xs text-gray-500 dark:text-gray-400">
                            Min Price
                        </Label>
                        <Input
                            id="min-price"
                            type="text"
                            value={formatIDR(priceRange[0])}
                            onChange={(e) => {
                                const value = e.target.value;

                                // If empty, set to 0
                                if (value === "" || value === ".") {
                                    setPriceRange([0, priceRange[1]]);
                                    return;
                                }

                                // Remove all non-digit characters
                                const cleaned = value.replace(/[^\d]/g, "");

                                // Parse to number
                                const numericValue = cleaned === "" ? 0 : Number(cleaned);

                                // Validate and update
                                if (numericValue <= priceRange[1] && numericValue >= 0 && numericValue <= 200000) {
                                    setPriceRange([numericValue, priceRange[1]]);
                                }
                            }}
                            placeholder="Min price"
                            inputMode="numeric"
                            className="w-full"
                        />
                    </div>
                    {/* Max Price Input */}
                    <div className="space-y-2">
                        <Label htmlFor="max-price" className="text-xs text-gray-500 dark:text-gray-400">
                            Max Price
                        </Label>
                        <Input
                            id="max-price"
                            type="text"
                            value={formatIDR(priceRange[1])}
                            onChange={(e) => {
                                const value = e.target.value;

                                // If empty, set to 200000
                                if (value === "" || value === ".") {
                                    setPriceRange([priceRange[0], 200000]);
                                    return;
                                }

                                // Remove all non-digit characters
                                const cleaned = value.replace(/[^\d]/g, "");

                                // Parse to number
                                const numericValue = cleaned === "" ? 200000 : Number(cleaned);

                                // Validate and update
                                if (numericValue >= priceRange[0] && numericValue >= 0 && numericValue <= 200000) {
                                    setPriceRange([priceRange[0], numericValue]);
                                }
                            }}
                            placeholder="Max price"
                            inputMode="numeric"
                            className="w-full"
                        />
                    </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Range: Rp {formatIDR(priceRange[0])} - Rp {formatIDR(priceRange[1])}
                </div>
            </div>

            {/* Tech Stack */}
            <Collapsible open={isTechStackOpen} onOpenChange={setIsTechStackOpen}>
                <div className="space-y-3">
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                        <Label className="text-sm font-medium cursor-pointer">Tech Stack</Label>
                        {isTechStackOpen ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <RadioGroup
                            value={selectedTechStack[0] || "all"}
                            onValueChange={(value) => {
                                if (value === "all") {
                                    setSelectedTechStack([]);
                                } else if (value) {
                                    setSelectedTechStack([value]);
                                } else {
                                    setSelectedTechStack([]);
                                }
                            }}
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="all" id="tech-all" />
                                    <Label
                                        htmlFor="tech-all"
                                        className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        <span className="text-sm">All Tech Stack</span>
                                    </Label>
                                </div>
                                {techStackOptions.map((tech) => (
                                    <div key={tech} className="flex items-center gap-2">
                                        <RadioGroupItem value={tech} id={`tech-${tech}`} />
                                        <Label
                                            htmlFor={`tech-${tech}`}
                                            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            <span className="text-sm">{tech}</span>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </CollapsibleContent>
                </div>
            </Collapsible>

            {/* Type */}
            <Collapsible open={isTypeOpen} onOpenChange={setIsTypeOpen}>
                <div className="space-y-3">
                    <CollapsibleTrigger className="flex items-center justify-between w-full" disabled={disabledTypes}>
                        <Label className={cn("text-sm font-medium", disabledTypes ? "cursor-not-allowed opacity-50" : "cursor-pointer")}>Type</Label>
                        {isTypeOpen ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        {typeSelectMode === "single" ? (
                            <RadioGroup
                                value={selectedTypes[0] || "all"}
                                onValueChange={(value) => {
                                    if (disabledTypes) return;
                                    if (value === "all") {
                                        setSelectedTypes([]);
                                    } else if (value) {
                                        setSelectedTypes([value]);
                                    } else {
                                        setSelectedTypes([]);
                                    }
                                }}
                                disabled={disabledTypes}
                            >
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value="all" id="type-all" disabled={disabledTypes} />
                                        <Label
                                            htmlFor="type-all"
                                            className={cn("flex items-center gap-2", disabledTypes ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400")}
                                        >
                                            <span className="text-sm">All Types</span>
                                        </Label>
                                    </div>
                                    {types.map((type) => (
                                        <div key={type.value} className="flex items-center gap-2">
                                            <RadioGroupItem value={type.value} id={`type-${type.value}`} disabled={disabledTypes} />
                                            <Label
                                                htmlFor={`type-${type.value}`}
                                                className={cn("flex items-center gap-2", disabledTypes ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400")}
                                            >
                                                <span className="text-sm">{type.label}</span>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>
                        ) : (
                            <div className="space-y-2">
                                {types.map((type) => (
                                    <Label
                                        key={type.value}
                                        htmlFor={`type-${type.value}`}
                                        className={cn("flex items-center gap-2", disabledTypes ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400")}
                                    >
                                        <Input
                                            id={`type-${type.value}`}
                                            type="checkbox"
                                            checked={selectedTypes.includes(type.value)}
                                            onChange={() => !disabledTypes && toggleType(type.value)}
                                            disabled={disabledTypes}
                                            className="w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm">{type.label}</span>
                                    </Label>
                                ))}
                            </div>
                        )}
                    </CollapsibleContent>
                </div>
            </Collapsible>

            {/* Minimum Rating */}
            <Collapsible open={isRatingsOpen} onOpenChange={setIsRatingsOpen}>
                <div className="space-y-3">
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                        <Label className="text-sm font-medium cursor-pointer">Minimum Rating</Label>
                        {isRatingsOpen ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
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
                    </CollapsibleContent>
                </div>
            </Collapsible>

            {/* Additional Filters */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Additional Filters</Label>
                <RadioGroup
                    value={
                        popularOnly ? "popular" :
                            newArrivals ? "new" :
                                "all"
                    }
                    onValueChange={(value) => {
                        if (value === "popular") {
                            setPopularOnly(true);
                            setNewArrivals(false);
                        } else if (value === "new") {
                            setPopularOnly(false);
                            setNewArrivals(true);
                        } else {
                            setPopularOnly(false);
                            setNewArrivals(false);
                        }
                    }}
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="all" id="additional-all" />
                            <Label
                                htmlFor="additional-all"
                                className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                <span className="text-sm">All</span>
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="popular" id="popular-only" />
                            <Label
                                htmlFor="popular-only"
                                className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                <span className="text-sm">Popular only</span>
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="new" id="new-arrivals" />
                            <Label
                                htmlFor="new-arrivals"
                                className="flex items-center gap-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                            >
                                <span className="text-sm">New Arrivals</span>
                            </Label>
                        </div>
                    </div>
                </RadioGroup>
            </div>
        </div>
    )
}