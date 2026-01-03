"use client"

import Filter from "@/components/content/filter/Filter"

export default function Page() {
    return (
        <section className="min-h-full overflow-visible relative py-14 md:py-36 px-4 md:px-0">
            <div className="container mx-auto">
                {/* Content */}
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
                    {/* Top Label */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 dark:bg-white/10 backdrop-blur-sm border border-gray-200/20 dark:border-white/20">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Smarter Code, Less Effort</span>
                        <span className="text-lg">📈</span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white">
                        Supercharge Your Codebase with an{' '}
                        <span className="bg-linear-to-r from-blue-400 to-purple-400 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                            AI Coding Agent
                        </span>
                    </h1>
                </div>

                <Filter />

                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-30 dark:opacity-20"
                    style={{
                        maskImage: 'radial-gradient(ellipse 80% 50% at center, transparent 30%, black 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at center, transparent 30%, black 70%)',
                    }}
                >
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
                    {/* Line Pattern */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.02) 10px, rgba(0, 0, 0, 0.02) 20px),
                repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.02) 10px, rgba(0, 0, 0, 0.02) 20px)
              `,
                        }}
                    />
                    <div
                        className="absolute inset-0 hidden dark:block"
                        style={{
                            backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.02) 10px, rgba(255, 255, 255, 0.02) 20px),
                repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255, 255, 255, 0.02) 10px, rgba(255, 255, 255, 0.02) 20px)
              `,
                        }}
                    />
                </div>
            </div>
        </section>
    )
}
