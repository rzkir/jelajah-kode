import { Metadata } from "next";

import { fetchProductsById } from "@/utils/fetching/FetchProducts";

import { API_CONFIG } from "@/lib/config";

//====================================== Products Page Metadata ======================================//
export const ProductsPageMetadata: Metadata = {
  title: "Products - jelajah Code",
  description: "Browse and manage products in jelajah Code platform",
  openGraph: {
    title: "Products - jelajah Code",
    description: "Browse and manage products in jelajah Code platform",
    url: `${API_CONFIG.ENDPOINTS.base}`,
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
    description: "Browse and manage products in jelajah Code platform",
    images: ["/images/products-og-image.jpg"],
  },
};

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
