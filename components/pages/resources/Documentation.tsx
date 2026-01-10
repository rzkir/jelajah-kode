"use client"

import { Badge } from "@/components/ui/badge"

import { Search } from "lucide-react"

import { DocumentationNav } from "@/components/ui/documentation-nav"

export default function DocumentationPage() {
    const categories = [
        { id: "getting-started", label: "Getting Started", docs: 5 },
        { id: "api-reference", label: "API Reference", docs: 12 },
        { id: "guides", label: "Guides & Tutorials", docs: 8 },
        { id: "best-practices", label: "Best Practices", docs: 6 },
        { id: "troubleshooting", label: "Troubleshooting", docs: 4 },
    ]

    const docs = {
        "getting-started": [
            { id: 1, title: "Installation", desc: "How to install and set up CodeMarket SDK" },
            { id: 2, title: "Quick Start", desc: "Get up and running in 5 minutes" },
            { id: 3, title: "Authentication", desc: "Set up API keys and authentication" },
            { id: 4, title: "Your First Request", desc: "Make your first API call" },
            { id: 5, title: "Environments", desc: "Development, staging, and production" },
        ],
        "api-reference": [
            { id: 1, title: "Products Endpoint", desc: "Browse and search products" },
            { id: 2, title: "Orders Endpoint", desc: "Manage customer orders" },
            { id: 3, title: "Users Endpoint", desc: "User profile and management" },
            { id: 4, title: "Licenses Endpoint", desc: "License key management" },
            { id: 5, title: "Analytics Endpoint", desc: "Get sales and usage analytics" },
        ],
        guides: [
            { id: 1, title: "Building with Next.js", desc: "Integrate CodeMarket with Next.js" },
            { id: 2, title: "React Integration", desc: "Use CodeMarket in React apps" },
            { id: 3, title: "Payment Integration", desc: "Integrate Midtrans payments" },
            { id: 4, title: "Webhook Setup", desc: "Listen to CodeMarket events" },
        ],
        "best-practices": [
            { id: 1, title: "Security", desc: "Keep your API keys secure" },
            { id: 2, title: "Rate Limiting", desc: "Understand API rate limits" },
            { id: 3, title: "Error Handling", desc: "Proper error handling patterns" },
        ],
        troubleshooting: [
            { id: 1, title: "Common Issues", desc: "Solutions to common problems" },
            { id: 2, title: "Support", desc: "Get help from our team" },
        ],
    }

    return (
        <div className="min-h-screen">

            {/* Hero Section */}
            <section className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4" variant="secondary">
                            Documentation
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Developer Documentation</h1>
                        <p className="text-lg text-muted-foreground text-balance">
                            Everything you need to integrate CodeMarket into your application.
                        </p>
                        <div className="mt-8 flex gap-2 bg-secondary border border-border rounded-lg px-4 py-2 max-w-md mx-auto">
                            <Search size={20} className="text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search documentation..."
                                className="flex-1 bg-transparent outline-none text-foreground"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <DocumentationNav categories={categories} docs={docs} />
        </div>
    )
}
