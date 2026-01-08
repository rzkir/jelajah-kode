"use client"

import Link from "next/link"

import { LogOut, User, LayoutDashboard } from "lucide-react"

import { useAuth } from "@/utils/context/AuthContext"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfileMenu() {
    const { user, loading, signOut, userRole } = useAuth()

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="size-4 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin" />
            </div>
        )
    }

    if (!user) {
        return (
            <Link
                href="/signin"
                className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
                Sign In
            </Link>
        )
    }

    return (
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
                    {
                        userRole === "user" && (
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link
                                    href="/profile"
                                    className="w-full flex items-center gap-2"
                                >
                                    <User className="size-4" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                        )
                    }
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
    )
}

