"use client"

import Link from "next/link"

import { usePathname } from "next/navigation"

import { Home, Phone, ShoppingCart, BriefcaseBusiness } from "lucide-react"

import { cn } from "@/lib/utils"

import { useIsMobile } from "@/hooks/use-mobile"

import { useCart } from "@/utils/context/CartContext"

const navigationItems = [
    {
        label: "Home",
        href: "/",
        icon: Home,
    },
    {
        label: "Products",
        href: "/products",
        icon: BriefcaseBusiness,
    },
    {
        label: "Cart",
        href: "/cart",
        icon: ShoppingCart,
    },
    {
        label: "Contact",
        href: "/contact",
        icon: Phone,
    },
]

export default function BottomNavigation() {
    const pathname = usePathname()
    const isMobile = useIsMobile()
    const { setCartSheetOpen, getTotalItems } = useCart()
    const cartItemCount = getTotalItems()

    if (!isMobile) {
        return null
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t lg:hidden rounded-t-2xl py-2">
            <div className="flex items-center justify-around px-2 pb-safe">
                {navigationItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname?.startsWith(item.href))
                    const Icon = item.icon
                    const isCart = item.href === "/cart"

                    if (isCart) {
                        return (
                            <button
                                key={item.href}
                                onClick={() => setCartSheetOpen(true)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 flex-1 h-full relative min-w-0",
                                    "transition-colors duration-200"
                                )}
                            >
                                {/* Icon Container */}
                                <div
                                    className={cn(
                                        "flex items-center justify-center w-10 h-10 rounded-lg transition-all relative",
                                        isActive
                                            ? "bg-blue-50 dark:bg-blue-950/20"
                                            : "bg-transparent"
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "w-5 h-5 transition-colors",
                                            isActive
                                                ? "text-blue-600 dark:text-blue-400"
                                                : "text-gray-400 dark:text-gray-500"
                                        )}
                                    />
                                    {isCart && cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-4.5 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                                            {cartItemCount > 99 ? "99+" : cartItemCount}
                                        </span>
                                    )}
                                </div>

                                {/* Label */}
                                <span
                                    className={cn(
                                        "text-xs font-medium transition-colors whitespace-nowrap",
                                        isActive
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-gray-400 dark:text-gray-500"
                                    )}
                                >
                                    {item.label}
                                </span>

                                {/* Active Indicator Line */}
                                {isActive && (
                                    <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-8 h-1 bg-primary dark:bg-primary rounded-full" />
                                )}
                            </button>
                        )
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 flex-1 h-full relative min-w-0",
                                "transition-colors duration-200"
                            )}
                        >
                            {/* Icon Container */}
                            <div
                                className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-lg transition-all",
                                    isActive
                                        ? "bg-blue-50 dark:bg-blue-950/20"
                                        : "bg-transparent"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "w-5 h-5 transition-colors",
                                        isActive
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-gray-400 dark:text-gray-500"
                                    )}
                                />
                            </div>

                            {/* Label */}
                            <span
                                className={cn(
                                    "text-xs font-medium transition-colors whitespace-nowrap",
                                    isActive
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-400 dark:text-gray-500"
                                )}
                            >
                                {item.label}
                            </span>

                            {/* Active Indicator Line */}
                            {isActive && (
                                <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-8 h-1 bg-primary dark:bg-primary rounded-full" />
                            )}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

