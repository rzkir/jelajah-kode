import { ChevronRight } from "lucide-react"

export default function TermsOfServicePage() {
    const sections = [
        { id: "agreement", title: "Agreement to Terms" },
        { id: "use-license", title: "Use License" },
        { id: "disclaimer", title: "Disclaimer" },
        { id: "limitations", title: "Limitations of Liability" },
        { id: "accuracy", title: "Accuracy of Materials" },
        { id: "materials", title: "Materials and Content" },
        { id: "links", title: "Links" },
        { id: "modifications", title: "Modifications" },
        { id: "governing-law", title: "Governing Law" },
    ]

    return (
        <div className="min-h-screen">

            <section className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                        <p className="text-lg text-muted-foreground">Last updated: January 2026</p>
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
                    <section id="agreement">
                        <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
                        <p className="text-muted-foreground">
                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this
                            agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section id="use-license">
                        <h2 className="text-2xl font-bold mb-4">Use License</h2>
                        <p className="text-muted-foreground mb-4">
                            Permission is granted to temporarily download one copy of the materials (information or software) on
                            Jelajah Kode website for personal, non-commercial transitory viewing only. This is the grant of a
                            license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Modifying or copying the materials</li>
                            <li>Using the materials for any commercial purpose or for any public display</li>
                            <li>Attempting to decompile or reverse engineer any software contained on CodeMarket</li>
                            <li>Transferring the materials to another person or &quot;mirroring&quot; the materials on any other server</li>
                            <li>Removing any copyright or other proprietary notations from the materials</li>
                        </ul>
                    </section>

                    <section id="disclaimer">
                        <h2 className="text-2xl font-bold mb-4">Disclaimer</h2>
                        <p className="text-muted-foreground">
                            The materials on Jelajah Kode website are provided on an &apos;as is&apos; basis. CodeMarket makes no
                            warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without
                            limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
                            non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section id="limitations">
                        <h2 className="text-2xl font-bold mb-4">Limitations of Liability</h2>
                        <p className="text-muted-foreground">
                            In no event shall CodeMarket or its suppliers be liable for any damages (including, without limitation,
                            damages for loss of data or profit, or due to business interruption) arising out of the use or inability
                            to use the materials on Jelajah Kode website.
                        </p>
                    </section>

                    <section id="accuracy">
                        <h2 className="text-2xl font-bold mb-4">Accuracy of Materials</h2>
                        <p className="text-muted-foreground">
                            The materials appearing on Jelajah Kode website could include technical, typographical, or
                            photographic errors. CodeMarket does not warrant that any of the materials on its website are accurate,
                            complete, or current. CodeMarket may make changes to the materials contained on its website at any time
                            without notice.
                        </p>
                    </section>

                    <section id="materials">
                        <h2 className="text-2xl font-bold mb-4">Materials and Content</h2>
                        <p className="text-muted-foreground">
                            The materials on Jelajah Kode website are copyrighted. CodeMarket owns the copyright to all original
                            materials, text, images, graphics, logos, button icons, and software on this website. Unauthorized use of
                            any material is strictly prohibited.
                        </p>
                    </section>

                    <section id="links">
                        <h2 className="text-2xl font-bold mb-4">Links</h2>
                        <p className="text-muted-foreground">
                            CodeMarket has not reviewed all of the sites linked to its website and is not responsible for the contents
                            of any such linked site. The inclusion of any link does not imply endorsement by CodeMarket of the site.
                            Use of any such linked website is at the user&apos;s own risk.
                        </p>
                    </section>

                    <section id="modifications">
                        <h2 className="text-2xl font-bold mb-4">Modifications</h2>
                        <p className="text-muted-foreground">
                            CodeMarket may revise these terms of service for its website at any time without notice. By using this
                            website, you are agreeing to be bound by the then current version of these terms of service.
                        </p>
                    </section>

                    <section id="governing-law">
                        <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
                        <p className="text-muted-foreground">
                            These terms and conditions are governed by and construed in accordance with the laws of the United States,
                            and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
