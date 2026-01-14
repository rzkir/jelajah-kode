"use client"

import Link from "next/link"

import { Fragment } from "react"

import { CodeXml, ShoppingCart } from "lucide-react"

import { ThemeToggle } from "@/components/ui/theme-toggle"

import { cn } from "@/lib/utils"

import NavMain from "@/components/layout/NavMain"

import ProfileMenu from "@/components/layout/ProfileMenu"

import { useCart } from "@/utils/context/CartContext"

import { useTranslation } from "@/hooks/useTranslation"

export default function Header() {
  const { getTotalItems, setCartSheetOpen } = useCart();
  const cartItemCount = getTotalItems();
  const { t } = useTranslation();

  const navigationLinks = [
    { label: t("header.exploreProducts"), href: "/products" }
  ]

  return (
    <Fragment>
      <NavMain />

      <header className="sticky top-0 z-50 w-full bg-background">
        {/* Main container */}
        <div className="px-4 container mx-auto">
          <nav className="flex items-center justify-between gap-4 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="relative">
                <CodeXml className="size-6 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                JelajahKode
              </span>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Navigation Links - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium text-gray-700 dark:text-gray-300",
                      "hover:text-gray-900 dark:hover:text-white",
                      "transition-colors duration-200"
                    )}
                  >
                    <span suppressHydrationWarning>{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Cart Icon */}
              <button
                onClick={() => setCartSheetOpen(true)}
                className="hidden sm:flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                aria-label={t("common.shoppingCart")}
              >
                <ShoppingCart className="size-5 text-gray-700 dark:text-gray-300" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Profile Menu */}
              <ProfileMenu />
            </div>
          </nav>
        </div>
      </header>
    </Fragment>
  )
}
