import { Fragment } from "react";

import Home from "@/components/content/home/Home";

import ProductsDiscount from "@/components/content/products/discount/ProductsDiscount"

import ProductsNews from "@/components/content/products/news-products/ProductsNews";

import ProductsMostSaled from "@/components/content/products/most-saled/ProductsMostSaled";

import Services from "@/components/content/services/Services";

import { fetchProducts, fetchProductsDiscount, fetchProductsMostSaled } from "@/utils/fetching/FetchProducts";

export default async function Page() {
  const products = await fetchProducts();
  const productsDiscount = await fetchProductsDiscount();
  const productsMostSaled = await fetchProductsMostSaled();
  return (
    <Fragment>
      <Home />
      <Services />
      <ProductsDiscount productsDiscount={productsDiscount} />
      <ProductsNews products={products} />
      <ProductsMostSaled productsMostSaled={productsMostSaled} />
    </Fragment>
  )
}