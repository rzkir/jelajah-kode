import { cache } from "react";
import { API_CONFIG } from "@/lib/config";
import { apiFetch } from "@/lib/apiFetch";

export const fetchArticles = cache(async (): Promise<Articles[]> => {
  try {
    const data = await apiFetch<any>(
      API_CONFIG.ENDPOINTS.articles.base,
      {
        revalidate: 3600,
        tags: ["articles"],
      }
    );

    return Array.isArray(data) ? data : data?.data ?? [];
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching articles:", error);
    }
    return [];
  }
});

export const fetchArticlesById = cache(
  async (articlesId: string): Promise<ArticlesDetails> => {
    try {
      const data = await apiFetch<ArticlesDetails>(
        API_CONFIG.ENDPOINTS.articles.byId(articlesId),
        {
          revalidate: 3600,
          tags: ["articles", `article-${articlesId}`],
        }
      );

      return data;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error fetching article by id:", error);
      }
      return {} as unknown as ArticlesDetails;
    }
  }
);

export const fetchArticlesDetailsById = cache(
  async (articlesId: string): Promise<ArticlesDetails> => {
    try {
      const data = await apiFetch<ArticlesDetails>(
        API_CONFIG.ENDPOINTS.articles.byArticlesId(articlesId),
        {
          revalidate: 3600,
          tags: ["articles", `article-${articlesId}`],
        }
      );

      return data;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error fetching article details by id:", error);
      }
      return {} as unknown as ArticlesDetails;
    }
  }
);

export interface ArticlesByCategoryResponse {
  data: Articles[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const fetchArticlesByCategory = cache(
  async (
    categoryId: string,
    page: number = 1,
    limit: number = 10,
    sort: string = "newest"
  ): Promise<ArticlesByCategoryResponse> => {
    try {
      const data = await apiFetch<ArticlesByCategoryResponse>(
        API_CONFIG.ENDPOINTS.articles.byCategory(categoryId, page, limit, sort),
        {
          revalidate: 3600,
          tags: ["articles", "articles-by-category", `category-${categoryId}`],
        }
      );

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
  }
);

export const fetchArticlesCategories = cache(
  async (): Promise<ArticlesCategory[]> => {
    try {
      const data = await apiFetch<any>(
        API_CONFIG.ENDPOINTS.articles.categories,
        {
          revalidate: 3600,
          tags: ["articles", "articles-categories"],
        }
      );

      return Array.isArray(data) ? data : [];
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error fetching articles categories:", error);
      }
      return [];
    }
  }
);
