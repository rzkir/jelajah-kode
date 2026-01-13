"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import useFormatDate from "@/hooks/FormatDate";
import { API_CONFIG } from "@/lib/config";

interface User {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admins";
  picture?: string;
  status: "active" | "inactive";
  isVerified: "true" | "false" | boolean;
  emailVerified?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface UseStateUsersOptions {
  initialStatus?: string;
  initialRole?: string;
  initialVerified?: string;
}

export default function useStateUsers(options?: UseStateUsersOptions) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>(
    options?.initialStatus || "all"
  );
  const [selectedRole, setSelectedRole] = useState<string>(
    options?.initialRole || "all"
  );
  const [selectedVerified, setSelectedVerified] = useState<string>(
    options?.initialVerified || "all"
  );
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 10;

  const { formatDate } = useFormatDate();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;

    const matchesRole = selectedRole === "all" || user.role === selectedRole;

    const matchesVerified =
      selectedVerified === "all" ||
      (selectedVerified === "verified" &&
        (user.isVerified === "true" || user.isVerified === true)) ||
      (selectedVerified === "unverified" &&
        (user.isVerified === "false" || user.isVerified === false));

    return matchesSearch && matchesStatus && matchesRole && matchesVerified;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const apiSecret = API_CONFIG.SECRET;
      const url = API_CONFIG.ENDPOINTS.users.base;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (apiSecret) {
        headers.Authorization = `Bearer ${apiSecret}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.data || data); // Handle both paginated and non-paginated responses
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleVerifiedChange = (value: string) => {
    setSelectedVerified(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const updateUserStatus = async (
    userId: string,
    newStatus: "active" | "inactive"
  ) => {
    try {
      setIsUpdating(true);
      const apiSecret = API_CONFIG.SECRET;
      const url = API_CONFIG.ENDPOINTS.users.base;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (apiSecret) {
        headers.Authorization = `Bearer ${apiSecret}`;
      }

      const response = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          userId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update user status");
      }

      const updatedUser = await response.json();

      // Update the user in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: updatedUser.status } : user
        )
      );

      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update user status"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setIsDeleting(true);
      const apiSecret = API_CONFIG.SECRET;
      const url = API_CONFIG.ENDPOINTS.users.base;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (apiSecret) {
        headers.Authorization = `Bearer ${apiSecret}`;
      }

      const response = await fetch(url, {
        method: "DELETE",
        headers,
        body: JSON.stringify({
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete user");
      }

      // Remove the user from the local state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));

      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
      throw error; // Re-throw to allow component to handle it
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    // Data
    users,
    currentUsers,
    filteredUsers,

    // Loading states
    isLoading,
    isUpdating,
    isDeleting,

    // Pagination states
    currentPage,
    setCurrentPage,
    totalPages,

    // Search and filter states
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

    // Functions
    fetchUsers,
    updateUserStatus,
    deleteUser,
    formatDate,
  };
}
