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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Trash2 } from "lucide-react";
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
        currentUsers,
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
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 py-6 border rounded-2xl">
                <div className="flex flex-col gap-3">
                    <h3 className="text-3xl font-bold">Management Users</h3>
                    <ol className="flex gap-2 items-center text-sm text-muted-foreground">
                        <li className="flex items-center hover:text-primary transition-colors">
                            <span>Dashboard</span>
                            <svg
                                className="w-4 h-4 mx-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </li>
                        <li className="flex items-center text-primary font-medium">
                            <span>Management Users</span>
                        </li>
                    </ol>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative">
                    <Input
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-64 pl-9"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>

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

            {/* Table Section */}
            <div className="border rounded-2xl border-border bg-card shadow-sm overflow-hidden">
                {currentUsers.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="mx-auto h-12 w-12 text-muted-foreground/50">
                            <svg
                                className="w-full h-full"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium">No users found</h3>
                        <p className="text-muted-foreground">
                            {searchTerm
                                ? `No users match your search for "${searchTerm}".`
                                : "No users available."}
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Verified</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentUsers.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>
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
                                                <span className="font-medium">{user.name}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.role === "admins" ? "default" : "secondary"}
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
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
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.isVerified === "true" || user.isVerified === true
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {user.isVerified === "true" || user.isVerified === true
                                                ? "Verified"
                                                : "Unverified"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.created_at
                                            ? formatDate(user.created_at)
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

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
