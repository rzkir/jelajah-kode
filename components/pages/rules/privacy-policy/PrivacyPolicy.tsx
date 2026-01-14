"use client"

import Link from "next/link"

import { ChevronRight } from "lucide-react"

const EMAIL_ADMIN = process.env.NEXT_PUBLIC_GMAIL as string

import { useTranslation } from "@/hooks/useTranslation"

export default function PrivacyPolicyPage() {
    const { t } = useTranslation()

    const sections = [
        { id: "introduction", title: t("rules.privacy.sections.introduction") },
        { id: "data-collection", title: t("rules.privacy.sections.dataCollection") },
        { id: "data-usage", title: t("rules.privacy.sections.dataUsage") },
        { id: "data-protection", title: t("rules.privacy.sections.dataProtection") },
        { id: "cookies", title: t("rules.privacy.sections.cookies") },
        { id: "third-party", title: t("rules.privacy.sections.thirdParty") },
        { id: "user-rights", title: t("rules.privacy.sections.userRights") },
        { id: "contact", title: t("rules.privacy.sections.contact") },
    ]

    return (
        <div className="min-h-screen">
            <section className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {t("rules.privacy.title")}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {t("rules.privacy.lastUpdated")}
                        </p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 container mx-auto px-4 py-12">
                {/* Sidebar TOC */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-24 bg-muted/50 rounded-lg p-6 border border-border">
                        <h3 className="font-semibold text-foreground mb-4">
                            {t("rules.privacy.contents")}
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

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-12">
                    <section id="introduction">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.privacy.sections.introduction")}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {t("rules.privacy.introductionText")}
                        </p>
                    </section>

                    <section id="data-collection">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.privacy.sections.dataCollection")}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {t("rules.privacy.dataCollectionIntro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>{t("rules.privacy.dataCollectionList.item1")}</li>
                            <li>{t("rules.privacy.dataCollectionList.item2")}</li>
                            <li>{t("rules.privacy.dataCollectionList.item3")}</li>
                            <li>{t("rules.privacy.dataCollectionList.item4")}</li>
                            <li>{t("rules.privacy.dataCollectionList.item5")}</li>
                        </ul>
                    </section>

                    <section id="data-usage">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.privacy.sections.dataUsage")}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {t("rules.privacy.dataUsageIntro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>{t("rules.privacy.dataUsageList.item1")}</li>
                            <li>{t("rules.privacy.dataUsageList.item2")}</li>
                            <li>{t("rules.privacy.dataUsageList.item3")}</li>
                            <li>{t("rules.privacy.dataUsageList.item4")}</li>
                            <li>{t("rules.privacy.dataUsageList.item5")}</li>
                        </ul>
                    </section>

                    <section id="data-protection">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.privacy.sections.dataProtection")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.privacy.dataProtectionText")}
                        </p>
                    </section>

                    <section id="cookies">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.privacy.sections.cookies")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.privacy.cookiesText")}
                        </p>
                    </section>

                    <section id="third-party">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.privacy.sections.thirdParty")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.privacy.thirdPartyText")}
                        </p>
                    </section>

                    <section id="user-rights">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.privacy.sections.userRights")}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {t("rules.privacy.userRightsText")}
                        </p>
                    </section>

                    <section id="contact">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.privacy.sections.contact")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.privacy.contactText")}{" "}
                            <Link href={`mailto:${EMAIL_ADMIN}`} className="text-primary hover:underline">
                                {EMAIL_ADMIN}
                            </Link>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
