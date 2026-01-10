import { API_CONFIG } from "@/lib/config";

interface AdminData {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  role: string;
  status: string;
  created_at: string;
  stats: {
    products: number;
    articles: number;
    rating: number;
    downloads: number;
  };
}

interface AdminProductsResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface AdminArticlesResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const fetchAdminById = async (
  adminId: string
): Promise<AdminData | null> => {
  try {
    const response = await fetch(
      `${API_CONFIG.ENDPOINTS.base}/api/admins/${adminId}`,
      {
        next: {
          revalidate: 60,
        },
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
  limit: number = 12
): Promise<AdminProductsResponse> => {
  try {
    const response = await fetch(
      `${API_CONFIG.ENDPOINTS.base}/api/admins/${adminId}/products?page=${page}&limit=${limit}`,
      {
        next: {
          revalidate: 60,
        },
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
    const response = await fetch(
      `${API_CONFIG.ENDPOINTS.base}/api/admins/${adminId}/articles?page=${page}&limit=${limit}`,
      {
        next: {
          revalidate: 60,
        },
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
