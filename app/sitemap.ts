import type { MetadataRoute } from "next";

import { fetchProducts } from "@/utils/fetching/FetchProducts";

import { fetchArticles } from "@/utils/fetching/FetchArticles";

import {
  fetchProductCategories,
  fetchProductType,
} from "@/utils/fetching/FetchProducts";

import { fetchArticlesCategories } from "@/utils/fetching/FetchArticles";

import { API_CONFIG } from "@/lib/config";

async function fetchProductTags() {
  try {
    const apiSecret = API_CONFIG.SECRET;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (apiSecret) {
      headers.Authorization = `Bearer ${apiSecret}`;
    }

    const response = await fetch(API_CONFIG.ENDPOINTS.products.tags, {
      cache: "no-store",
      headers,
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com";
  const currentDate = new Date();

  const [
    products,
    articles,
    productCategories,
    productTypes,
    productTags,
    articleCategories,
  ] = await Promise.all([
    fetchProducts(),
    fetchArticles(),
    fetchProductCategories(),
    fetchProductType(),
    fetchProductTags(),
    fetchArticlesCategories(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/documentation`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/license-agreement`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.productsId || product._id}`,
    lastModified: product.updated_at
      ? new Date(product.updated_at)
      : currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productCategoryPages: MetadataRoute.Sitemap = productCategories.map(
    (category) => ({
      url: `${baseUrl}/products/categories/${
        category.categoryId || category._id
      }`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  const productTypePages: MetadataRoute.Sitemap = productTypes.map((type) => ({
    url: `${baseUrl}/products/types/${type.typeId || type._id}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productTagPages: MetadataRoute.Sitemap = productTags.map(
    (tag: { tagsId?: string; _id?: string }) => ({
      url: `${baseUrl}/products/tags/${tag.tagsId || tag._id}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articles/${article.articlesId || article._id}`,
    lastModified: article.updatedAt ? new Date(article.updatedAt) : currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const articleCategoryPages: MetadataRoute.Sitemap = articleCategories.map(
    (category) => ({
      url: `${baseUrl}/articles/categories/${
        category.categoryId || category._id
      }`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  return [
    ...staticPages,
    ...productPages,
    ...productCategoryPages,
    ...productTypePages,
    ...productTagPages,
    ...articlePages,
    ...articleCategoryPages,
  ];
}
