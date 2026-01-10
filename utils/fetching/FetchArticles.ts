import { API_CONFIG } from "@/lib/config";

export const fetchArticlesById = async (
  articlesId: string
): Promise<Articles> => {
  try {
    const response = await fetch(
      `${API_CONFIG.ENDPOINTS.articles.base}?id=${articlesId}`,
      {
        next: { revalidate: 0 },
        headers: {
          "Content-Type": "application/json",
        },
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
    return {} as unknown as Articles;
  }
};

