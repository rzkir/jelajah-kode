import { ProductsEditMetadata } from "@/helper/meta/Metadata";

import { Suspense } from "react";

import EditProductForm from "@/components/dashboard/products/products/edit/EditProductForm";

export const metadata = ProductsEditMetadata;

export default function EditProductPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <EditProductForm />
    </Suspense>
  );
}
