import { Metadata } from "next";

import { fetchProductsById } from "@/utils/fetching/FetchProducts";

import { API_CONFIG } from "@/lib/config";

//====================================== Products Page Metadata ======================================//
export const ProductsPageMetadata: Metadata = {
  title: "Products - jelajah Code",
  description: "Browse and discover products on jelajah Code platform",
  openGraph: {
    title: "Products - jelajah Code",
    description: "Browse and discover products on jelajah Code platform",
    url: `${API_CONFIG.ENDPOINTS.base}/products`,
    siteName: "jelajah Code",
    images: [
      {
        url: "/images/products-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "jelajah Code Products",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Products - jelajah Code",
    description: "Browse and discover products on jelajah Code platform",
    images: ["/images/products-og-image.jpg"],
  },
};

export async function generateProductsPageMetadata(
  searchParams: Promise<{
    q?: string;
    page?: string;
    categories?: string;
    types?: string;
    tech?: string;
    maxPrice?: string;
    minRating?: string;
    popular?: string;
    discounted?: string;
    new?: string;
    sort?: string;
  }>
): Promise<Metadata> {
  const params = await searchParams;
  const {
    q,
    page,
    categories,
    types,
    tech,
    maxPrice,
    minRating,
    popular,
    discounted,
    new: isNew,
    sort,
  } = params;

  const query = q || "";
  const pageNumber = page || "1";

  // Build URL with all parameters
  const urlParams = new URLSearchParams();
  if (query) urlParams.set("q", query);
  if (pageNumber !== "1") urlParams.set("page", pageNumber);
  if (categories) urlParams.set("categories", categories);
  if (types) urlParams.set("types", types);
  if (tech) urlParams.set("tech", tech);
  if (maxPrice) urlParams.set("maxPrice", maxPrice);
  if (minRating) urlParams.set("minRating", minRating);
  if (popular) urlParams.set("popular", popular);
  if (discounted) urlParams.set("discounted", discounted);
  if (isNew) urlParams.set("new", isNew);
  if (sort) urlParams.set("sort", sort);

  const productsUrl = `${API_CONFIG.ENDPOINTS.base}/products${
    urlParams.toString() ? `?${urlParams.toString()}` : ""
  }`;

  // Build filter description
  const filters: string[] = [];
  if (categories) filters.push(`category: ${categories}`);
  if (types) filters.push(`type: ${types}`);
  if (tech) filters.push(`tech: ${tech}`);
  if (maxPrice) filters.push(`max price: $${maxPrice}`);
  if (minRating) filters.push(`min rating: ${minRating}★`);
  if (popular === "true") filters.push("popular items");
  if (discounted === "true") filters.push("discounted items");
  if (isNew === "true") filters.push("new arrivals");

  if (query || filters.length > 0) {
    try {
      const { fetchProductsBySearch } = await import(
        "@/utils/fetching/FetchProducts"
      );

      const searchOptions = {
        q: query,
        page: pageNumber,
        limit: "10",
        categories,
        types,
        tech,
        maxPrice,
        minRating,
        popular,
        discounted,
        new: isNew,
        sort,
      };

      const { pagination } = await fetchProductsBySearch(searchOptions);
      const resultCount = pagination.total;

      let title = "";
      let description = "";

      if (query && filters.length > 0) {
        title = `Products "${query}" (${filters.join(", ")}) - jelajah Code`;
        description = `Found ${resultCount} product${
          resultCount !== 1 ? "s" : ""
        } for "${query}" with filters: ${filters.join(
          ", "
        )}. Browse and discover products that match your search.`;
      } else if (query) {
        title = `Products "${query}" - jelajah Code`;
        description = `Found ${resultCount} product${
          resultCount !== 1 ? "s" : ""
        } for "${query}" on jelajah Code. Browse and discover products that match your search.`;
      } else {
        title = `Products (${filters.join(", ")}) - jelajah Code`;
        description = `Found ${resultCount} product${
          resultCount !== 1 ? "s" : ""
        } matching your filters: ${filters.join(
          ", "
        )}. Browse and discover products on jelajah Code.`;
      }

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: productsUrl,
          siteName: "jelajah Code",
          images: [
            {
              url: "/images/products-og-image.jpg",
              width: 1200,
              height: 630,
              alt: query ? `Products "${query}"` : "Products",
            },
          ],
          locale: "en_US",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: ["/images/products-og-image.jpg"],
        },
      };
    } catch {
      // Fallback to default products metadata if fetch fails
      let fallbackTitle = "";
      let fallbackDescription = "";

      if (query && filters.length > 0) {
        fallbackTitle = `Products "${query}" (${filters.join(
          ", "
        )}) - jelajah Code`;
        fallbackDescription = `Browse products for "${query}" with filters on jelajah Code platform`;
      } else if (query) {
        fallbackTitle = `Products "${query}" - jelajah Code`;
        fallbackDescription = `Browse products for "${query}" on jelajah Code platform`;
      } else {
        fallbackTitle = `Products (${filters.join(", ")}) - jelajah Code`;
        fallbackDescription = `Browse products with filters on jelajah Code platform`;
      }

      return {
        title: fallbackTitle,
        description: fallbackDescription,
        openGraph: {
          title: fallbackTitle,
          description: fallbackDescription,
          url: productsUrl,
          siteName: "jelajah Code",
          images: [
            {
              url: "/images/products-og-image.jpg",
              width: 1200,
              height: 630,
              alt: query ? `Products "${query}"` : "Products",
            },
          ],
          locale: "en_US",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: fallbackTitle,
          description: fallbackDescription,
          images: ["/images/products-og-image.jpg"],
        },
      };
    }
  }

  return ProductsPageMetadata;
}

//====================================== Products Create Metadata ======================================//

export const ProductsCreateMetadata: Metadata = {
  title: "Add New Product - jelajah Code",
  description: "Create and add new products to your jelajah Code platform",
  openGraph: {
    title: "Add New Product - jelajah Code",
    description: "Create and add new products to your jelajah Code platform",
    url: `${API_CONFIG.ENDPOINTS.base}`,
    siteName: "jelajah Code",
    images: [
      {
        url: "/images/new-product-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Add New Product - jelajah Code",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Add New Product - jelajah Code",
    description: "Create and add new products to your jelajah Code platform",
    images: ["/images/new-product-og-image.jpg"],
  },
};

//====================================== Products Edit Metadata ======================================//
export const ProductsEditMetadata: Metadata = {
  title: "Edit Product - jelajah Code",
  description: "Edit and update product details in your jelajah Code platform",
  openGraph: {
    title: "Edit Product - jelajah Code",
    description:
      "Edit and update product details in your jelajah Code platform",
    url: `${API_CONFIG.ENDPOINTS.base}`,
    siteName: "jelajah Code",
    images: [
      {
        url: "/images/edit-product-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Edit Product - jelajah Code",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edit Product - jelajah Code",
    description:
      "Edit and update product details in your jelajah Code platform",
    images: ["/images/edit-product-og-image.jpg"],
  },
};

//====================================== Products Details Metadata ======================================//

export async function generateProductsDetailsMetadata(
  params: Promise<{ productsId: string }>
): Promise<Metadata> {
  const { productsId } = await params;

  try {
    const product = await fetchProductsById(productsId);
    const title = product.title;
    const description = product.description;
    const thumbnail = product.thumbnail;
    const url = `${API_CONFIG.ENDPOINTS.base}`;

    return {
      title: `${title} - jelajah Code`,
      description: description,
      openGraph: {
        title: `${title} - jelajah Code`,
        description: description,
        url: url,
        siteName: "jelajah Code",
        images: [
          {
            url: thumbnail,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} - jelajah Code`,
        description: description,
        images: [thumbnail],
      },
    };
  } catch {
    // Fallback metadata if product fetch fails
    return {
      title: `Product ${productsId} - jelajah Code`,
      description: `View product details for ${productsId} on jelajah Code platform`,
      openGraph: {
        title: `Product ${productsId} - jelajah Code`,
        description: `View product details for ${productsId} on jelajah Code platform`,
        url: `${API_CONFIG.ENDPOINTS.base}`,
        siteName: "jelajah Code",
        images: [
          {
            url: "/images/product-default-og-image.jpg",
            width: 1200,
            height: 630,
            alt: `Product ${productsId}`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `Product ${productsId} - jelajah Code`,
        description: `View product details for ${productsId} on jelajah Code platform`,
        images: ["/images/product-default-og-image.jpg"],
      },
    };
  }
}

//====================================== Checkout Metadata ======================================//

export const CheckoutMetadata: Metadata = {
  title: "Checkout - jelajah Code",
  description: "Review your cart and complete your purchase on jelajah Code",
  openGraph: {
    title: "Checkout - jelajah Code",
    description: "Review your cart and complete your purchase on jelajah Code",
    url: `${API_CONFIG.ENDPOINTS.base}/checkout`,
    siteName: "jelajah Code",
    images: [
      {
        url: "/images/checkout-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Checkout on jelajah Code",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout - jelajah Code",
    description: "Review your cart and complete your purchase on jelajah Code",
    images: ["/images/checkout-og-image.jpg"],
  },
};

export async function generateCheckoutMetadata(
  searchParams: Promise<{ productId?: string; title?: string }>
): Promise<Metadata> {
  const { productId, title } = await searchParams;

  try {
    const product = productId ? await fetchProductsById(productId) : null;
    const productTitle = product?.title ?? title ?? "Checkout";
    const description =
      product?.description ??
      `Review your cart and complete your purchase on jelajah Code`;
    const thumbnail = product?.thumbnail ?? "/images/checkout-og-image.jpg";
    const url = productId
      ? `${API_CONFIG.ENDPOINTS.base}/checkout?productId=${productId}`
      : `${API_CONFIG.ENDPOINTS.base}/checkout`;

    return {
      title: `${productTitle} - jelajah Code`,
      description,
      openGraph: {
        title: `${productTitle} - jelajah Code`,
        description,
        url,
        siteName: "jelajah Code",
        images: [
          {
            url: thumbnail,
            width: 1200,
            height: 630,
            alt: productTitle,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${productTitle} - jelajah Code`,
        description,
        images: [thumbnail],
      },
    };
  } catch {
    return CheckoutMetadata;
  }
}

//====================================== Checkout Status Metadata ======================================//

export async function generateCheckoutStatusMetadata(
  params: Promise<{ status: string; title?: string }>
): Promise<Metadata> {
  const { status, title } = await params;
  const statusTitle = status
    ? `Checkout ${status.charAt(0).toUpperCase()}${status.slice(1)}`
    : "Checkout Status";
  const pageTitle = title ?? statusTitle;
  const description = `Checkout ${status} on jelajah Code`;

  return {
    title: `${pageTitle} - jelajah Code`,
    description,
    openGraph: {
      title: `${pageTitle} - jelajah Code`,
      description,
      url: `${API_CONFIG.ENDPOINTS.base}/checkout/${status}`,
      siteName: "jelajah Code",
      images: [
        {
          url: "/images/checkout-status-og-image.jpg",
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} - jelajah Code`,
      description,
      images: ["/images/checkout-status-og-image.jpg"],
    },
  };
}

//====================================== Search Page Metadata ======================================//
export const SearchPageMetadata: Metadata = {
  title: "Search Products - jelajah Code",
  description: "Search and discover products on jelajah Code platform",
  openGraph: {
    title: "Search Products - jelajah Code",
    description: "Search and discover products on jelajah Code platform",
    url: `${API_CONFIG.ENDPOINTS.base}/search`,
    siteName: "jelajah Code",
    images: [
      {
        url: "/images/search-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Search Products - jelajah Code",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Products - jelajah Code",
    description: "Search and discover products on jelajah Code platform",
    images: ["/images/search-og-image.jpg"],
  },
};

export async function generateSearchPageMetadata(
  searchParams: Promise<{
    q?: string;
    page?: string;
    categories?: string;
    types?: string;
    tech?: string;
    maxPrice?: string;
    minRating?: string;
    popular?: string;
    discounted?: string;
    new?: string;
    sort?: string;
  }>
): Promise<Metadata> {
  const params = await searchParams;
  const {
    q,
    page,
    categories,
    types,
    tech,
    maxPrice,
    minRating,
    popular,
    discounted,
    new: isNew,
    sort,
  } = params;

  const query = q || "";
  const pageNumber = page || "1";

  // Build URL with all parameters
  const urlParams = new URLSearchParams();
  if (query) urlParams.set("q", query);
  if (pageNumber !== "1") urlParams.set("page", pageNumber);
  if (categories) urlParams.set("categories", categories);
  if (types) urlParams.set("types", types);
  if (tech) urlParams.set("tech", tech);
  if (maxPrice) urlParams.set("maxPrice", maxPrice);
  if (minRating) urlParams.set("minRating", minRating);
  if (popular) urlParams.set("popular", popular);
  if (discounted) urlParams.set("discounted", discounted);
  if (isNew) urlParams.set("new", isNew);
  if (sort) urlParams.set("sort", sort);

  const searchUrl = `${API_CONFIG.ENDPOINTS.base}/search${
    urlParams.toString() ? `?${urlParams.toString()}` : ""
  }`;

  // Build filter description
  const filters: string[] = [];
  if (categories) filters.push(`category: ${categories}`);
  if (types) filters.push(`type: ${types}`);
  if (tech) filters.push(`tech: ${tech}`);
  if (maxPrice) filters.push(`max price: $${maxPrice}`);
  if (minRating) filters.push(`min rating: ${minRating}★`);
  if (popular === "true") filters.push("popular items");
  if (discounted === "true") filters.push("discounted items");
  if (isNew === "true") filters.push("new arrivals");

  if (query || filters.length > 0) {
    try {
      const { fetchProductsBySearch } = await import(
        "@/utils/fetching/FetchProducts"
      );

      const searchOptions = {
        q: query,
        page: pageNumber,
        limit: "10",
        categories,
        types,
        tech,
        maxPrice,
        minRating,
        popular,
        discounted,
        new: isNew,
        sort,
      };

      const { pagination } = await fetchProductsBySearch(searchOptions);
      const resultCount = pagination.total;

      let title = "";
      let description = "";

      if (query && filters.length > 0) {
        title = `Search "${query}" (${filters.join(", ")}) - jelajah Code`;
        description = `Found ${resultCount} result${
          resultCount !== 1 ? "s" : ""
        } for "${query}" with filters: ${filters.join(
          ", "
        )}. Browse and discover products that match your search.`;
      } else if (query) {
        title = `Search Results for "${query}" - jelajah Code`;
        description = `Found ${resultCount} result${
          resultCount !== 1 ? "s" : ""
        } for "${query}" on jelajah Code. Browse and discover products that match your search.`;
      } else {
        title = `Search Products (${filters.join(", ")}) - jelajah Code`;
        description = `Found ${resultCount} product${
          resultCount !== 1 ? "s" : ""
        } matching your filters: ${filters.join(
          ", "
        )}. Browse and discover products on jelajah Code.`;
      }

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: searchUrl,
          siteName: "jelajah Code",
          images: [
            {
              url: "/images/search-og-image.jpg",
              width: 1200,
              height: 630,
              alt: query ? `Search Results for "${query}"` : "Search Products",
            },
          ],
          locale: "en_US",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: ["/images/search-og-image.jpg"],
        },
      };
    } catch {
      // Fallback to default search metadata if fetch fails
      let fallbackTitle = "";
      let fallbackDescription = "";

      if (query && filters.length > 0) {
        fallbackTitle = `Search "${query}" (${filters.join(
          ", "
        )}) - jelajah Code`;
        fallbackDescription = `Search results for "${query}" with filters on jelajah Code platform`;
      } else if (query) {
        fallbackTitle = `Search Results for "${query}" - jelajah Code`;
        fallbackDescription = `Search results for "${query}" on jelajah Code platform`;
      } else {
        fallbackTitle = `Search Products (${filters.join(
          ", "
        )}) - jelajah Code`;
        fallbackDescription = `Search products with filters on jelajah Code platform`;
      }

      return {
        title: fallbackTitle,
        description: fallbackDescription,
        openGraph: {
          title: fallbackTitle,
          description: fallbackDescription,
          url: searchUrl,
          siteName: "jelajah Code",
          images: [
            {
              url: "/images/search-og-image.jpg",
              width: 1200,
              height: 630,
              alt: query ? `Search Results for "${query}"` : "Search Products",
            },
          ],
          locale: "en_US",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: fallbackTitle,
          description: fallbackDescription,
          images: ["/images/search-og-image.jpg"],
        },
      };
    }
  }

  return SearchPageMetadata;
}

//====================================== Products By Category Metadata ======================================//
export async function generateProductsCategoryMetadata(
  params: Promise<{ categoryId: string }>,
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>
): Promise<Metadata> {
  const { categoryId } = await params;
  const searchParamsData = await searchParams;
  const page = searchParamsData.page || "1";
  const sort = searchParamsData.sort || "newest";

  try {
    const { fetchProductsByCategory, fetchProductCategories } = await import(
      "@/utils/fetching/FetchProducts"
    );

    const [{ pagination }, categories] = await Promise.all([
      fetchProductsByCategory(categoryId, parseInt(page, 10), 10, sort),
      fetchProductCategories(),
    ]);

    const category = categories.find((cat) => cat.categoryId === categoryId);
    const categoryTitle = category?.title || categoryId;
    const resultCount = pagination.total;

    const urlParams = new URLSearchParams();
    if (page !== "1") urlParams.set("page", page);
    if (sort !== "newest") urlParams.set("sort", sort);

    const categoryUrl = `${
      API_CONFIG.ENDPOINTS.base
    }/products/category/${categoryId}${
      urlParams.toString() ? `?${urlParams.toString()}` : ""
    }`;

    const title = `Products - ${categoryTitle} - jelajah Code`;
    const description = `Browse ${resultCount} product${
      resultCount !== 1 ? "s" : ""
    } in ${categoryTitle} category on jelajah Code. Discover and explore products that match your interests.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: categoryUrl,
        siteName: "jelajah Code",
        images: [
          {
            url: "/images/products-og-image.jpg",
            width: 1200,
            height: 630,
            alt: `Products - ${categoryTitle}`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/images/products-og-image.jpg"],
      },
    };
  } catch {
    // Fallback metadata if fetch fails
    const categoryUrl = `${API_CONFIG.ENDPOINTS.base}/products/category/${categoryId}`;
    const fallbackTitle = `Products - ${categoryId} - jelajah Code`;
    const fallbackDescription = `Browse products in ${categoryId} category on jelajah Code platform`;

    return {
      title: fallbackTitle,
      description: fallbackDescription,
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url: categoryUrl,
        siteName: "jelajah Code",
        images: [
          {
            url: "/images/products-og-image.jpg",
            width: 1200,
            height: 630,
            alt: `Products - ${categoryId}`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDescription,
        images: ["/images/products-og-image.jpg"],
      },
    };
  }
}

//====================================== Products By Type Metadata ======================================//
export async function generateProductsTypeMetadata(
  params: Promise<{ typeId: string }>,
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>
): Promise<Metadata> {
  const { typeId } = await params;
  const searchParamsData = await searchParams;
  const page = searchParamsData.page || "1";
  const sort = searchParamsData.sort || "newest";

  try {
    const { fetchProductsByType, fetchProductType } = await import(
      "@/utils/fetching/FetchProducts"
    );

    const [{ pagination }, types] = await Promise.all([
      fetchProductsByType(typeId, parseInt(page, 10), 10, sort),
      fetchProductType(),
    ]);

    const type = types.find((t) => t.typeId === typeId);
    const typeTitle = type?.title || typeId;
    const resultCount = pagination.total;

    const urlParams = new URLSearchParams();
    if (page !== "1") urlParams.set("page", page);
    if (sort !== "newest") urlParams.set("sort", sort);

    const typeUrl = `${API_CONFIG.ENDPOINTS.base}/products/type/${typeId}${
      urlParams.toString() ? `?${urlParams.toString()}` : ""
    }`;

    const title = `Products - ${typeTitle} - jelajah Code`;
    const description = `Browse ${resultCount} product${
      resultCount !== 1 ? "s" : ""
    } in ${typeTitle} type on jelajah Code. Discover and explore products that match your interests.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: typeUrl,
        siteName: "jelajah Code",
        images: [
          {
            url: "/images/products-og-image.jpg",
            width: 1200,
            height: 630,
            alt: `Products - ${typeTitle}`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/images/products-og-image.jpg"],
      },
    };
  } catch {
    // Fallback metadata if fetch fails
    const typeUrl = `${API_CONFIG.ENDPOINTS.base}/products/type/${typeId}`;
    const fallbackTitle = `Products - ${typeId} - jelajah Code`;
    const fallbackDescription = `Browse products in ${typeId} type on jelajah Code platform`;

    return {
      title: fallbackTitle,
      description: fallbackDescription,
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url: typeUrl,
        siteName: "jelajah Code",
        images: [
          {
            url: "/images/products-og-image.jpg",
            width: 1200,
            height: 630,
            alt: `Products - ${typeId}`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDescription,
        images: ["/images/products-og-image.jpg"],
      },
    };
  }
}

//====================================== Products By Tags Metadata ======================================//
export async function generateProductsTagsMetadata(
  params: Promise<{ tagsId: string }>,
  searchParams: Promise<{
    page?: string;
    sort?: string;
  }>
): Promise<Metadata> {
  const { tagsId } = await params;
  const searchParamsData = await searchParams;
  const page = searchParamsData.page || "1";
  const sort = searchParamsData.sort || "newest";

  try {
    const { fetchProductsByTags } = await import(
      "@/utils/fetching/FetchProducts"
    );

    const [{ pagination }] = await Promise.all([
      fetchProductsByTags(tagsId, parseInt(page, 10), 10, sort),
    ]);

    const resultCount = pagination.total;

    const urlParams = new URLSearchParams();
    if (page !== "1") urlParams.set("page", page);
    if (sort !== "newest") urlParams.set("sort", sort);

    const tagsUrl = `${API_CONFIG.ENDPOINTS.base}/products/tags/${tagsId}${
      urlParams.toString() ? `?${urlParams.toString()}` : ""
    }`;

    const title = `Products - ${tagsId} - jelajah Code`;
    const description = `Browse ${resultCount} product${
      resultCount !== 1 ? "s" : ""
    } tagged with ${tagsId} on jelajah Code. Discover and explore products that match your interests.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: tagsUrl,
        siteName: "jelajah Code",
        images: [
          {
            url: "/images/products-og-image.jpg",
            width: 1200,
            height: 630,
            alt: `Products - ${tagsId}`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/images/products-og-image.jpg"],
      },
    };
  } catch {
    // Fallback metadata if fetch fails
    const tagsUrl = `${API_CONFIG.ENDPOINTS.base}/products/tags/${tagsId}`;
    const fallbackTitle = `Products - ${tagsId} - jelajah Code`;
    const fallbackDescription = `Browse products tagged with ${tagsId} on jelajah Code platform`;

    return {
      title: fallbackTitle,
      description: fallbackDescription,
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url: tagsUrl,
        siteName: "jelajah Code",
        images: [
          {
            url: "/images/products-og-image.jpg",
            width: 1200,
            height: 630,
            alt: `Products - ${tagsId}`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDescription,
        images: ["/images/products-og-image.jpg"],
      },
    };
  }
}
