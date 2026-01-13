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
import { Search, Filter, Trash2, Users, UserCheck, UserX, CheckCircle, UserCog } from "lucide-react";
import BottomSheet from "@/helper/bottomsheets/BottomShets";
import useStateUsers from "./lib/useStateUsers";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteModalUser from "./modal/DeleteModalUser";
import { useState } from "react";

export default function ManagementUser() {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<{
        _id: string;
        name: string;
        email: string;
    } | null>(null);

    const {
        users,
        currentUsers,
        filteredUsers,
        isLoading,
        isUpdating,
        isDeleting,
        currentPage,
        setCurrentPage,
        totalPages,
        searchTerm,
        selectedStatus,
        selectedRole,
        selectedVerified,
        isFilterSheetOpen,
        setIsFilterSheetOpen,
        handleSearchChange,
        handleStatusChange,
        handleRoleChange,
        handleVerifiedChange,
        updateUserStatus,
        deleteUser,
        formatDate,
    } = useStateUsers();

    // Calculate statistics
    const totalUsers = users.length;
    const filteredUsersCount = filteredUsers.length;
    const activeUsers = filteredUsers.filter((u) => u.status === "active").length;
    const inactiveUsers = filteredUsers.filter((u) => u.status === "inactive").length;
    const verifiedUsers = filteredUsers.filter(
        (u) => u.isVerified === "true" || u.isVerified === true
    ).length;
    const hasActiveFilters =
        searchTerm !== "" ||
        selectedStatus !== "all" ||
        selectedRole !== "all" ||
        selectedVerified !== "all";

    const handleDeleteClick = (user: { _id: string; name: string; email: string }) => {
        setSelectedUser(user);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedUser) return;

        try {
            await deleteUser(selectedUser._id);
            setDeleteModalOpen(false);
            setSelectedUser(null);
        } catch {
            // Error is already handled in deleteUser function
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setSelectedUser(null);
    };

    if (isLoading) {
        return (
            <section className="flex flex-col gap-6">
                {/* Summary Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="border-2 shadow-md">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 py-6 border rounded-2xl">
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-9 w-48" />
                        <Skeleton className="h-5 w-64" />
                    </div>
                </div>
                <div className="border rounded-2xl overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Verified</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-col gap-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-2 shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                <p className="text-2xl font-bold mt-1 text-primary">
                                    {filteredUsersCount}
                                </p>
                                {hasActiveFilters && filteredUsersCount !== totalUsers && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        All: {totalUsers}
                                    </p>
                                )}
                            </div>
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active</p>
                                <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                                    {activeUsers}
                                </p>
                                {hasActiveFilters && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {users.filter((u) => u.status === "active").length} total
                                    </p>
                                )}
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                                <p className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                                    {inactiveUsers}
                                </p>
                                {hasActiveFilters && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {users.filter((u) => u.status === "inactive").length} total
                                    </p>
                                )}
                            </div>
                            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <UserX className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-2 shadow-md">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                                <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                                    {verifiedUsers}
                                </p>
                                {hasActiveFilters && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {users.filter(
                                            (u) => u.isVerified === "true" || u.isVerified === true
                                        ).length}{" "}
                                        total
                                    </p>
                                )}
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-row justify-between items-center gap-3 flex-1 p-4 bg-muted/30 rounded-lg border">
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
                    {/* Status Filter */}
                    <Select
                        value={selectedStatus}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

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
                        description="Filter users by status, role, and verification"
                        side="right"
                        contentClassName="w-full max-w-full"
                        className="space-y-6 px-4 pb-4"
                    >
                        {/* Status Filter */}
                        <div className="flex flex-col gap-3 mb-2">
                            <label className="text-sm font-medium">Status</label>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={selectedStatus === "all" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleStatusChange("all")}
                                    className="h-9"
                                >
                                    All Status
                                </Button>
                                <Button
                                    variant={selectedStatus === "active" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleStatusChange("active")}
                                    className="h-9"
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={selectedStatus === "inactive" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleStatusChange("inactive")}
                                    className="h-9"
                                >
                                    Inactive
                                </Button>
                            </div>
                        </div>

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
                                    variant={selectedVerified === "verified" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleVerifiedChange("verified")}
                                    className="h-9"
                                >
                                    Verified
                                </Button>
                                <Button
                                    variant={selectedVerified === "unverified" ? "default" : "outline"}
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

            {/* Table Section */}
            <Card className="border-2 shadow-lg">
                <CardHeader className="pb-4 border-b bg-muted/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">All Users</CardTitle>
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
                    {currentUsers.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                <UserCog className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-foreground font-semibold text-lg mb-2">No users found</p>
                            {hasActiveFilters ? (
                                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                    No users match your current filters. Try adjusting your search criteria.
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {searchTerm
                                        ? `No users match your search for "${searchTerm}".`
                                        : "No users available."}
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
                                            <TableHead className="font-bold text-sm text-center">Actions</TableHead>
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
                                                    <Select
                                                        value={user.status}
                                                        onValueChange={(value: "active" | "inactive") =>
                                                            updateUserStatus(user._id, value)
                                                        }
                                                        disabled={isUpdating}
                                                    >
                                                        <SelectTrigger className="w-36">
                                                            <SelectValue>
                                                                <Badge
                                                                    variant={
                                                                        user.status === "active"
                                                                            ? "default"
                                                                            : "secondary"
                                                                    }
                                                                >
                                                                    {user.status}
                                                                </Badge>
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="active">
                                                                <Badge variant="default">Active</Badge>
                                                            </SelectItem>
                                                            <SelectItem value="inactive">
                                                                <Badge variant="secondary">Inactive</Badge>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
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
                                                    <div className="flex justify-center gap-2">
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDeleteClick({
                                                                    _id: user._id,
                                                                    name: user.name,
                                                                    email: user.email,
                                                                })
                                                            }
                                                            disabled={isDeleting || isUpdating}
                                                            className="gap-2"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </Button>
                                                    </div>
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

            {/* Delete Confirmation Modal */}
            <DeleteModalUser
                isOpen={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                userName={selectedUser?.name}
                userEmail={selectedUser?.email}
            />

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
