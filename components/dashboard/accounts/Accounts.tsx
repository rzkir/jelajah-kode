"use client";

import { useAuth } from "@/utils/context/AuthContext";

import { useStateAccounts } from "@/components/dashboard/accounts/lib/useStateAccounts";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

import { Camera, Loader2, MessageCircle, MoreVertical, User, Lock } from "lucide-react";

import EditProfile from "@/components/dashboard/accounts/modal/EditProfile";

import ChangePassword from "@/components/dashboard/accounts/modal/ChangePassword";

import { Skeleton } from "@/components/ui/skeleton";

import useFormatDate from "@/hooks/FormatDate";

export default function AccountsLayout() {
    const { user, loading } = useAuth();
    const { formatDate, formatUpdatedAt } = useFormatDate();
    const {
        isUploading,
        uploadProgress,
        getTitle,
        fileInputRef,
        isEditProfileOpen,
        setIsEditProfileOpen,
        isChangePasswordOpen,
        setIsChangePasswordOpen,
        handleEditPicture,
        handleFileChange,
    } = useStateAccounts();

    if (loading) {
        return (
            <section>
                <div className="bg-card rounded-lg mb-6 p-6">
                    <div className="flex items-start gap-6">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-64" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </div>
                </div>
                <Card>
                    <CardContent>
                        <Skeleton className="h-6 w-48 mb-6" />
                        <div className="grid grid-cols-2 gap-6">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </section>
        );
    }

    if (!user) {
        return (
            <section className="container mx-auto p-6 max-w-5xl">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-gray-600">
                            Please log in to view your account information.
                        </p>
                    </CardContent>
                </Card>
            </section>
        );
    }

    return (
        <section>
            {/* Profile Header Section */}
            <div className="bg-card rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 flex-1">
                        {/* Avatar with message icon */}
                        <div className="relative">
                            <div className="relative group cursor-pointer" onClick={handleEditPicture}>
                                <Avatar className="h-24 w-24 border-2 border-gray-200">
                                    <AvatarImage
                                        src={user.picture || "/avatars/default.jpg"}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="text-2xl bg-gray-100">
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                {!isUploading && (
                                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Camera className="h-6 w-6 text-white" />
                                    </div>
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                            {/* Message icon overlay */}
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 border-2 border-white shadow-sm">
                                <MessageCircle className="h-3.5 w-3.5 text-white" />
                            </div>
                        </div>

                        {/* Name, Title, Email, and Bio */}
                        <div className="flex-1 space-y-6">
                            <h1 className="text-3xl font-bold mb-2 text-primary">{user.name}</h1>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-primary font-medium text-base">{getTitle()}</span>
                                <span className="text-gray-400 text-base">|</span>
                                <span className="text-primary font-medium text-base">{user.email}</span>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <Badge
                                    variant={user.emailVerified === true ? "default" : "secondary"}
                                >
                                    {user.emailVerified === true ? "Verified" : "Not Verified"}
                                </Badge>

                                <Badge
                                    variant={user.isVerified === "true" || user.isVerified === true ? "default" : "secondary"}
                                >
                                    {user.isVerified === "true" || user.isVerified === true ? "Verified" : "Not Verified"}
                                </Badge>
                            </div>

                            {isUploading && uploadProgress > 0 && (
                                <div className="mt-2 w-full max-w-xs bg-gray-200 rounded-full h-1.5">
                                    <div
                                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 shrink-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium">
                                    <MoreVertical className="h-4 w-4 mr-2" />
                                    Options
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsEditProfileOpen(true)}>
                                    <User className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsChangePasswordOpen(true)}>
                                    <Lock className="h-4 w-4 mr-2" />
                                    Change Password
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Personal Information Section */}
            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold mb-6">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm">Name</label>
                            <p className="text-base font-medium">{user.name}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm">Email address</label>
                            <p className="text-base font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm">Phone</label>
                            <p className="text-base font-medium">+14 1234 5678</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm">Title</label>
                            <p className="text-base font-medium">{getTitle()}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm">Bergabung</label>
                            <p className="text-base font-medium">{formatDate(user.created_at || new Date())}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm">Terakhir Update</label>
                            <p className="text-base font-medium">{formatUpdatedAt(user.updated_at || new Date())}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Profile Dialog */}
            <EditProfile
                open={isEditProfileOpen}
                onOpenChange={setIsEditProfileOpen}
            />

            {/* Change Password Dialog */}
            <ChangePassword
                open={isChangePasswordOpen}
                onOpenChange={setIsChangePasswordOpen}
            />
        </section>
    );
}
