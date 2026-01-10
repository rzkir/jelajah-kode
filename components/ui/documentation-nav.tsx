"use client"

import { useState } from "react"

interface Category {
    id: string
    label: string
    docs: number
}

interface Doc {
    id: number
    title: string
    desc: string
}

interface DocumentationNavProps {
    categories: Category[]
    docs: Record<string, Doc[]>
}

export function DocumentationNav({ categories, docs }: DocumentationNavProps) {
    const [selectedCategory, setSelectedCategory] = useState("getting-started")

    const currentDocs = docs[selectedCategory as keyof typeof docs] || []

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="sticky top-20">
                            <h3 className="font-semibold mb-4 text-foreground">Documentation</h3>
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === cat.id
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {cat.label}
                                        <span className="text-xs ml-2">({cat.docs})</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3">
                        <h2 className="text-3xl font-bold mb-8 capitalize">
                            {categories.find((c) => c.id === selectedCategory)?.label}
                        </h2>
                        <div className="space-y-4">
                            {currentDocs.map((doc) => (
                                <a
                                    key={doc.id}
                                    href="#"
                                    className="block bg-muted/30 rounded-lg p-6 border border-border hover:border-primary/50 transition-colors group"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                                {doc.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm">{doc.desc}</p>
                                        </div>
                                        <svg
                                            className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
