import ProductsLayout from "@/components/dashboard/products/products/ProductsLayout";

import { ProductsPageMetadata } from "@/helper/meta/Metadata";

export const metadata = ProductsPageMetadata;

export default function Page() {
  return <ProductsLayout />;
} 