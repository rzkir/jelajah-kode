import Link from "next/link"

import { ChevronRight } from "lucide-react"

const EMAIL_ADMIN = process.env.NEXT_PUBLIC_GMAIL as string

export default function PrivacyPolicyPage() {
    const sections = [
        { id: "introduction", title: "Introduction" },
        { id: "data-collection", title: "Data Collection" },
        { id: "data-usage", title: "Data Usage" },
        { id: "data-protection", title: "Data Protection" },
        { id: "cookies", title: "Cookies" },
        { id: "third-party", title: "Third-Party Services" },
        { id: "user-rights", title: "Your Rights" },
        { id: "contact", title: "Contact Us" },
    ]

    return (
        <div className="min-h-screen">
            <section className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-lg text-muted-foreground">Last updated: January 2026</p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 container mx-auto px-4 py-12">
                {/* Sidebar TOC */}
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

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-12">
                    <section id="introduction">
                        <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                        <p className="text-muted-foreground mb-4">
                            Jelajah Kode (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the Jelajah Kode website. This page
                            informs you of our policies regarding the collection, use, and disclosure of personal data when you use
                            our Service and the choices you have associated with that data.
                        </p>
                    </section>

                    <section id="data-collection">
                        <h2 className="text-2xl font-bold mb-4">Data Collection</h2>
                        <p className="text-muted-foreground mb-4">
                            We collect several different types of information for various purposes to provide and improve our Service
                            to you.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Email address and account credentials</li>
                            <li>Payment and billing information</li>
                            <li>Profile information</li>
                            <li>Usage data and analytics</li>
                            <li>Device and browser information</li>
                        </ul>
                    </section>

                    <section id="data-usage">
                        <h2 className="text-2xl font-bold mb-4">Data Usage</h2>
                        <p className="text-muted-foreground mb-4">Jelajah Kode uses the collected data for various purposes:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>To provide and maintain our Service</li>
                            <li>To notify you about changes to our Service</li>
                            <li>To provide customer support</li>
                            <li>To monitor and analyze usage patterns</li>
                            <li>To detect, prevent, and address technical issues</li>
                        </ul>
                    </section>

                    <section id="data-protection">
                        <h2 className="text-2xl font-bold mb-4">Data Protection</h2>
                        <p className="text-muted-foreground">
                            The security of your data is important to us, but remember that no method of transmission over the
                            Internet is 100% secure. We strive to use commercially acceptable means to protect your Personal Data, but
                            we cannot guarantee its absolute security.
                        </p>
                    </section>

                    <section id="cookies">
                        <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                        <p className="text-muted-foreground">
                            We use cookies and similar tracking technologies to track activity on our Service and hold certain
                            information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being
                            sent.
                        </p>
                    </section>

                    <section id="third-party">
                        <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
                        <p className="text-muted-foreground">
                            Our Service may contain links to other sites that are not operated by us. We have no control over and
                            assume no responsibility for the content, privacy policies, or practices of any third-party sites or
                            services.
                        </p>
                    </section>

                    <section id="user-rights">
                        <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                        <p className="text-muted-foreground mb-4">
                            You have the right to access, update, or delete your personal information at any time by logging into your
                            account or contacting us. We will respond to your request within 30 days.
                        </p>
                    </section>

                    <section id="contact">
                        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                        <p className="text-muted-foreground">
                            If you have any questions about this Privacy Policy, please contact us at{" "}
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
