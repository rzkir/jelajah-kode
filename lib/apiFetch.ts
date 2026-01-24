import { API_CONFIG } from "./config";

interface ApiFetchOptions {
  revalidate?: number;
  tags?: string[];
}

export async function apiFetch<T>(
  url: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Always add Authorization header with API_SECRET
    if (API_CONFIG.SECRET) {
      headers.Authorization = `Bearer ${API_CONFIG.SECRET}`;
    }

    const fetchOptions: RequestInit = {
      headers,
      next: {
        revalidate: options.revalidate,
        tags: options.tags,
      },
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    // Re-throw the error so it can be handled by the calling function
    throw error;
  }
}
