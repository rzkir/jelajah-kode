import { useState, useEffect } from "react";

import { API_CONFIG } from "@/lib/config";

import { fetchProductsRatings } from "@/utils/fetching/FetchProducts";

import { fetchAdminProducts } from "@/utils/fetching/FetchAdmins";

interface UseStateAdminProfileProps {
  adminId: string;
  initialAdmin?: AdminData | null;
  initialProducts?: Products[];
  initialPopularProducts?: Products[];
}

export function useStateAdminProfile({
  adminId,
  initialAdmin,
  initialProducts = [],
  initialPopularProducts = [],
}: UseStateAdminProfileProps) {
  const [admin, setAdmin] = useState<AdminData | null>(initialAdmin || null);
  const [products, setProducts] = useState<Products[]>(initialProducts);
  const [popularProducts, setPopularProducts] = useState<Products[]>(
    initialPopularProducts
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ratings, setRatings] = useState<any[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [isLoading, setIsLoading] = useState(!initialAdmin);

  useEffect(() => {
    if (!initialAdmin) {
      fetchAdmin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminId]);

  const fetchAdmin = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_CONFIG.ENDPOINTS.admins.byId(adminId)}`
      );
      if (!response.ok) throw new Error("Failed to fetch admin");
      const data = await response.json();
      setAdmin(data);
    } catch (error) {
      console.error("Error fetching admin:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.ENDPOINTS.admins.products(adminId, 1, 12)}`
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchPopularProducts = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.ENDPOINTS.admins.products(adminId, 1, 12, "popular")}`
      );
      if (!response.ok) throw new Error("Failed to fetch popular products");
      const data = await response.json();
      setPopularProducts(data.data || []);
    } catch (error) {
      console.error("Error fetching popular products:", error);
    }
  };

  const fetchRatings = async () => {
    try {
      setRatingsLoading(true);
      // First, get all products by this admin
      // Fetch multiple pages to get all products (up to 100)
      const productsData = await fetchAdminProducts(adminId, 1, 100);
      const adminProducts = productsData.data || [];

      // Fetch ratings for each product
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allRatings: any[] = [];
      for (const product of adminProducts) {
        try {
          const productRatings = await fetchProductsRatings(
            product.productsId || product._id,
            1,
            100
          );
          // Add product info to each rating
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ratingsWithProduct = productRatings.map((rating: any) => ({
            ...rating,
            product: {
              title: product.title,
              productsId: product.productsId || product._id,
              thumbnail: product.thumbnail,
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

      // Sort by newest first
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
      setRatingsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "products" && products.length === 0) {
      fetchProducts();
    } else if (activeTab === "popular" && popularProducts.length === 0) {
      fetchPopularProducts();
    } else if (activeTab === "reviews" && ratings.length === 0) {
      fetchRatings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return {
    admin,
    products,
    popularProducts,
    ratings,
    ratingsLoading,
    activeTab,
    setActiveTab,
    isLoading,
  };
}
