import { API_CONFIG } from "@/lib/config";

export const fetchProducts = async (
  page: number = 1,
  limit: number = 10
): Promise<Products[]> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await fetch(
    `${API_CONFIG.ENDPOINTS.products.base}?${params.toString()}`,
    {
      next: { revalidate: 10 },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_CONFIG.SECRET}`,
      },
    }
  );

  return await response.json();
};

export const fetchProductsById = async (
  productsId: string
): Promise<ProductsDetails> => {
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

  return await response.json();
};

export const fetchProductsBySearch = async (
  query: string,
  page: number = 1
): Promise<ProductsSearchResponse> => {
  const response = await fetch(
    API_CONFIG.ENDPOINTS.products.search(query, page),
    {
      next: { revalidate: 0 },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_CONFIG.SECRET}`,
      },
    }
  );

  return await response.json();
};

export const fetchProductCategories = async (): Promise<Category[]> => {
  const response = await fetch(API_CONFIG.ENDPOINTS.products.categories, {
    next: { revalidate: 0 },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_CONFIG.SECRET}`,
    },
  });

  return await response.json();
};

export const fetchProductType = async (): Promise<Type[]> => {
  const response = await fetch(API_CONFIG.ENDPOINTS.products.type, {
    next: { revalidate: 0 },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_CONFIG.SECRET}`,
    },
  });

  return await response.json();
};

export const fetchProductsDiscount = async (
  page: number = 1,
  limit: number = 10
): Promise<ProductsDiscountResponse> => {
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

  return await response.json();
};
