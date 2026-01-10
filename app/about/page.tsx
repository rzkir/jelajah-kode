import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            <section className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">About CodeMarket</h1>
                        <p className="text-lg text-muted-foreground">
                            Empowering developers with premium source code and resources
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 border-b border-border">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                        <p className="text-lg text-muted-foreground mb-4">
                            At CodeMarket, our mission is to democratize access to high-quality source code and development resources
                            for developers worldwide. We believe that great code should be accessible, affordable, and inspire
                            innovation.
                        </p>
                        <p className="text-lg text-muted-foreground">
                            We partner with talented developers and creators to bring the best templates, components, and solutions to
                            our community. Our platform makes it easy for developers to discover, purchase, and implement
                            production-ready code.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 border-b border-border">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-muted/50 rounded-lg p-6 border border-border">
                            <h3 className="text-xl font-semibold mb-3">Quality First</h3>
                            <p className="text-muted-foreground">
                                We are committed to providing only the highest quality source code and resources. Every product is
                                carefully reviewed and tested.
                            </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-6 border border-border">
                            <h3 className="text-xl font-semibold mb-3">Developer Focused</h3>
                            <p className="text-muted-foreground">
                                We build our platform with developers in mind. Our goal is to save you time and accelerate your
                                development process.
                            </p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-6 border border-border">
                            <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
                            <p className="text-muted-foreground">
                                We believe in the power of community. Our platform connects creators with developers who appreciate
                                their work.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        We&apos;d love to hear from you. Get in touch with our team to learn more about CodeMarket.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        Contact Us
                    </Link>
                </div>
            </section>
        </div>
    )
}
