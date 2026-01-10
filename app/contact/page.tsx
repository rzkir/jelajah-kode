"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => {
            setFormData({ name: "", email: "", subject: "", message: "" })
            setSubmitted(false)
        }, 3000)
    }

    return (
        <div className="min-h-screen">
            <section className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-lg text-muted-foreground mb-2">
                            Have questions or feedback? We&apos;d love to hear from you.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Information */}
                        <div className="lg:col-span-1 space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold">Email</h3>
                                </div>
                                <p className="text-muted-foreground">support@codemarket.com</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Phone className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold">Phone</h3>
                                </div>
                                <p className="text-muted-foreground">+1 (555) 123-4567</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold">Location</h3>
                                </div>
                                <p className="text-muted-foreground">San Francisco, CA 94105</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Name</label>
                                        <Input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email</label>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Subject</label>
                                    <Input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="What is this about?"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Your message..."
                                        rows={6}
                                        className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>
                                <Button type="submit" size="lg" className="w-full md:w-auto">
                                    Send Message
                                </Button>
                                {submitted && (
                                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md text-green-700 dark:text-green-400">
                                        Thank you for your message! We&apos;ll get back to you soon.
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
