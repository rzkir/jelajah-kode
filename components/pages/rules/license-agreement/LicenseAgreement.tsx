"use client"

import { ChevronRight } from "lucide-react"

import { useTranslation } from "@/hooks/useTranslation"

export default function LicenseAgreementPage() {
    const { t } = useTranslation()

    const sections = [
        { id: "grant", title: t("rules.license.sections.grant") },
        { id: "restrictions", title: t("rules.license.sections.restrictions") },
        { id: "ownership", title: t("rules.license.sections.ownership") },
        { id: "usage", title: t("rules.license.sections.usage") },
        { id: "prohibited", title: t("rules.license.sections.prohibited") },
        { id: "termination", title: t("rules.license.sections.termination") },
        { id: "warranty", title: t("rules.license.sections.warranty") },
        { id: "liability", title: t("rules.license.sections.liability") },
    ]

    return (
        <div className="min-h-screen">

            <section className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {t("rules.license.title")}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {t("rules.license.lastUpdated")}
                        </p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 container mx-auto px-4 py-12">
                <aside className="lg:col-span-1">
                    <div className="sticky top-24 bg-muted/50 rounded-lg p-6 border border-border">
                        <h3 className="font-semibold text-foreground mb-4">
                            {t("rules.license.contents")}
                        </h3>
                        <nav className="space-y-2">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ChevronRight size={16} />
                                    {section.title}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                <div className="lg:col-span-3 space-y-12">
                    <section id="grant">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.license.sections.grant")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.license.grantText")}
                        </p>
                    </section>

                    <section id="restrictions">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.license.sections.restrictions")}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {t("rules.license.restrictionsIntro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>{t("rules.license.restrictionsList.item1")}</li>
                            <li>{t("rules.license.restrictionsList.item2")}</li>
                            <li>{t("rules.license.restrictionsList.item3")}</li>
                            <li>{t("rules.license.restrictionsList.item4")}</li>
                            <li>{t("rules.license.restrictionsList.item5")}</li>
                        </ul>
                    </section>

                    <section id="ownership">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.license.sections.ownership")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.license.ownershipText")}
                        </p>
                    </section>

                    <section id="usage">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.license.sections.usage")}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {t("rules.license.usageIntro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>{t("rules.license.usageList.item1")}</li>
                            <li>{t("rules.license.usageList.item2")}</li>
                            <li>{t("rules.license.usageList.item3")}</li>
                            <li>{t("rules.license.usageList.item4")}</li>
                        </ul>
                    </section>

                    <section id="prohibited">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.license.sections.prohibited")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.license.prohibitedText")}
                        </p>
                    </section>

                    <section id="termination">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.license.sections.termination")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.license.terminationText")}
                        </p>
                    </section>

                    <section id="warranty">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.license.sections.warranty")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.license.warrantyText")}
                        </p>
                    </section>

                    <section id="liability">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.license.sections.liability")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.license.liabilityText")}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
