"use client"

import Link from "next/link"

import { useTranslation } from "@/hooks/useTranslation"

export default function About() {
    const { t } = useTranslation()

    return (
        <div className="min-h-screen">
            <section className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {t("aboutPage.title")}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {t("aboutPage.subtitle")}
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 border-b border-border">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-bold mb-6">
                            {t("aboutPage.missionTitle")}
                        </h2>
                        <p className="text-lg text-muted-foreground mb-4">
                            {t("aboutPage.missionP1")}
                        </p>
                        <p className="text-lg text-muted-foreground">
                            {t("aboutPage.missionP2")}
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 border-b border-border">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12">
                        {t("aboutPage.valuesTitle")}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-muted/50 rounded-lg p-6 border border-border">
                            <h3 className="text-xl font-semibold mb-3">
                                {t("aboutPage.valueQualityTitle")}
                            </h3>
                            <p className="text-muted-foreground">
                                {t("aboutPage.valueQualityDesc")}
                            </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-6 border border-border">
                            <h3 className="text-xl font-semibold mb-3">
                                {t("aboutPage.valueDeveloperTitle")}
                            </h3>
                            <p className="text-muted-foreground">
                                {t("aboutPage.valueDeveloperDesc")}
                            </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-6 border border-border">
                            <h3 className="text-xl font-semibold mb-3">
                                {t("aboutPage.valueCommunityTitle")}
                            </h3>
                            <p className="text-muted-foreground">
                                {t("aboutPage.valueCommunityDesc")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        {t("aboutPage.ctaTitle")}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        {t("aboutPage.ctaSubtitle")}
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        {t("aboutPage.ctaButton")}
                    </Link>
                </div>
            </section>
        </div>
    )
}
