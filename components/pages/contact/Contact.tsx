import { Mail, Phone, MapPin, MessageSquare } from "lucide-react"

import Link from "next/link"

export default function ContactPage() {
    const contactMethods = [
        {
            icon: Mail,
            title: "Email",
            description: "Send us an email anytime",
            value: process.env.NEXT_PUBLIC_GMAIL,
            href: `mailto:${process.env.NEXT_PUBLIC_GMAIL}`,
        },
        {
            icon: Phone,
            title: "Phone",
            description: "Call us during business hours",
            value: "+62 858-1166-8557",
            href: "https://wa.me/+6285811668557",
        },
        {
            icon: MapPin,
            title: "Location",
            description: "Visit our office",
            value: "Jl. Babakan, Leuwiliang, Kec. Leuwiliang, Kabupaten Bogor, Jawa Barat 16640",
            href: "https://maps.app.goo.gl/WZfaswMkJMqw9nTG6",
        },
    ]

    return (
        <section className="min-h-full py-10">
            <div className="border-b border-border bg-muted/30 mb-10">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-lg text-muted-foreground">
                            Have questions or feedback? We&apos;d love to hear from you.
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Contact Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                    {contactMethods.map((method, index) => {
                        const Icon = method.icon
                        return (
                            <Link
                                key={index}
                                href={method.href}
                                className="group p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1">{method.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                                        <p className="text-foreground font-medium">{method.value}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* Additional Info Section */}
                <div className="bg-muted/30 rounded-lg p-8 border border-border">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                            <MessageSquare className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-xl mb-3">Prefer to reach out directly?</h3>
                            <p className="text-muted-foreground mb-4">
                                Feel free to contact us through any of the methods above. We typically respond within 24 hours during business days.
                            </p>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <p>• Email us at <Link href={`mailto:${process.env.NEXT_PUBLIC_GMAIL}`} className="text-primary hover:underline">{process.env.NEXT_PUBLIC_GMAIL}</Link></p>
                                <p>• Call us at <Link href={"https://wa.me/+6285811668557"} className="text-primary hover:underline">+62 858-1166-8557</Link></p>
                                <p>• Visit our office in Jl. Babakan, Leuwiliang, Kec. Leuwiliang, Kabupaten Bogor, Jawa Barat 16640</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
