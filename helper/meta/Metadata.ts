import { Metadata } from "next";

export const ProductsPageMetadata: Metadata = {
  title: "Products - jelajah Code",
  description: "Browse and manage products in jelajah Code platform",
  openGraph: {
    title: "Products - jelajah Code",
    description: "Browse and manage products in jelajah Code platform",
    url: "https://jelajah-code.com/products",
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

export const ProductsCreateMetadata: Metadata = {
  title: "Add New Product - jelajah Code",
  description: "Create and add new products to your jelajah Code platform",
  openGraph: {
    title: "Add New Product - jelajah Code",
    description: "Create and add new products to your jelajah Code platform",
    url: "https://jelajah-code.com/products/new",
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

export const ProductsEditMetadata: Metadata = {
  title: "Edit Product - jelajah Code",
  description: "Edit and update product details in your jelajah Code platform",
  openGraph: {
    title: "Edit Product - jelajah Code",
    description:
      "Edit and update product details in your jelajah Code platform",
    url: "https://jelajah-code.com/products/edit",
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
