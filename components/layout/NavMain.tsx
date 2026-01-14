"use client"

import Link from 'next/link'

import { Mail, Phone, FileText } from 'lucide-react'

import { useLanguage } from '@/utils/context/LanguageContext'

import { cn } from '@/lib/utils'

export default function NavMain() {
    const { language, setLanguage, t } = useLanguage();

    return (
        <div className="w-full bg-background">
            <div className="px-4 container mx-auto">
                <div className="flex items-center justify-between h-10 text-xs">
                    {/* Left side - Contact Info */}
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link
                            href="/contact"
                            className="hidden sm:flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <Phone className="size-3.5" />
                            <span className="hidden sm:inline" suppressHydrationWarning>{t("nav.contactUs")}</span>
                        </Link>

                        <Link
                            href={`mailto:${process.env.NEXT_PUBLIC_GMAIL}`}
                            className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <Mail className="size-3.5" />
                            <span className="inline">{process.env.NEXT_PUBLIC_GMAIL}</span>
                        </Link>
                        <Link
                            href="/articles"
                            className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <FileText className="size-3.5" />
                            <span suppressHydrationWarning>{t("nav.articles")}</span>
                        </Link>
                    </div>

                    {/* Right side - Language Selector */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            onClick={() => setLanguage("id")}
                            className={cn(
                                "flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                                language === "id" && "text-blue-600 dark:text-blue-400 font-medium"
                            )}
                            aria-label="Switch to Indonesian"
                        >
                            <span className="text-base">🇮🇩</span>
                            <span className="hidden sm:inline" suppressHydrationWarning>{t("nav.indonesia")}</span>
                        </button>
                        <span className="text-gray-400">|</span>
                        <button
                            onClick={() => setLanguage("en")}
                            className={cn(
                                "flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                                language === "en" && "text-blue-600 dark:text-blue-400 font-medium"
                            )}
                            aria-label="Switch to English"
                        >
                            <span className="text-base">🇺🇸</span>
                            <span className="hidden sm:inline" suppressHydrationWarning>{t("nav.english")}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
