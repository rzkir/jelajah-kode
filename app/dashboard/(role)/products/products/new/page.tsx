import { Suspense } from "react";

import { ProductsCreateMetadata } from "@/helper/meta/Metadata";

import NewProductForm from "@/components/dashboard/products/NewProductForm";

export const metadata = ProductsCreateMetadata;

export default function NewProductPage() {
    return (
        <Suspense fallback={<div className="container flex items-center justify-center h-64">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>}>
            <NewProductForm />
        </Suspense>
    );
}