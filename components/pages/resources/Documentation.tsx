"use client"

import { Badge } from "@/components/ui/badge"

import { Search } from "lucide-react"

import { DocumentationNav } from "@/components/ui/documentation-nav"

import { useTranslation } from "@/hooks/useTranslation"

export default function DocumentationPage() {
    const { t } = useTranslation()

    const categories = [
        { id: "getting-started", label: t("documentationPage.categories.gettingStarted"), docs: 5 },
        { id: "api-reference", label: t("documentationPage.categories.apiReference"), docs: 12 },
        { id: "guides", label: t("documentationPage.categories.guides"), docs: 8 },
        { id: "best-practices", label: t("documentationPage.categories.bestPractices"), docs: 6 },
        { id: "troubleshooting", label: t("documentationPage.categories.troubleshooting"), docs: 4 },
    ]

    const docs = {
        "getting-started": [
            { id: 1, title: t("documentationPage.docs.installationTitle"), desc: t("documentationPage.docs.installationDesc") },
            { id: 2, title: t("documentationPage.docs.quickStartTitle"), desc: t("documentationPage.docs.quickStartDesc") },
            { id: 3, title: t("documentationPage.docs.authenticationTitle"), desc: t("documentationPage.docs.authenticationDesc") },
            { id: 4, title: t("documentationPage.docs.firstRequestTitle"), desc: t("documentationPage.docs.firstRequestDesc") },
            { id: 5, title: t("documentationPage.docs.environmentsTitle"), desc: t("documentationPage.docs.environmentsDesc") },
        ],
        "api-reference": [
            { id: 1, title: t("documentationPage.docs.productsTitle"), desc: t("documentationPage.docs.productsDesc") },
            { id: 2, title: t("documentationPage.docs.ordersTitle"), desc: t("documentationPage.docs.ordersDesc") },
            { id: 3, title: t("documentationPage.docs.usersTitle"), desc: t("documentationPage.docs.usersDesc") },
            { id: 4, title: t("documentationPage.docs.licensesTitle"), desc: t("documentationPage.docs.licensesDesc") },
            { id: 5, title: t("documentationPage.docs.analyticsTitle"), desc: t("documentationPage.docs.analyticsDesc") },
        ],
        guides: [
            { id: 1, title: t("documentationPage.docs.nextTitle"), desc: t("documentationPage.docs.nextDesc") },
            { id: 2, title: t("documentationPage.docs.reactTitle"), desc: t("documentationPage.docs.reactDesc") },
            { id: 3, title: t("documentationPage.docs.paymentTitle"), desc: t("documentationPage.docs.paymentDesc") },
            { id: 4, title: t("documentationPage.docs.webhookTitle"), desc: t("documentationPage.docs.webhookDesc") },
        ],
        "best-practices": [
            { id: 1, title: t("documentationPage.docs.securityTitle"), desc: t("documentationPage.docs.securityDesc") },
            { id: 2, title: t("documentationPage.docs.rateLimitTitle"), desc: t("documentationPage.docs.rateLimitDesc") },
            { id: 3, title: t("documentationPage.docs.errorHandlingTitle"), desc: t("documentationPage.docs.errorHandlingDesc") },
        ],
        troubleshooting: [
            { id: 1, title: t("documentationPage.docs.commonIssuesTitle"), desc: t("documentationPage.docs.commonIssuesDesc") },
            { id: 2, title: t("documentationPage.docs.supportTitle"), desc: t("documentationPage.docs.supportDesc") },
        ],
    }

    return (
        <div className="min-h-screen">

            {/* Hero Section */}
            <section className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge className="mb-4" variant="secondary">
                            {t("documentationPage.badge")}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {t("documentationPage.title")}
                        </h1>
                        <p className="text-lg text-muted-foreground text-balance">
                            {t("documentationPage.subtitle")}
                        </p>
                        <div className="mt-8 flex gap-2 bg-secondary border border-border rounded-lg px-4 py-2 max-w-md mx-auto">
                            <Search size={20} className="text-muted-foreground" />
                            <input
                                type="text"
                                placeholder={t("documentationPage.searchPlaceholder")}
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
