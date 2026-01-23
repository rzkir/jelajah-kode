"use client"

import type React from "react"

import Link from "next/link"

import { Facebook, Github, Linkedin, Music2 } from "lucide-react"

import { useState } from "react"

import { emailSchema } from "@/hooks/validation"

import { useTranslation } from "@/hooks/useTranslation"

export function Footer() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError(t("footer.pleaseEnterEmail"))
      return
    }

    // Validate email format and Gmail requirement
    const emailValidation = emailSchema.safeParse(email)
    if (!emailValidation.success) {
      setError(emailValidation.error.issues[0]?.message || t("footer.emailMustBeGmail"))
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || t("footer.failedToSubscribe"))
        return
      }

      setSubscribed(true)
      setEmail("")
      setTimeout(() => {
        setSubscribed(false)
      }, 3000)
    } catch (err) {
      setError(t("footer.anErrorOccurred"))
      console.error("Subscription error:", err)
    } finally {
      setLoading(false)
    }
  }

  const footerSections = [
    {
      title: t("footer.products"),
      links: [
        { label: t("footer.browseProducts"), href: "/products" },
        { label: t("footer.newArrivals"), href: "/products?new=true" },
        { label: t("footer.mostPopular"), href: "/products?popular=true" },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { label: t("footer.documentation"), href: "/documentation" },
        { label: t("footer.tutorials"), href: "/articles?category=tutorials" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("footer.about"), href: "/about" },
        { label: t("footer.articles"), href: "/articles" },
        { label: t("footer.contactUs"), href: "/contact" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.privacyPolicy"), href: "/privacy-policy" },
        { label: t("footer.termsOfService"), href: "/terms-of-service" },
        { label: t("footer.licenseAgreement"), href: "/license-agreement" },
        { label: t("footer.refundPolicy"), href: "/refund-policy" },
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
              <h3 className="text-lg font-semibold text-foreground mb-2" suppressHydrationWarning>{t("footer.stayUpdated")}</h3>
              <p className="text-sm text-muted-foreground" suppressHydrationWarning>
                {t("footer.newsletterDescription")}
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t("footer.enterEmail")}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  className="flex-1 px-4 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "..." : t("footer.subscribe")}
                </button>
              </div>
              {subscribed && (
                <p className="text-sm text-green-500" suppressHydrationWarning>{t("footer.thanksForSubscribing")}</p>
              )}
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </form>
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
            <h3 className="text-lg font-bold text-foreground mb-2">Kodera</h3>
            <p className="text-sm text-muted-foreground" suppressHydrationWarning>
              {t("footer.tagline")}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <Link
              href={process.env.NEXT_PUBLIC_GITHUB_URL as string}
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </Link>
            <Link
              href={process.env.NEXT_PUBLIC_TIKTOK_URL as string}
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Music2 size={18} />
            </Link>
            <Link
              href="#"
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </Link>
            <Link
              href={process.env.NEXT_PUBLIC_FACEBOOK_URL as string}
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Facebook size={18} />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center" suppressHydrationWarning>
            &copy; 2026 - {new Date().getFullYear()} Kodera. {t("footer.allRightsReserved")}.
          </p>
        </div>
      </div>
    </footer>
  )
}
