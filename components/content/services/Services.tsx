"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import SpotlightCard from '@/components/ui/SpotlightCard'

import { useTranslation } from "@/hooks/useTranslation"

export default function Services() {
    const { t } = useTranslation();

    const services = [
        {
            icon: "🔒",
            title: t("services.secureReliable.title"),
            description: t("services.secureReliable.description")
        },
        {
            icon: "⚡",
            title: t("services.performanceOptimized.title"),
            description: t("services.performanceOptimized.description")
        },
        {
            icon: "🎯",
            title: t("services.smartCodeReview.title"),
            description: t("services.smartCodeReview.description")
        },
        {
            icon: "📚",
            title: t("services.documentation.title"),
            description: t("services.documentation.description")
        }
    ]
    return (
        <section className="min-h-full overflow-visible bg-background relative py-10">
            {/* Background Pattern */}
            <div className="container mx-auto px-4 xl:px-6">
                <div className="absolute inset-0 opacity-30 dark:opacity-20">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
              `,
                            backgroundSize: '40px 40px',
                        }}
                    />
                    <div
                        className="absolute inset-0 dark:hidden"
                        style={{
                            backgroundImage: `
                radial-gradient(circle, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
              `,
                            backgroundSize: '20px 20px',
                        }}
                    />
                    <div
                        className="absolute inset-0 hidden dark:block"
                        style={{
                            backgroundImage: `
                radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
              `,
                            backgroundSize: '20px 20px',
                        }}
                    />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {services.map((service, idx) => (
                            <SpotlightCard key={idx} className="hover:shadow-lg transition-shadow duration-300 border-gray-200/50 dark:border-gray-800/50">
                                <Card>
                                    <CardHeader>
                                        <div className="text-4xl mb-2">{service.icon}</div>
                                        <CardTitle className="text-xl" suppressHydrationWarning>{service.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base leading-relaxed" suppressHydrationWarning>
                                            {service.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
