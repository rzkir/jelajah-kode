import { API_CONFIG } from "@/lib/config";

export const fetchAdminById = async (
  adminId: string
): Promise<AdminData | null> => {
  try {
    const apiSecret = API_CONFIG.SECRET;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Always add Authorization header with API_SECRET
    if (apiSecret) {
      headers.Authorization = `Bearer ${apiSecret}`;
    }

    const response = await fetch(
      `${API_CONFIG.ENDPOINTS.admins.byId(adminId)}`,
      {
        next: {
          revalidate: 60,
        },
        headers,
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch admin: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching admin:", error);
    }
    return null;
  }
};

export const fetchAdminProducts = async (
  adminId: string,
  page: number = 1,
  limit: number = 12,
  sort?: string
): Promise<AdminProductsResponse> => {
  try {
    const apiSecret = API_CONFIG.SECRET;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Always add Authorization header with API_SECRET
    if (apiSecret) {
      headers.Authorization = `Bearer ${apiSecret}`;
    }

    const response = await fetch(
      `${API_CONFIG.ENDPOINTS.admins.products(adminId, page, limit, sort)}`,
      {
        next: {
          revalidate: 60,
        },
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch admin products: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching admin products:", error);
    }
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
      },
    };
  }
};

export const fetchAdminArticles = async (
  adminId: string,
  page: number = 1,
  limit: number = 12
): Promise<AdminArticlesResponse> => {
  try {
    const apiSecret = API_CONFIG.SECRET;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Always add Authorization header with API_SECRET
    if (apiSecret) {
      headers.Authorization = `Bearer ${apiSecret}`;
    }

    const response = await fetch(
      `${API_CONFIG.ENDPOINTS.admins.articles(adminId, page, limit)}`,
      {
        next: {
          revalidate: 60,
        },
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch admin articles: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching admin articles:", error);
    }
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
      },
    };
  }
};
