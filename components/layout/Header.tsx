"use client"

import Link from "next/link"

import { usePathname } from "next/navigation"

import { Fragment, useState } from "react"

import { LogOut, User, Settings, LayoutDashboard, Menu, CodeXml, Search, ShoppingCart } from "lucide-react"

import { ThemeToggle } from "@/components/ui/theme-toggle"

import { cn } from "@/lib/utils"

import { useAuth } from "@/utils/context/AuthContext"

import { useIsMobile } from "@/hooks/use-mobile"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import BottomSheet from "@/helper/bottomsheets/BottomShets"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import NavMain from "@/components/layout/NavMain"

const navigationLinks = [
  { label: "Explore Products", href: "/products" }
]

export default function Header() {
  const { user, loading, signOut, userRole } = useAuth()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

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
                CodeMarket
              </span>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center gap-6">
              {/* Navigation Links - Hidden on mobile */}
              <div className="hidden lg:flex items-center gap-6">
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
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Cart Icon */}
              <Link
                href="/cart"
                className="hidden sm:flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="size-5 text-gray-700 dark:text-gray-300" />
              </Link>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Hamburger Menu - Only visible on mobile */}
              {isMobile && (
                <BottomSheet
                  open={mobileMenuOpen}
                  onOpenChange={setMobileMenuOpen}
                  side="bottom"
                  responsive={false}
                  title="Menu"
                  trigger={
                    <button
                      className="flex items-center justify-center size-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Open menu"
                    >
                      <Menu className="size-5 text-gray-700 dark:text-gray-300" />
                    </button>
                  }
                  className="px-0"
                  contentClassName="max-h-[80vh] rounded-t-2xl"
                >
                  <nav className="flex flex-col gap-2 px-4 pb-4">
                    {/* Mobile Search */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search templates, components, scripts..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    {navigationLinks.map((link) => {
                      const isActive = pathname === link.href ||
                        (link.href !== "/" && pathname?.startsWith(link.href))
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                            isActive
                              ? "bg-blue-600 text-white dark:bg-blue-500"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </nav>
                </BottomSheet>
              )}

              {loading ? (
                // Loading state
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="size-4 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
                </div>
              ) : user ? (
                // Authenticated user menu with dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <Avatar className="size-8">
                        <AvatarImage src={user.picture} alt={user.name} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5">
                        <Avatar className="size-8">
                          <AvatarImage src={user.picture} alt={user.name} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{user.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href="/profile"
                          className="w-full flex items-center gap-2"
                        >
                          <User className="size-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {userRole === "admins" && (
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link
                            href="/dashboard"
                            className="w-full flex items-center gap-2"
                          >
                            <LayoutDashboard className="size-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          href="/settings"
                          className="w-full flex items-center gap-2"
                        >
                          <Settings className="size-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20"
                    >
                      <LogOut className="size-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Not authenticated - show Sign In button
                <Link
                  href="/signin"
                  className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>
    </Fragment>
  )
}
