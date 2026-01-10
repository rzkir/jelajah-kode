"use client"

import Link from 'next/link'

import { Mail, Phone, FileText } from 'lucide-react'

export default function NavMain() {
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
                            <span className="hidden sm:inline">Hubungi Kami</span>
                        </Link>

                        <Link
                            href="mailto:admin@jelajahkode.biz.id"
                            className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <Mail className="size-3.5" />
                            <span className="inline">admin@jelajahkode.biz.id</span>
                        </Link>
                        <Link
                            href="/articles"
                            className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <FileText className="size-3.5" />
                            <span>Articles</span>
                        </Link>
                    </div>

                    {/* Right side - Language Selector */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            aria-label="Switch to Indonesian"
                        >
                            <span className="text-base">🇮🇩</span>
                            <span className="hidden sm:inline">Indonesia</span>
                        </button>
                        <span className="text-gray-400">|</span>
                        <button
                            className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            aria-label="Switch to English"
                        >
                            <span className="text-base">🇺🇸</span>
                            <span className="hidden sm:inline">English</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
