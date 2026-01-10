"use client"

import type React from "react"

import Link from "next/link"
import { Mail, Github, Linkedin, Twitter } from "lucide-react"
import { useState } from "react"

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const footerSections = [
    {
      title: "Products",
      links: [
        { label: "Browse Products", href: "/products" },
        { label: "New Arrivals", href: "/products?new=true" },
        { label: "Most Popular", href: "/products?popular=true" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Articles", href: "/articles" },
        { label: "Documentation", href: "/articles?category=documentation" },
        { label: "Tutorials", href: "/articles?category=tutorials" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Articles", href: "/articles" },
        { label: "Careers", href: "#" },
        { label: "Press", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Service", href: "/terms-of-service" },
        { label: "License Agreement", href: "/license-agreement" },
        { label: "Refund Policy", href: "/refund-policy" },
      ],
    },
  ]

  return (
    <footer className="bg-background border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Get the latest source code releases and exclusive deals delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
            {subscribed && <p className="text-sm text-green-500 md:col-span-2">Thanks for subscribing!</p>}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">JelajahKode</h3>
            <p className="text-sm text-muted-foreground">
              Premium source code, templates, and components for developers.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="#"
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:support@codemarket.com"
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            &copy; 2026 - {new Date().getFullYear()} Jelajah Code. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
