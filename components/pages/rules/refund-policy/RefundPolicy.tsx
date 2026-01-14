"use client"

import Link from "next/link"

import { ChevronRight } from "lucide-react"

const EMAIL_ADMIN = process.env.NEXT_PUBLIC_GMAIL as string

import { useTranslation } from "@/hooks/useTranslation"

export default function RefundPolicyPage() {
    const { t } = useTranslation()

    const sections = [
        { id: "eligibility", title: t("rules.refund.sections.eligibility") },
        { id: "process", title: t("rules.refund.sections.process") },
        { id: "timeframe", title: t("rules.refund.sections.timeframe") },
        { id: "conditions", title: t("rules.refund.sections.conditions") },
        { id: "non-refundable", title: t("rules.refund.sections.nonRefundable") },
        { id: "disputes", title: t("rules.refund.sections.disputes") },
        { id: "contact", title: t("rules.refund.sections.contact") },
    ]

    return (
        <div className="min-h-screen">
            <section className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {t("rules.refund.title")}
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {t("rules.refund.lastUpdated")}
                        </p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 container mx-auto px-4 py-12">
                <aside className="lg:col-span-1">
                    <div className="sticky top-24 bg-muted/50 rounded-lg p-6 border border-border">
                        <h3 className="font-semibold text-foreground mb-4">
                            {t("rules.refund.contents")}
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
                    <section id="eligibility">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.refund.sections.eligibility")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.refund.eligibilityText")}
                        </p>
                    </section>

                    <section id="process">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.refund.sections.process")}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {t("rules.refund.processIntro")}
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>
                                {t("rules.refund.processList.item1")}{" "}
                                {EMAIL_ADMIN}
                            </li>
                            <li>{t("rules.refund.processList.item2")}</li>
                            <li>{t("rules.refund.processList.item3")}</li>
                            <li>{t("rules.refund.processList.item4")}</li>
                        </ol>
                    </section>

                    <section id="timeframe">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.refund.sections.timeframe")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.refund.timeframeText")}
                        </p>
                    </section>

                    <section id="conditions">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.refund.sections.conditions")}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {t("rules.refund.conditionsIntro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>{t("rules.refund.conditionsList.item1")}</li>
                            <li>{t("rules.refund.conditionsList.item2")}</li>
                            <li>{t("rules.refund.conditionsList.item3")}</li>
                            <li>{t("rules.refund.conditionsList.item4")}</li>
                        </ul>
                    </section>

                    <section id="non-refundable">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.refund.sections.nonRefundable")}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            {t("rules.refund.nonRefundableIntro")}
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>{t("rules.refund.nonRefundableList.item1")}</li>
                            <li>{t("rules.refund.nonRefundableList.item2")}</li>
                            <li>{t("rules.refund.nonRefundableList.item3")}</li>
                            <li>{t("rules.refund.nonRefundableList.item4")}</li>
                        </ul>
                    </section>

                    <section id="disputes">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.refund.sections.disputes")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.refund.disputesText")}
                        </p>
                    </section>

                    <section id="contact">
                        <h2 className="text-2xl font-bold mb-4">
                            {t("rules.refund.sections.contact")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("rules.refund.contactText")}{" "}
                            <Link href={`mailto:${EMAIL_ADMIN}`} className="text-primary hover:underline">
                                {EMAIL_ADMIN}
                            </Link>
                            . {t("rules.refund.contactExtra")}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
