import { ChevronRight } from "lucide-react"

export default function LicenseAgreementPage() {
    const sections = [
        { id: "grant", title: "License Grant" },
        { id: "restrictions", title: "Restrictions" },
        { id: "ownership", title: "Intellectual Property Rights" },
        { id: "usage", title: "Permitted Usage" },
        { id: "prohibited", title: "Prohibited Activities" },
        { id: "termination", title: "Termination" },
        { id: "warranty", title: "Warranty Disclaimer" },
        { id: "liability", title: "Limitation of Liability" },
    ]

    return (
        <div className="min-h-screen">

            <section className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">License Agreement</h1>
                        <p className="text-lg text-muted-foreground">Last updated: January 2024</p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 container mx-auto px-4 py-12">
                <aside className="lg:col-span-1">
                    <div className="sticky top-24 bg-muted/50 rounded-lg p-6 border border-border">
                        <h3 className="font-semibold text-foreground mb-4">Contents</h3>
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
                        <h2 className="text-2xl font-bold mb-4">License Grant</h2>
                        <p className="text-muted-foreground">
                            CodeMarket grants you a limited, non-exclusive, non-transferable license to use the purchased source code
                            for your personal or commercial project. This license does not grant you the right to sell, redistribute,
                            or sublicense the source code.
                        </p>
                    </section>

                    <section id="restrictions">
                        <h2 className="text-2xl font-bold mb-4">Restrictions</h2>
                        <p className="text-muted-foreground mb-4">You may not:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Resell or redistribute the source code without prior written permission</li>
                            <li>Remove copyright or license notices from the source code</li>
                            <li>Use the source code to create competing products</li>
                            <li>Reverse engineer or decompile the source code</li>
                            <li>Transfer the license to another person or entity</li>
                        </ul>
                    </section>

                    <section id="ownership">
                        <h2 className="text-2xl font-bold mb-4">Intellectual Property Rights</h2>
                        <p className="text-muted-foreground">
                            All intellectual property rights to the source code, including but not limited to copyrights, patents, and
                            trademarks, are retained by the original creator or CodeMarket. You acknowledge that no title to the
                            intellectual property in the source code is transferred to you.
                        </p>
                    </section>

                    <section id="usage">
                        <h2 className="text-2xl font-bold mb-4">Permitted Usage</h2>
                        <p className="text-muted-foreground mb-4">You are permitted to:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Use the source code in your personal projects</li>
                            <li>Use the source code in your commercial applications</li>
                            <li>Modify the source code for your specific needs</li>
                            <li>Make copies for backup purposes</li>
                        </ul>
                    </section>

                    <section id="prohibited">
                        <h2 className="text-2xl font-bold mb-4">Prohibited Activities</h2>
                        <p className="text-muted-foreground">
                            You agree not to engage in any activity that violates this License Agreement or any applicable law or
                            regulation. This includes but is not limited to selling, licensing, or distributing the source code
                            without authorization.
                        </p>
                    </section>

                    <section id="termination">
                        <h2 className="text-2xl font-bold mb-4">Termination</h2>
                        <p className="text-muted-foreground">
                            CodeMarket reserves the right to terminate this license if you violate any terms of this agreement. Upon
                            termination, you must delete all copies of the source code in your possession.
                        </p>
                    </section>

                    <section id="warranty">
                        <h2 className="text-2xl font-bold mb-4">Warranty Disclaimer</h2>
                        <p className="text-muted-foreground">
                            The source code is provided &quot;as-is&quot; without warranty of any kind, express or implied. CodeMarket
                            does not warrant that the source code will be error-free or that it will function without interruption.
                        </p>
                    </section>

                    <section id="liability">
                        <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
                        <p className="text-muted-foreground">
                            In no event shall CodeMarket be liable for any indirect, incidental, special, consequential, or punitive
                            damages resulting from your use of or inability to use the source code, even if CodeMarket has been
                            advised of the possibility of such damages.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
