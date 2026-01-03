import { Fragment } from "react";

import Home from "@/components/content/home/Home";

import ProductsDiscount from "@/components/content/discount/ProductsDiscount"

import Products from "@/components/content/products/Products";

import Services from "@/components/content/services/Services";

import { fetchProducts, fetchProductsDiscount } from "@/utils/fetching/FetchProducts";

export default async function Page() {
  // Handle fetch errors gracefully during build time
  let products: Products[] = [];
  let productsDiscount: ProductsDiscountResponse = {
    data: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    },
  };

  // Only attempt to fetch if API URL is configured
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (apiUrl) {
    try {
      products = await fetchProducts();
    } catch (error) {
      // Silently fail during build - API may not be available
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching products:", error);
      }
      products = [];
    }

    try {
      productsDiscount = await fetchProductsDiscount();
    } catch (error) {
      // Silently fail during build - API may not be available
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching products discount:", error);
      }
      productsDiscount = {
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

  return (
    <Fragment>
      <Home />
      <Services />
      <ProductsDiscount productsDiscount={productsDiscount} />
      <Products products={products} />
    </Fragment>
  )
}
