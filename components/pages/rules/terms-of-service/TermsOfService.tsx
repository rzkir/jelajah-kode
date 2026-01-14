"use client"

import { ChevronRight } from "lucide-react"

import { useTranslation } from "@/hooks/useTranslation"

export default function TermsOfServicePage() {
    const { t } = useTranslation()

    const sections = [
        { id: "agreement", title: t("rules.terms.sections.agreement") },
        { id: "use-license", title: t("rules.terms.sections.useLicense") },
        { id: "disclaimer", title: t("rules.terms.sections.disclaimer") },
        { id: "limitations", title: t("rules.terms.sections.limitations") },
        { id: "accuracy", title: t("rules.terms.sections.accuracy") },
        { id: "materials", title: t("rules.terms.sections.materials") },
        { id: "links", title: t("rules.terms.sections.links") },
        { id: "modifications", title: t("rules.terms.sections.modifications") },
        { id: "governing-law", title: t("rules.terms.sections.governingLaw") },
    ]

    return (
        <div className="min-h-screen">

            <section className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {t("rules.terms.title")}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {t("rules.terms.lastUpdated")}
                        </p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 container mx-auto px-4 py-12">
                <aside className="lg:col-span-1">
                    <div className="sticky top-24 bg-muted/50 rounded-lg p-6 border border-border">
                        <h3 className="font-semibold text-foreground mb-4">
                            {t("rules.terms.contents")}
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
                    <section id="agreement">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.terms.sections.agreement")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.terms.agreementText")}
                        </p>
                    </section>

                    <section id="use-license">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.terms.sections.useLicense")}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {t("rules.terms.useLicenseIntro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>{t("rules.terms.useLicenseList.item1")}</li>
                            <li>{t("rules.terms.useLicenseList.item2")}</li>
                            <li>{t("rules.terms.useLicenseList.item3")}</li>
                            <li>{t("rules.terms.useLicenseList.item4")}</li>
                            <li>{t("rules.terms.useLicenseList.item5")}</li>
                        </ul>
                    </section>

                    <section id="disclaimer">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.terms.sections.disclaimer")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.terms.disclaimerText")}
                        </p>
                    </section>

                    <section id="limitations">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.terms.sections.limitations")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.terms.limitationsText")}
                        </p>
                    </section>

                    <section id="accuracy">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.terms.sections.accuracy")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.terms.accuracyText")}
                        </p>
                    </section>

                    <section id="materials">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.terms.sections.materials")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.terms.materialsText")}
                        </p>
                    </section>

                    <section id="links">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.terms.sections.links")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.terms.linksText")}
                        </p>
                    </section>

                    <section id="modifications">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.terms.sections.modifications")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.terms.modificationsText")}
                        </p>
                    </section>

                    <section id="governing-law">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.terms.sections.governingLaw")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.terms.governingLawText")}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
