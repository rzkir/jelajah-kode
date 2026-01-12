import { Metadata } from "next";

import { fetchProductsById } from "@/utils/fetching/FetchProducts";

import { API_CONFIG } from "@/lib/config";

//====================================== Home Page Metadata ======================================//
export const HomePageMetadata: Metadata = {
  title: "Jelajah Kode - Temukan Template yang Sesuai",
  description:
    "Mulai langkah awal pengembangan dengan kode sumber siap pakai, template, dan komponen dari pengembang terbaik. Jelajahi 1000+ kode sumber premium di platform Jelajah Kode untuk proyek Anda.",
  openGraph: {
    title: "Jelajah Kode - Temukan Template yang Sesuai untuk Proyek Anda",
    description:
      "Mulai langkah awal pengembangan dengan kode sumber siap pakai, template, dan komponen dari pengembang terbaik. Jelajahi 1000+ kode sumber premium di platform Jelajah Kode.",
    url: `${API_CONFIG.ENDPOINTS.base}`,
    siteName: "Jelajah Kode - Temukan Template yang Sesuai untuk Proyek Anda",
    images: [
      {
        url: "/images/home-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jelajah Kode - Temukan Template yang Sesuai",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jelajah Kode - Temukan Template yang Sesuai",
    description:
      "Mulai langkah awal pengembangan dengan kode sumber siap pakai, template, dan komponen dari pengembang terbaik. Jelajahi 1000+ kode sumber premium di platform Jelajah Kode.",
    images: ["/images/home-og-image.jpg"],
  },
};

//====================================== Products Page Metadata ======================================//
export const ProductsPageMetadata: Metadata = {
  title: "Products - jelajah Code",
  description:
    "Jelajahi 1000+ kode sumber premium di platform Jelajah Kode untuk proyek Anda.",
  openGraph: {
    title: "Products - jelajah Code",
    description:
      "Jelajahi 1000+ kode sumber premium di platform Jelajah Kode untuk proyek Anda.",
    url: `${API_CONFIG.ENDPOINTS.base}/products`,
    siteName: "Jelajah Kode - Temukan Template yang Sesuai untuk Proyek Anda",
    images: [
      {
        url: "/images/products-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jelajah Kode - Temukan Template yang Sesuai untuk Proyek Anda",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Products - jelajah Code",
    description:
      "Jelajahi 1000+ kode sumber premium di platform Jelajah Kode untuk proyek Anda.",
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
    minPrice?: string;
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
    minPrice,
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
  if (minPrice) urlParams.set("minPrice", minPrice);
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
  if (minPrice || maxPrice) {
    if (minPrice && maxPrice) {
      filters.push(`price: $${minPrice} - $${maxPrice}`);
    } else if (minPrice) {
      filters.push(`min price: $${minPrice}`);
    } else if (maxPrice) {
      filters.push(`max price: $${maxPrice}`);
    }
  }
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
        minPrice,
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
    minPrice?: string;
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
    minPrice,
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
  if (minPrice) urlParams.set("minPrice", minPrice);
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
  if (minPrice || maxPrice) {
    if (minPrice && maxPrice) {
      filters.push(`price: $${minPrice} - $${maxPrice}`);
    } else if (minPrice) {
      filters.push(`min price: $${minPrice}`);
    } else if (maxPrice) {
      filters.push(`max price: $${maxPrice}`);
    }
  }
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
        minPrice,
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

//====================================== Articles Page Metadata ======================================//
export const ArticlesPageMetadata: Metadata = {
  title: "Developer Resources - jelajah Code",
  description:
    "Learn from detailed guides, tutorials, and best practices for modern web development on jelajah Code",
  openGraph: {
    title: "Developer Resources - jelajah Code",
    description:
      "Learn from detailed guides, tutorials, and best practices for modern web development on jelajah Code",
    url: `${API_CONFIG.ENDPOINTS.base}/articles`,
    siteName: "jelajah Code",
    images: [
      {
        url: "/images/articles-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "jelajah Code Developer Resources",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Resources - jelajah Code",
    description:
      "Learn from detailed guides, tutorials, and best practices for modern web development on jelajah Code",
    images: ["/images/articles-og-image.jpg"],
  },
};

export async function generateArticlesPageMetadata(
  searchParams?: Promise<{
    category?: string;
    page?: string;
    sort?: string;
  }>
): Promise<Metadata> {
  if (!searchParams) {
    return ArticlesPageMetadata;
  }

  const params = await searchParams;
  const { category, page, sort } = params;

  const pageNumber = page || "1";

  // Build URL with all parameters
  const urlParams = new URLSearchParams();
  if (category) urlParams.set("category", category);
  if (pageNumber !== "1") urlParams.set("page", pageNumber);
  if (sort) urlParams.set("sort", sort);

  const articlesUrl = `${API_CONFIG.ENDPOINTS.base}/articles${
    urlParams.toString() ? `?${urlParams.toString()}` : ""
  }`;

  // Build filter description
  const filters: string[] = [];
  if (category) filters.push(`category: ${category}`);

  if (filters.length > 0) {
    try {
      const { fetchArticles, fetchArticlesCategories } = await import(
        "@/utils/fetching/FetchArticles"
      );

      const [articles, categories] = await Promise.all([
        fetchArticles(),
        fetchArticlesCategories(),
      ]);

      const categoryData = categories.find(
        (cat) => cat.categoryId === category || cat.title === category
      );
      const categoryTitle = categoryData?.title || category;
      const filteredCount = articles.filter((article) => {
        const articleCategory = article.category;
        if (!articleCategory) return false;
        return (
          articleCategory.categoryId === category ||
          articleCategory.title === category
        );
      }).length;

      const title = `Developer Resources - ${categoryTitle} - jelajah Code`;
      const description = `Browse ${filteredCount} article${
        filteredCount !== 1 ? "s" : ""
      } in ${categoryTitle} category. Learn from detailed guides, tutorials, and best practices for modern web development.`;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: articlesUrl,
          siteName: "jelajah Code",
          images: [
            {
              url: "/images/articles-og-image.jpg",
              width: 1200,
              height: 630,
              alt: `Developer Resources - ${categoryTitle}`,
            },
          ],
          locale: "en_US",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: ["/images/articles-og-image.jpg"],
        },
      };
    } catch {
      // Fallback to default articles metadata if fetch fails
      const fallbackTitle = `Developer Resources - ${
        category || ""
      } - jelajah Code`;
      const fallbackDescription = `Browse articles${
        category ? ` in ${category} category` : ""
      } on jelajah Code platform`;

      return {
        title: fallbackTitle,
        description: fallbackDescription,
        openGraph: {
          title: fallbackTitle,
          description: fallbackDescription,
          url: articlesUrl,
          siteName: "jelajah Code",
          images: [
            {
              url: "/images/articles-og-image.jpg",
              width: 1200,
              height: 630,
              alt: `Developer Resources${category ? ` - ${category}` : ""}`,
            },
          ],
          locale: "en_US",
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: fallbackTitle,
          description: fallbackDescription,
          images: ["/images/articles-og-image.jpg"],
        },
      };
    }
  }

  return ArticlesPageMetadata;
}

//====================================== Articles By Category Metadata ======================================//
export async function generateArticlesCategoryMetadata(
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
    const { fetchArticlesByCategory, fetchArticlesCategories } = await import(
      "@/utils/fetching/FetchArticles"
    );

    const [{ pagination }, categories] = await Promise.all([
      fetchArticlesByCategory(categoryId, parseInt(page, 10), 10, sort),
      fetchArticlesCategories(),
    ]);

    const category = categories.find((cat) => cat.categoryId === categoryId);
    const categoryTitle = category?.title || categoryId;
    const resultCount = pagination.total;

    const urlParams = new URLSearchParams();
    if (page !== "1") urlParams.set("page", page);
    if (sort !== "newest") urlParams.set("sort", sort);

    const categoryUrl = `${
      API_CONFIG.ENDPOINTS.base
    }/articles/categories/${categoryId}${
      urlParams.toString() ? `?${urlParams.toString()}` : ""
    }`;

    const title = `Developer Resources - ${categoryTitle} - jelajah Code`;
    const description = `Browse ${resultCount} article${
      resultCount !== 1 ? "s" : ""
    } in ${categoryTitle} category on jelajah Code. Learn from detailed guides, tutorials, and best practices for modern web development.`;

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
            url: "/images/articles-og-image.jpg",
            width: 1200,
            height: 630,
            alt: `Developer Resources - ${categoryTitle}`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/images/articles-og-image.jpg"],
      },
    };
  } catch {
    // Fallback metadata if fetch fails
    const categoryUrl = `${API_CONFIG.ENDPOINTS.base}/articles/categories/${categoryId}`;
    const fallbackTitle = `Developer Resources - ${categoryId} - jelajah Code`;
    const fallbackDescription = `Browse articles in ${categoryId} category on jelajah Code platform`;

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
            url: "/images/articles-og-image.jpg",
            width: 1200,
            height: 630,
            alt: `Developer Resources - ${categoryId}`,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDescription,
        images: ["/images/articles-og-image.jpg"],
      },
    };
  }
}

//====================================== Articles Details Metadata ======================================//
export async function generateArticlesDetailsMetadata(
  params: Promise<{ articlesId: string }>
): Promise<Metadata> {
  const { articlesId } = await params;

  try {
    const { fetchArticlesById } = await import(
      "@/utils/fetching/FetchArticles"
    );

    const article = await fetchArticlesById(articlesId);
    const title = article.title;
    const description = article.description;
    const thumbnail = article.thumbnail;
    const url = `${API_CONFIG.ENDPOINTS.base}/articles/${articlesId}`;

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
        type: "article",
        authors: article.author?.name ? [article.author.name] : undefined,
        publishedTime: article.createdAt,
        modifiedTime: article.updatedAt,
        tags: article.tags?.map((tag) => tag.title) || [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} - jelajah Code`,
        description: description,
        images: [thumbnail],
      },
    };
  } catch {
    // Fallback metadata if article fetch fails
    return {
      title: `Article ${articlesId} - jelajah Code`,
      description: `View article details for ${articlesId} on jelajah Code platform`,
      openGraph: {
        title: `Article ${articlesId} - jelajah Code`,
        description: `View article details for ${articlesId} on jelajah Code platform`,
        url: `${API_CONFIG.ENDPOINTS.base}/articles/${articlesId}`,
        siteName: "jelajah Code",
        images: [
          {
            url: "/images/articles-default-og-image.jpg",
            width: 1200,
            height: 630,
            alt: `Article ${articlesId}`,
          },
        ],
        locale: "en_US",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `Article ${articlesId} - jelajah Code`,
        description: `View article details for ${articlesId} on jelajah Code platform`,
        images: ["/images/articles-default-og-image.jpg"],
      },
    };
  }
}

//====================================== Profile Page Metadata ======================================//
export const ProfilePageMetadata: Metadata = {
  title: "Profile - jelajah Code",
  description:
    "Manage your profile, view transactions, and update your account settings on jelajah Code",
  openGraph: {
    title: "Profile - jelajah Code",
    description:
      "Manage your profile, view transactions, and update your account settings on jelajah Code",
    url: `${API_CONFIG.ENDPOINTS.base}/profile`,
    siteName: "jelajah Code",
    images: [
      {
        url: "/images/profile-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Profile - jelajah Code",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile - jelajah Code",
    description:
      "Manage your profile, view transactions, and update your account settings on jelajah Code",
    images: ["/images/profile-og-image.jpg"],
  },
};

export async function generateProfileMetadata(): Promise<Metadata> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token && API_CONFIG.ENDPOINTS.me) {
      try {
        // Fetch user data from backend API
        const userResponse = await fetch(API_CONFIG.ENDPOINTS.me, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `token=${token}`,
          },
          cache: "no-store",
        }).catch(() => null);

        if (userResponse?.ok) {
          const userData = await userResponse.json();
          const userName = userData.name || "User";
          const userPicture =
            userData.picture || "/images/profile-og-image.jpg";
          const title = `${userName}'s Profile - jelajah Code`;
          const description = `Manage ${userName}'s profile, view transactions, and update account settings on jelajah Code`;

          return {
            title,
            description,
            openGraph: {
              title,
              description,
              url: `${API_CONFIG.ENDPOINTS.base}/profile`,
              siteName: "jelajah Code",
              images: [
                {
                  url: userPicture,
                  width: 1200,
                  height: 630,
                  alt: `${userName}'s Profile`,
                },
              ],
              locale: "en_US",
              type: "profile",
            },
            twitter: {
              card: "summary_large_image",
              title,
              description,
              images: [userPicture],
            },
          };
        }
      } catch {
        // If fetch fails, fallback to default
      }
    }
  } catch {
    // Fallback to default metadata if fetch fails
  }

  return ProfilePageMetadata;
}

//====================================== Order Details Metadata ======================================//
export const OrderDetailsPageMetadata: Metadata = {
  title: "Order Details - jelajah Code",
  description:
    "View your order details, transaction status, and download purchased products on jelajah Code",
  openGraph: {
    title: "Order Details - jelajah Code",
    description:
      "View your order details, transaction status, and download purchased products on jelajah Code",
    url: `${API_CONFIG.ENDPOINTS.base}/profile`,
    siteName: "jelajah Code",
    images: [
      {
        url: "/images/profile-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Order Details - jelajah Code",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Order Details - jelajah Code",
    description:
      "View your order details, transaction status, and download purchased products on jelajah Code",
    images: ["/images/profile-og-image.jpg"],
  },
};

export async function generateOrderDetailsMetadata(
  params: Promise<{ order_id: string }>
): Promise<Metadata> {
  const { order_id } = await params;

  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        // Fetch transaction data from backend API via proxy
        const transactionResponse = await fetch(
          `${API_CONFIG.ENDPOINTS.transactions}?order_id=${order_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Cookie: `token=${token}`,
            },
            cache: "no-store",
          }
        ).catch(() => null);

        if (transactionResponse?.ok) {
          const transactionData = await transactionResponse.json();

          if (transactionData && transactionData.products) {
            const productTitles =
              transactionData.products
                .map((p: { title: string }) => p.title)
                .slice(0, 3)
                .join(", ") || "Products";
            const productCount = transactionData.products.length;
            const status = transactionData.status || "pending";
            const statusCapitalized =
              status.charAt(0).toUpperCase() + status.slice(1);
            const thumbnail =
              transactionData.products[0]?.thumbnail ||
              "/images/profile-og-image.jpg";

            const title = `Order ${order_id} - ${statusCapitalized} - jelajah Code`;
            const description = `View order details for ${productCount} product${
              productCount !== 1 ? "s" : ""
            }: ${productTitles}${
              productCount > 3 ? "..." : ""
            }. Status: ${statusCapitalized}. Total: Rp ${
              transactionData.total_amount?.toLocaleString("id-ID") || "0"
            }`;

            return {
              title,
              description,
              openGraph: {
                title,
                description,
                url: `${API_CONFIG.ENDPOINTS.base}/profile/${order_id}`,
                siteName: "jelajah Code",
                images: [
                  {
                    url: thumbnail,
                    width: 1200,
                    height: 630,
                    alt: `Order ${order_id}`,
                  },
                ],
                locale: "en_US",
                type: "website",
              },
              twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [thumbnail],
              },
            };
          }
        }
      } catch {
        // If fetch fails, fallback to default
      }
    }
  } catch {
    // Fallback to default metadata if fetch fails
  }

  // Fallback metadata
  return {
    title: `Order ${order_id} - jelajah Code`,
    description: `View order details for order ${order_id} on jelajah Code platform`,
    openGraph: {
      title: `Order ${order_id} - jelajah Code`,
      description: `View order details for order ${order_id} on jelajah Code platform`,
      url: `${API_CONFIG.ENDPOINTS.base}/profile/${order_id}`,
      siteName: "jelajah Code",
      images: [
        {
          url: "/images/profile-og-image.jpg",
          width: 1200,
          height: 630,
          alt: `Order ${order_id}`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Order ${order_id} - jelajah Code`,
      description: `View order details for order ${order_id} on jelajah Code platform`,
      images: ["/images/profile-og-image.jpg"],
    },
  };
}

//====================================== Privacy Policy Metadata ======================================//
export const PrivacyPolicyMetadata: Metadata = {
  title: "Privacy Policy - jelajah Code",
  description:
    "Learn about how jelajah Code collects, uses, and protects your personal data. Read our comprehensive privacy policy to understand your rights and our data protection practices.",
  openGraph: {
    title: "Privacy Policy - jelajah Code",
    description:
      "Learn about how jelajah Code collects, uses, and protects your personal data. Read our comprehensive privacy policy to understand your rights and our data protection practices.",
    url: `${API_CONFIG.ENDPOINTS.base}/privacy-policy`,
    siteName: "jelajah Code",
    images: [
      {
        url: "/images/privacy-policy-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Privacy Policy - jelajah Code",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - jelajah Code",
    description:
      "Learn about how jelajah Code collects, uses, and protects your personal data. Read our comprehensive privacy policy to understand your rights and our data protection practices.",
    images: ["/images/privacy-policy-og-image.jpg"],
  },
};

//====================================== Refund Policy Metadata ======================================//
export const RefundPolicyMetadata: Metadata = {
  title: "Refund Policy - jelajah Code",
  description:
    "Learn about jelajah Code's refund policy, eligibility requirements, and refund process. Understand your rights when requesting a refund for purchased products.",
  openGraph: {
    title: "Refund Policy - jelajah Code",
    description:
      "Learn about jelajah Code's refund policy, eligibility requirements, and refund process. Understand your rights when requesting a refund for purchased products.",
    url: `${API_CONFIG.ENDPOINTS.base}/refund-policy`,
    siteName: "jelajah Code",
    images: [
      {
        url: "/images/refund-policy-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Refund Policy - jelajah Code",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy - jelajah Code",
    description:
      "Learn about jelajah Code's refund policy, eligibility requirements, and refund process. Understand your rights when requesting a refund for purchased products.",
    images: ["/images/refund-policy-og-image.jpg"],
  },
};

//====================================== Terms of Service Metadata ======================================//
export const TermsOfServiceMetadata: Metadata = {
  title: "Terms of Service - jelajah Code",
  description:
    "Read jelajah Code's terms of service to understand the rules and regulations for using our platform. Learn about your rights and responsibilities as a user.",
  openGraph: {
    title: "Terms of Service - jelajah Code",
    description:
      "Read jelajah Code's terms of service to understand the rules and regulations for using our platform. Learn about your rights and responsibilities as a user.",
    url: `${API_CONFIG.ENDPOINTS.base}/terms-of-service`,
    siteName: "jelajah Code",
    images: [
      {
        url: "/images/terms-of-service-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Terms of Service - jelajah Code",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service - jelajah Code",
    description:
      "Read jelajah Code's terms of service to understand the rules and regulations for using our platform. Learn about your rights and responsibilities as a user.",
    images: ["/images/terms-of-service-og-image.jpg"],
  },
};

//====================================== License Agreement Metadata ======================================//
export const LicenseAgreementMetadata: Metadata = {
  title: "License Agreement - jelajah Code",
  description:
    "Understand the license agreement for using jelajah Code's source code products. Learn about permitted usage, restrictions, and intellectual property rights.",
  openGraph: {
    title: "License Agreement - jelajah Code",
    description:
      "Understand the license agreement for using jelajah Code's source code products. Learn about permitted usage, restrictions, and intellectual property rights.",
    url: `${API_CONFIG.ENDPOINTS.base}/license-agreement`,
    siteName: "jelajah Code",
    images: [
      {
        url: "/images/license-agreement-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "License Agreement - jelajah Code",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "License Agreement - jelajah Code",
    description:
      "Understand the license agreement for using jelajah Code's source code products. Learn about permitted usage, restrictions, and intellectual property rights.",
    images: ["/images/license-agreement-og-image.jpg"],
  },
};
