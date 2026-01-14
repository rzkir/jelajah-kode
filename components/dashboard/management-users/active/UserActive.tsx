"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Search, Filter, UserCog } from "lucide-react";

import BottomSheet from "@/helper/bottomsheets/BottomShets";

import useStateUsers from "@/components/dashboard/management-users/user/lib/useStateUsers";

import { ManagementUserActiveSkelaton } from "@/components/dashboard/management-users/user/ManagementUserSkelaton";

export default function UserActive() {
    const {
        users,
        currentUsers,
        filteredUsers,
        isLoading,
        currentPage,
        setCurrentPage,
        totalPages,
        searchTerm,
        selectedRole,
        selectedVerified,
        isFilterSheetOpen,
        setIsFilterSheetOpen,
        handleSearchChange,
        handleRoleChange,
        handleVerifiedChange,
        formatDate,
    } = useStateUsers({ initialStatus: "active" });

    // Calculate statistics
    const totalUsers = users.length;
    const filteredUsersCount = filteredUsers.length;
    const hasActiveFilters =
        searchTerm !== "" ||
        selectedRole !== "all" ||
        selectedVerified !== "all";

    if (isLoading) {
        return (
            <ManagementUserActiveSkelaton />
        );
    }

    return (
        <section className="flex flex-col gap-6">
            {/* Table Section */}
            <Card className="border-2 shadow-lg">
                <CardHeader className="pb-4 border-b bg-muted/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">Active Users</CardTitle>
                            <CardDescription className="mt-1.5 text-base">
                                <span className="font-semibold text-foreground">{currentUsers.length}</span> user(s)
                                {hasActiveFilters && filteredUsersCount !== totalUsers && (
                                    <span className="text-muted-foreground"> of <span className="font-semibold">{totalUsers}</span> total</span>
                                )}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            {hasActiveFilters && (
                                <Badge variant="outline" className="w-fit gap-2 px-3 py-1.5">
                                    <Filter className="h-3.5 w-3.5" />
                                    Filters Active
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row justify-between items-center gap-3 flex-1 p-4 bg-muted/30 rounded-lg border mb-4">
                        <div className="relative w-full">
                            <Input
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full pl-9"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>

                        {/* Desktop Filters - Select Components */}
                        <div className="hidden md:flex items-center gap-3">
                            {/* Role Filter */}
                            <Select
                                value={selectedRole}
                                onValueChange={handleRoleChange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admins">Admin</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Verification Filter */}
                            <Select
                                value={selectedVerified}
                                onValueChange={handleVerifiedChange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Verification" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                    <SelectItem value="unverified">Unverified</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Mobile Filter - BottomSheet */}
                        <div className="md:hidden">
                            <BottomSheet
                                open={isFilterSheetOpen}
                                onOpenChange={setIsFilterSheetOpen}
                                trigger={
                                    <Button variant="outline" className="gap-2">
                                        <Filter className="w-4 h-4" />
                                        Filters
                                    </Button>
                                }
                                title="Filter Users"
                                description="Filter users by role and verification"
                                side="right"
                                contentClassName="w-full max-w-full"
                                className="space-y-6 px-4 pb-4"
                            >
                                {/* Role Filter */}
                                <div className="flex flex-col gap-3 mb-2">
                                    <label className="text-sm font-medium">Role</label>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant={selectedRole === "all" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleRoleChange("all")}
                                            className="h-9"
                                        >
                                            All Roles
                                        </Button>
                                        <Button
                                            variant={selectedRole === "user" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleRoleChange("user")}
                                            className="h-9"
                                        >
                                            User
                                        </Button>
                                        <Button
                                            variant={selectedRole === "admins" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleRoleChange("admins")}
                                            className="h-9"
                                        >
                                            Admin
                                        </Button>
                                    </div>
                                </div>

                                {/* Verification Filter */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium">Verification</label>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant={selectedVerified === "all" ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleVerifiedChange("all")}
                                            className="h-9"
                                        >
                                            All
                                        </Button>
                                        <Button
                                            variant={
                                                selectedVerified === "verified" ? "default" : "outline"
                                            }
                                            size="sm"
                                            onClick={() => handleVerifiedChange("verified")}
                                            className="h-9"
                                        >
                                            Verified
                                        </Button>
                                        <Button
                                            variant={
                                                selectedVerified === "unverified" ? "default" : "outline"
                                            }
                                            size="sm"
                                            onClick={() => handleVerifiedChange("unverified")}
                                            className="h-9"
                                        >
                                            Unverified
                                        </Button>
                                    </div>
                                </div>
                            </BottomSheet>
                        </div>
                    </div>

                    {currentUsers.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                <UserCog className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-foreground font-semibold text-lg mb-2">No active users found</p>
                            {hasActiveFilters ? (
                                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                    No active users match your current filters. Try adjusting your search criteria.
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {searchTerm
                                        ? `No active users match your search for "${searchTerm}".`
                                        : "No active users available."}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="rounded-lg border-2 overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2">
                                            <TableHead className="font-bold text-sm h-12">User</TableHead>
                                            <TableHead className="font-bold text-sm">Email</TableHead>
                                            <TableHead className="font-bold text-sm">Role</TableHead>
                                            <TableHead className="font-bold text-sm">Status</TableHead>
                                            <TableHead className="font-bold text-sm">Verified</TableHead>
                                            <TableHead className="font-bold text-sm">Created At</TableHead>
                                            <TableHead className="font-bold text-sm">Updated At</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentUsers.map((user) => (
                                            <TableRow
                                                key={user._id}
                                                className="border-b hover:bg-muted/30 transition-colors group"
                                            >
                                                <TableCell className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={
                                                                    user.picture ||
                                                                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                                                                }
                                                                alt={user.name}
                                                            />
                                                            <AvatarFallback>
                                                                {user.name
                                                                    .split(" ")
                                                                    .map((n) => n[0])
                                                                    .join("")
                                                                    .toUpperCase()
                                                                    .slice(0, 2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-sm">{user.name}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4">{user.email}</TableCell>
                                                <TableCell className="py-4">
                                                    <Badge
                                                        variant={user.role === "admins" ? "default" : "secondary"}
                                                        className="border font-semibold capitalize"
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge variant="default" className="border font-semibold capitalize">active</Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <Badge
                                                        variant={
                                                            user.isVerified === "true" || user.isVerified === true
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                        className="border font-semibold"
                                                    >
                                                        {user.isVerified === "true" || user.isVerified === true
                                                            ? "Verified"
                                                            : "Unverified"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {user.created_at
                                                        ? formatDate(user.created_at)
                                                        : "N/A"}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    {user.updated_at
                                                        ? formatDate(user.updated_at)
                                                        : "N/A"}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination Section */}
            {currentUsers.length > 0 && (
                <div className="flex justify-center">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>

                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                (page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        onClick={() => setCurrentPage(page)}
                                        className="w-10"
                                    >
                                        {page}
                                    </Button>
                                )
                            )}
                        </div>

                        <Button
                            variant="outline"
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </section>
    );
}
