import { API_CONFIG } from "@/lib/config";

export const fetchArticles = async (): Promise<Articles[]> => {
  try {
    const apiSecret = API_CONFIG.SECRET;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Always add Authorization header with API_SECRET
    if (apiSecret) {
      headers.Authorization = `Bearer ${apiSecret}`;
    }

    const response = await fetch(API_CONFIG.ENDPOINTS.articles.base, {
      next: {
        revalidate: 0,
      },
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data?.data || [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching articles:", error);
    }
    return [] as unknown as Articles[];
  }
};

export const fetchArticlesById = async (
  articlesId: string
): Promise<ArticlesDetails> => {
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
      API_CONFIG.ENDPOINTS.articles.byId(articlesId),
      {
        next: { revalidate: 0 },
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch article by id: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching article by id:", error);
    }
    return {} as unknown as ArticlesDetails;
  }
};

export const fetchArticlesDetailsById = async (
  articlesId: string
): Promise<ArticlesDetails> => {
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
      API_CONFIG.ENDPOINTS.articles.byArticlesId(articlesId),
      {
        next: { revalidate: 0 },
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch article details by id: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching article details by id:", error);
    }
    return {} as unknown as ArticlesDetails;
  }
};
export interface ArticlesByCategoryResponse {
  data: Articles[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const fetchArticlesByCategory = async (
  categoryId: string,
  page: number = 1,
  limit: number = 10,
  sort: string = "newest"
): Promise<ArticlesByCategoryResponse> => {
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
      API_CONFIG.ENDPOINTS.articles.byCategory(categoryId, page, limit, sort),
      {
        next: { revalidate: 0 },
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch articles by category: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching articles by category:", error);
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

export const fetchArticlesCategories = async (): Promise<
  ArticlesCategory[]
> => {
  try {
    const apiSecret = API_CONFIG.SECRET;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Always add Authorization header with API_SECRET
    if (apiSecret) {
      headers.Authorization = `Bearer ${apiSecret}`;
    }

    const response = await fetch(API_CONFIG.ENDPOINTS.articles.categories, {
      cache: "no-store",
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch articles categories: ${response.statusText}`
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching articles categories:", error);
    }
    return [];
  }
};
