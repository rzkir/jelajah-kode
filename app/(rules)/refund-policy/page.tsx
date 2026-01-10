import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function RefundPolicyPage() {
    const sections = [
        { id: "eligibility", title: "Refund Eligibility" },
        { id: "process", title: "Refund Process" },
        { id: "timeframe", title: "Timeframe" },
        { id: "conditions", title: "Refund Conditions" },
        { id: "non-refundable", title: "Non-Refundable Items" },
        { id: "disputes", title: "Dispute Resolution" },
        { id: "contact", title: "Contact Support" },
    ]

    return (
        <div className="min-h-screen">
            <section className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund Policy</h1>
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
                    <section id="eligibility">
                        <h2 className="text-2xl font-bold mb-4">Refund Eligibility</h2>
                        <p className="text-muted-foreground">
                            At CodeMarket, we want you to be satisfied with your purchase. If you are not completely satisfied with a
                            product, you may be eligible for a refund within 14 days of your purchase date.
                        </p>
                    </section>

                    <section id="process">
                        <h2 className="text-2xl font-bold mb-4">Refund Process</h2>
                        <p className="text-muted-foreground mb-4">To request a refund, please follow these steps:</p>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                            <li>Contact our support team at support@codemarket.com</li>
                            <li>Include your order number and reason for the refund request</li>
                            <li>Our team will review your request within 48 hours</li>
                            <li>If approved, the refund will be processed within 5-7 business days</li>
                        </ol>
                    </section>

                    <section id="timeframe">
                        <h2 className="text-2xl font-bold mb-4">Timeframe</h2>
                        <p className="text-muted-foreground">
                            Refund requests must be submitted within 14 days of the purchase date. Requests received after this period
                            may not be eligible for a refund. We process refunds within 5-7 business days from the approval date.
                        </p>
                    </section>

                    <section id="conditions">
                        <h2 className="text-2xl font-bold mb-4">Refund Conditions</h2>
                        <p className="text-muted-foreground mb-4">Your refund request may be approved if:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>The request is submitted within 14 days of purchase</li>
                            <li>The source code has not been significantly modified</li>
                            <li>You provide a valid reason for the refund request</li>
                            <li>This is your first refund request for this product</li>
                        </ul>
                    </section>

                    <section id="non-refundable">
                        <h2 className="text-2xl font-bold mb-4">Non-Refundable Items</h2>
                        <p className="text-muted-foreground mb-4">The following items are not eligible for refunds:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Digital products that have been downloaded and significantly used</li>
                            <li>Products purchased during special promotions (sale final)</li>
                            <li>Subscription services after the trial period ends</li>
                            <li>Custom development or consultation services</li>
                        </ul>
                    </section>

                    <section id="disputes">
                        <h2 className="text-2xl font-bold mb-4">Dispute Resolution</h2>
                        <p className="text-muted-foreground">
                            If you believe a refund was denied incorrectly, you can appeal the decision by contacting our dispute
                            resolution team. Please provide additional documentation or context regarding your case. We will review
                            your appeal within 10 business days.
                        </p>
                    </section>

                    <section id="contact">
                        <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
                        <p className="text-muted-foreground">
                            For questions about our refund policy, please contact us at{" "}
                            <Link href="mailto:support@codemarket.com" className="text-primary hover:underline">
                                support@codemarket.com
                            </Link>
                            . Our support team is available Monday to Friday, 9 AM to 5 PM EST.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
