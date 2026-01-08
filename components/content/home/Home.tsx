"use client"

import Filter from "@/components/content/filter/Filter"

export default function Page() {
    return (
        <section className="min-h-full overflow-visible relative py-14 pt-20 md:pt-32 xl:pt-unset md:py-36">
            <div className="container mx-auto px-4">
                {/* Content */}
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                    {/* Top Label */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm border border-gray-200/20 dark:border-white/20">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">1000+ Premium Source Codes</span>
                        <span className="text-lg">📈</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white">
                        Find your{' '}
                        <span className="bg-linear-to-r from-blue-400 to-purple-400 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Perfect Template
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-gray-400">
                        Jumpstart your development process with production-ready source code, templates, and components from top developers.
                    </p>
                </div>

                <Filter />
            </div>
        </section>
    )
}
