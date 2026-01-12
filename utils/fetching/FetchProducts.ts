import { API_CONFIG } from "@/lib/config";

import { getApiUrl, shouldUseProxy } from "@/lib/development";

export const fetchProducts = async (): Promise<Products[]> => {
  try {
    // Use getApiUrl to handle development/production routing
    const productsUrl = getApiUrl(
      "/api/proxy-products",
      API_CONFIG.ENDPOINTS.products.base
    );

    // Determine if we're using proxy or direct URL
    const isUsingProxy = shouldUseProxy() && typeof window !== "undefined";

    const response = await fetch(productsUrl, {
      next: {
        revalidate: 0,
      },
      headers: {
        "Content-Type": "application/json",
        // Only send Authorization header when using direct URL (not proxy)
        ...(isUsingProxy
          ? {}
          : { Authorization: `Bearer ${API_CONFIG.SECRET}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching products:", error);
    }
    return [] as unknown as Products[];
  }
};

export const fetchProductsById = async (
  productsId: string
): Promise<ProductsDetails> => {
  try {
    const response = await fetch(
      API_CONFIG.ENDPOINTS.products.byProductsId(productsId),
      {
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch product by id: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching product by id:", error);
    }
    return {} as unknown as ProductsDetails;
  }
};

export const fetchProductsBySearch = async (
  searchParams: Record<string, string | string[] | undefined>
): Promise<ProductsSearchResponse> => {
  try {
    const params = new URLSearchParams();

    // Add all search params to URLSearchParams
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, value.toString());
        }
      }
    });

    const response = await fetch(API_CONFIG.ENDPOINTS.products.search(params), {
      next: { revalidate: 0 },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_CONFIG.SECRET}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error searching products:", error);
    }
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
      query: searchParams.q?.toString() || "",
    };
  }
};

export const fetchProductCategories = async (): Promise<Category[]> => {
  try {
    // Use getApiUrl to handle development/production routing
    const categoriesUrl = getApiUrl(
      "/api/proxy-products/categories",
      API_CONFIG.ENDPOINTS.products.categories
    );

    // Determine if we're using proxy or direct URL
    const isUsingProxy = shouldUseProxy() && typeof window !== "undefined";

    const response = await fetch(categoriesUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        // Only send Authorization header when using direct URL (not proxy)
        ...(isUsingProxy
          ? {}
          : { Authorization: `Bearer ${API_CONFIG.SECRET}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching categories:", error);
    }
    return [];
  }
};

export const fetchProductType = async (): Promise<Type[]> => {
  try {
    // Use getApiUrl to handle development/production routing
    const typeUrl = getApiUrl(
      "/api/proxy-products/type",
      API_CONFIG.ENDPOINTS.products.type
    );

    // Determine if we're using proxy or direct URL
    const isUsingProxy = shouldUseProxy() && typeof window !== "undefined";

    const response = await fetch(typeUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        // Only send Authorization header when using direct URL (not proxy)
        ...(isUsingProxy
          ? {}
          : { Authorization: `Bearer ${API_CONFIG.SECRET}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch types: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching types:", error);
    }
    return [];
  }
};

export const fetchProductsDiscount = async (
  page: number = 1,
  limit: number = 10
): Promise<ProductsDiscountResponse> => {
  try {
    const response = await fetch(
      API_CONFIG.ENDPOINTS.products.discount(page, limit),
      {
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products discount: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching products discount:", error);
    }
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  }
};

export const fetchProductsMostSaled = async (
  page: number = 1,
  limit: number = 10
): Promise<ProductsMostSaledResponse> => {
  try {
    const response = await fetch(
      API_CONFIG.ENDPOINTS.products.mostSaled(page, limit),
      {
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch most saled products: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching most saled products:", error);
    }
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  }
};

export const fetchProductsPopular = async (
  page: number = 1,
  limit: number = 10
): Promise<ProductsPopularResponse> => {
  try {
    const response = await fetch(
      API_CONFIG.ENDPOINTS.products.popular(page, limit),
      {
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch popular products: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching popular products:", error);
    }
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  }
};

export const fetchProductsRatings = async (
  productsId: string,
  page: number = 1,
  limit: number = 10
): Promise<Ratings[]> => {
  try {
    const response = await fetch(
      API_CONFIG.ENDPOINTS.products.ratings(productsId, page, limit),
      {
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_CONFIG.SECRET}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products ratings: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.ratings;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching products ratings:", error);
    }
    return [] as unknown as Ratings[];
  }
};

export const fetchProductsByCategory = async (
  categoryId: string,
  page: number = 1,
  limit: number = 10,
  sort: string = "newest"
): Promise<ProductsByCategoryResponse> => {
  try {
    const response = await fetch(
      API_CONFIG.ENDPOINTS.products.byCategory(categoryId, page, limit, sort),
      {
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products by category: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching products by category:", error);
    }
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  }
};

export const fetchProductsByType = async (
  typeId: string,
  page: number = 1,
  limit: number = 10,
  sort: string = "newest"
): Promise<ProductsByTypeResponse> => {
  try {
    const response = await fetch(
      API_CONFIG.ENDPOINTS.products.byType(typeId, page, limit, sort),
      {
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products by type: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching products by type:", error);
    }
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  }
};

export const fetchProductsByTags = async (
  tagsId: string,
  page: number = 1,
  limit: number = 10,
  sort: string = "newest"
): Promise<ProductsByTagsResponse> => {
  try {
    const response = await fetch(
      API_CONFIG.ENDPOINTS.products.byTags(tagsId, page, limit, sort),
      {
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products by tags: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching products by tags:", error);
    }
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  }
};
