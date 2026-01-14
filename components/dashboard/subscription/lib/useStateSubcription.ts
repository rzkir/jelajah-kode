"use client";

import { useState, useEffect, useMemo } from "react";

interface Subscription {
  _id: string;
  email: string;
  ipAddress?: string;
  created_at?: string;
  updated_at?: string;
}

export function useStateSubscription() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "email">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Fetch subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/subscription", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const subscriptionsList = data.subscriptions || [];
          setSubscriptions(subscriptionsList);
        } else {
          console.error("Failed to fetch subscriptions");
          setSubscriptions([]);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        setSubscriptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Filter and sort subscriptions
  const filteredAndSortedSubscriptions = useMemo(() => {
    let filtered = [...subscriptions];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (sub) =>
          sub.email.toLowerCase().includes(searchLower) ||
          sub.ipAddress?.toLowerCase().includes(searchLower) ||
          sub._id.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        case "oldest":
          const dateAOld = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateBOld = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateAOld - dateBOld;
        case "email":
          return a.email.localeCompare(b.email);
        default:
          return 0;
      }
    });

    return filtered;
  }, [subscriptions, searchTerm, sortBy]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedSubscriptions.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSubscriptions = filteredAndSortedSubscriptions.slice(
    startIndex,
    endIndex
  );

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalSubscriptions = subscriptions.length;

    // Count subscriptions by month (last 6 months)
    const now = new Date();
    const monthlyCounts: { [key: string]: number } = {};

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      monthlyCounts[monthKey] = 0;
    }

    subscriptions.forEach((sub) => {
      if (sub.created_at) {
        const subDate = new Date(sub.created_at);
        const monthKey = `${subDate.getFullYear()}-${String(
          subDate.getMonth() + 1
        ).padStart(2, "0")}`;
        if (monthlyCounts[monthKey] !== undefined) {
          monthlyCounts[monthKey]++;
        }
      }
    });

    // Get unique IP addresses
    const uniqueIPs = new Set(
      subscriptions.map((sub) => sub.ipAddress).filter(Boolean)
    ).size;

    // Count today's subscriptions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySubscriptions = subscriptions.filter((sub) => {
      if (!sub.created_at) return false;
      const subDate = new Date(sub.created_at);
      subDate.setHours(0, 0, 0, 0);
      return subDate.getTime() === today.getTime();
    }).length;

    return {
      totalSubscriptions,
      uniqueIPs,
      todaySubscriptions,
      monthlyCounts,
    };
  }, [subscriptions]);

  return {
    subscriptions: paginatedSubscriptions,
    allSubscriptions: filteredAndSortedSubscriptions,
    isLoading,
    searchTerm,
    sortBy,
    currentPage,
    totalPages,
    itemsPerPage,
    statistics,
    setSearchTerm,
    setSortBy,
    setCurrentPage,
  };
}
