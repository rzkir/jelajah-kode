"use client";

import { useState, useEffect, useMemo } from "react";

import { useRouter } from "next/navigation";

import {
  fetchProducts,
  fetchProductsRatings,
} from "@/utils/fetching/FetchProducts";

import { useDiscount } from "@/hooks/discountServices";

import { useAuth } from "@/utils/context/AuthContext";

import { toast } from "sonner";

interface Rating {
  _id: string;
  productsId: string;
  rating: number;
  comment: string;
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: string;
  };
  created_at: string;
  updated_at: string;
}

interface UseStateProductsDetailsProps {
  product: ProductsDetails;
}

export default function useStateProductsDetails({
  product,
}: UseStateProductsDetailsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(product.thumbnail);
  const [relatedProducts, setRelatedProducts] = useState<Products[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState<boolean>(false);
  const [authorProductsCount, setAuthorProductsCount] = useState<number>(0);
  const [authorAverageRating, setAuthorAverageRating] = useState<number>(0);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null); // null = all, 1-5 = specific rating
  const [sortOrder, setSortOrder] = useState<
    "newest" | "oldest" | "highest" | "lowest"
  >("newest");

  const { originalPrice, discountedPrice, activeDiscount, hasActiveDiscount } =
    useDiscount(product.price, product.discount);

  const discountPercentage = useMemo(() => {
    if (hasActiveDiscount && activeDiscount?.type === "percentage") {
      return activeDiscount.value;
    }
    if (hasActiveDiscount && activeDiscount?.type === "fixed") {
      return Math.round((activeDiscount.value / originalPrice) * 100);
    }
    return 0;
  }, [hasActiveDiscount, activeDiscount, originalPrice]);

  const allImages = useMemo(
    () => [product.thumbnail, ...(product.images || [])].filter(Boolean),
    [product.thumbnail, product.images]
  );

  // Filter and sort ratings
  const filteredRatings = useMemo(() => {
    let filtered = [...ratings];

    // Filter by rating value
    if (ratingFilter !== null) {
      filtered = filtered.filter((rating) => rating.rating === ratingFilter);
    }

    // Sort ratings
    filtered.sort((a, b) => {
      switch (sortOrder) {
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
        default:
          return 0;
      }
    });

    return filtered;
  }, [ratings, ratingFilter, sortOrder]);

  useEffect(() => {
    // Fetch related products by category and count author products
    const loadRelatedProducts = async () => {
      try {
        const products = await fetchProducts();
        const related = products
          .filter(
            (p) =>
              p.category.categoryId === product.category.categoryId &&
              p.productsId !== product.productsId &&
              p.status === "publish"
          )
          .slice(0, 3);
        setRelatedProducts(related);

        // Count all products from the same author and calculate average rating
        const authorProducts = products.filter(
          (p) => p.author._id === product.author._id && p.status === "publish"
        );
        setAuthorProductsCount(authorProducts.length);

        // Calculate average rating from all author's products
        const ratingsWithValues = authorProducts
          .map((p) => p.ratingAverage)
          .filter(
            (rating): rating is number =>
              rating !== undefined && rating !== null && rating > 0
          );

        if (ratingsWithValues.length > 0) {
          const totalRating = ratingsWithValues.reduce(
            (sum: number, rating: number) => sum + rating,
            0
          );
          const averageRating = totalRating / ratingsWithValues.length;
          setAuthorAverageRating(averageRating);
        } else {
          setAuthorAverageRating(0);
        }
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };
    loadRelatedProducts();
  }, [product.category.categoryId, product.productsId, product.author._id]);

  useEffect(() => {
    // Fetch ratings when reviews tab is active
    if (activeTab === "reviews") {
      fetchRatings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, product.productsId]);

  const fetchRatings = async () => {
    try {
      setRatingsLoading(true);
      const ratings = await fetchProductsRatings(product.productsId, 1, 20);
      setRatings(ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
      setRatings([]);
    } finally {
      setRatingsLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleBuyNow = () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to continue checkout");
      router.push(`/signin?redirect=/checkout&products=${product._id}:1`);
      return;
    }

    // Check if product is available
    if (product.status !== "publish") {
      toast.error("This product is not available for purchase");
      return;
    }

    // Redirect to checkout with product ID and quantity (default: 1)
    router.push(`/checkout?products=${product._id}:1`);
  };

  return {
    activeTab,
    setActiveTab,
    selectedImage,
    setSelectedImage,
    relatedProducts,
    ratings,
    filteredRatings,
    ratingsLoading,
    originalPrice,
    discountedPrice,
    activeDiscount,
    hasActiveDiscount,
    discountPercentage,
    allImages,
    handleShare,
    handleBuyNow,
    authorProductsCount,
    authorAverageRating,
    ratingFilter,
    setRatingFilter,
    sortOrder,
    setSortOrder,
  };
}
