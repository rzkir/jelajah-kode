import { cache } from "react";

import { API_CONFIG } from "@/lib/config";

import { apiFetch } from "@/lib/apiFetch";

export const fetchProducts = cache(async (): Promise<Products[]> => {
  try {
    const data = await apiFetch<any>(
      API_CONFIG.ENDPOINTS.products.base,
      {
        revalidate: 3600,
        tags: ["products"],
      }
    );

    return Array.isArray(data) ? data : data?.data ?? [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching products:", error);
    }
    return [];
  }
});

export const fetchProductsById = cache(
  async (productsId: string): Promise<ProductsDetails> => {
    try {
      const data = await apiFetch<ProductsDetails>(
        API_CONFIG.ENDPOINTS.products.byProductsId(productsId),
        {
          revalidate: 3600,
          tags: ["products", `product-${productsId}`],
        }
      );

      return data;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error fetching product by id:", error);
      }
      return {} as unknown as ProductsDetails;
    }
  }
);

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

    const data = await apiFetch<ProductsSearchResponse>(
      API_CONFIG.ENDPOINTS.products.search(params),
      {
        revalidate: 3600,
        tags: ["products", "products-search"],
      }
    );

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

export const fetchProductCategories = cache(async (): Promise<Category[]> => {
  try {
    const data = await apiFetch<any>(
      API_CONFIG.ENDPOINTS.products.categories,
      {
        revalidate: 3600,
        tags: ["products", "categories"],
      }
    );

    return Array.isArray(data) ? data : data?.data ?? [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching categories:", error);
    }
    return [];
  }
});

export const fetchProductType = cache(async (): Promise<Type[]> => {
  try {
    const data = await apiFetch<any>(
      API_CONFIG.ENDPOINTS.products.type,
      {
        revalidate: 3600,
        tags: ["products", "types"],
      }
    );

    return Array.isArray(data) ? data : data?.data ?? [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching types:", error);
    }
    return [];
  }
});

export const fetchProductsDiscount = cache(
  async (
    page: number = 1,
    limit: number = 10
  ): Promise<ProductsDiscountResponse> => {
    try {
      const data = await apiFetch<ProductsDiscountResponse>(
        API_CONFIG.ENDPOINTS.products.discount(page, limit),
        {
          revalidate: 3600,
          tags: ["products", "products-discount"],
        }
      );

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
  }
);

export const fetchProductsMostSaled = cache(
  async (
    page: number = 1,
    limit: number = 10
  ): Promise<ProductsMostSaledResponse> => {
    try {
      const data = await apiFetch<ProductsMostSaledResponse>(
        API_CONFIG.ENDPOINTS.products.mostSaled(page, limit),
        {
          revalidate: 3600,
          tags: ["products", "products-most-saled"],
        }
      );

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
  }
);

export const fetchProductsPopular = cache(
  async (
    page: number = 1,
    limit: number = 10
  ): Promise<ProductsPopularResponse> => {
    try {
      const data = await apiFetch<ProductsPopularResponse>(
        API_CONFIG.ENDPOINTS.products.popular(page, limit),
        {
          revalidate: 3600,
          tags: ["products", "products-popular"],
        }
      );

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
  }
);

export const fetchProductsRatings = cache(
  async (
    productsId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Ratings[]> => {
    try {
      const data = await apiFetch<any>(
        API_CONFIG.ENDPOINTS.products.ratings(productsId, page, limit),
        {
          revalidate: 3600,
          tags: ["products", "ratings", `product-${productsId}`],
        }
      );

      return data.ratings;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error fetching products ratings:", error);
      }
      return [];
    }
  }
);

export const fetchProductsByCategory = cache(
  async (
    categoryId: string,
    page: number = 1,
    limit: number = 10,
    sort: string = "newest"
  ): Promise<ProductsByCategoryResponse> => {
    try {
      const data = await apiFetch<ProductsByCategoryResponse>(
        API_CONFIG.ENDPOINTS.products.byCategory(categoryId, page, limit, sort),
        {
          revalidate: 3600,
          tags: ["products", "products-by-category", `category-${categoryId}`],
        }
      );

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
  }
);

export const fetchProductsByType = cache(
  async (
    typeId: string,
    page: number = 1,
    limit: number = 10,
    sort: string = "newest"
  ): Promise<ProductsByTypeResponse> => {
    try {
      const data = await apiFetch<ProductsByTypeResponse>(
        API_CONFIG.ENDPOINTS.products.byType(typeId, page, limit, sort),
        {
          revalidate: 3600,
          tags: ["products", "products-by-type", `type-${typeId}`],
        }
      );

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
  }
);

export const fetchProductsByTags = cache(
  async (
    tagsId: string,
    page: number = 1,
    limit: number = 10,
    sort: string = "newest"
  ): Promise<ProductsByTagsResponse> => {
    try {
      const data = await apiFetch<ProductsByTagsResponse>(
        API_CONFIG.ENDPOINTS.products.byTags(tagsId, page, limit, sort),
        {
          revalidate: 3600,
          tags: ["products", "products-by-tags", `tags-${tagsId}`],
        }
      );

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
  }
);
