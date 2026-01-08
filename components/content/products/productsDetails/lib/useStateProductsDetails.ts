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

  useEffect(() => {
    // Fetch related products by category
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
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };
    loadRelatedProducts();
  }, [product.category.categoryId, product.productsId]);

  useEffect(() => {
    // Fetch ratings when reviews tab is active
    if (activeTab === "reviews") {
      fetchRatings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, product.productsId]);

  const fetchRatings = async () => {
    try {
      const ratings = await fetchProductsRatings(product.productsId, 1, 20);
      setRatings(ratings);
    } catch (error) {
      console.error("Error fetching ratings:", error);
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
    originalPrice,
    discountedPrice,
    activeDiscount,
    hasActiveDiscount,
    discountPercentage,
    allImages,
    handleShare,
    handleBuyNow,
  };
}
