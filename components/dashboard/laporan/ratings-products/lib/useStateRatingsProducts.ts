"use client";

import { useState, useEffect, useMemo } from "react";
import { API_CONFIG } from "@/lib/config";
import { fetchProductsRatings } from "@/utils/fetching/FetchProducts";

interface Rating {
  _id: string;
  productsId: string;
  rating: number;
  comment: string;
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: "admins" | "user";
  };
  created_at: string;
  updated_at: string;
}

interface Product {
  _id: string;
  productsId: string;
  title: string;
  thumbnail: string;
}

interface RatingWithProduct extends Rating {
  product: Product | null;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"];

export function useStateRatingsProducts() {
  const [ratings, setRatings] = useState<RatingWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest" | "product"
  >("newest");
  const [selectedProduct, setSelectedProduct] = useState<string>("all");

  // Fetch all ratings from all products
  useEffect(() => {
    const fetchAllRatings = async () => {
      try {
        setIsLoading(true);

        // First, fetch all products
        const productsResponse = await fetch(
          API_CONFIG.ENDPOINTS.products.base,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              ...(API_CONFIG.SECRET && {
                Authorization: `Bearer ${API_CONFIG.SECRET}`,
              }),
            },
          }
        );

        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }

        const productsData = await productsResponse.json();
        const productsList = Array.isArray(productsData)
          ? productsData
          : productsData?.data || [];

        // Fetch ratings for each product
        const allRatings: RatingWithProduct[] = [];
        for (const product of productsList) {
          try {
            const productRatings = await fetchProductsRatings(
              product.productsId,
              1,
              1000 // Get all ratings for each product
            );

            // Add product info to each rating
            const ratingsWithProduct = productRatings.map((rating: Rating) => ({
              ...rating,
              product: {
                _id: product._id,
                productsId: product.productsId,
                title: product.title,
                thumbnail: product.thumbnail || "",
              },
            }));

            allRatings.push(...ratingsWithProduct);
          } catch (error) {
            console.error(
              `Error fetching ratings for product ${product.productsId}:`,
              error
            );
          }
        }

        // Sort by newest first by default
        allRatings.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        });

        setRatings(allRatings);
      } catch (error) {
        console.error("Error fetching ratings:", error);
        setRatings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllRatings();
  }, []);

  // Get unique products from ratings
  const products = useMemo(() => {
    const productMap = new Map<string, Product>();
    ratings.forEach((rating) => {
      if (rating.product && !productMap.has(rating.product.productsId)) {
        productMap.set(rating.product.productsId, rating.product);
      }
    });
    return Array.from(productMap.values());
  }, [ratings]);

  // Filter and sort ratings
  const filteredAndSortedRatings = useMemo(() => {
    let filtered = [...ratings];

    // Filter by rating value
    if (ratingFilter !== null) {
      filtered = filtered.filter((rating) => rating.rating === ratingFilter);
    }

    // Filter by product
    if (selectedProduct !== "all") {
      filtered = filtered.filter(
        (rating) => rating.productsId === selectedProduct
      );
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (rating) =>
          rating.comment.toLowerCase().includes(searchLower) ||
          rating.author.name.toLowerCase().includes(searchLower) ||
          rating.product?.title.toLowerCase().includes(searchLower) ||
          rating.productsId.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "product":
          return (a.product?.title || "").localeCompare(b.product?.title || "");
        default:
          return 0;
      }
    });

    return filtered;
  }, [ratings, ratingFilter, selectedProduct, searchTerm, sortBy]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

    const ratingDistribution = {
      5: ratings.filter((r) => r.rating === 5).length,
      4: ratings.filter((r) => r.rating === 4).length,
      3: ratings.filter((r) => r.rating === 3).length,
      2: ratings.filter((r) => r.rating === 2).length,
      1: ratings.filter((r) => r.rating === 1).length,
    };

    return {
      totalRatings,
      averageRating,
      ratingDistribution,
    };
  }, [ratings]);

  const ratingDistributionData = [
    {
      name: "5 Bintang",
      value: statistics.ratingDistribution[5],
      color: COLORS[0],
    },
    {
      name: "4 Bintang",
      value: statistics.ratingDistribution[4],
      color: COLORS[1],
    },
    {
      name: "3 Bintang",
      value: statistics.ratingDistribution[3],
      color: COLORS[2],
    },
    {
      name: "2 Bintang",
      value: statistics.ratingDistribution[2],
      color: COLORS[3],
    },
    {
      name: "1 Bintang",
      value: statistics.ratingDistribution[1],
      color: COLORS[4],
    },
  ].filter((item) => item.value > 0);

  const ratingBarData = [
    { rating: "5", jumlah: statistics.ratingDistribution[5] },
    { rating: "4", jumlah: statistics.ratingDistribution[4] },
    { rating: "3", jumlah: statistics.ratingDistribution[3] },
    { rating: "2", jumlah: statistics.ratingDistribution[2] },
    { rating: "1", jumlah: statistics.ratingDistribution[1] },
  ];

  return {
    ratings: filteredAndSortedRatings,
    allRatings: ratings,
    products,
    ratingDistributionData,
    isLoading,
    ratingBarData,
    searchTerm,
    ratingFilter,
    sortBy,
    selectedProduct,
    statistics,
    setSearchTerm,
    setRatingFilter,
    setSortBy,
    setSelectedProduct,
  };
}
