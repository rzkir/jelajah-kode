"use client"

import ProductsCard from "@/components/ui/products/ProductsCard"

import { useTranslation } from "@/hooks/useTranslation"

export default function ProductsNews({ products }: { products: Products[] }) {
    const productsArray = Array.isArray(products) ? products : [];
    const { t } = useTranslation();

    return (
        <section>
            <div className="container mx-auto space-y-6 px-2 md:px-4 py-4 md:py-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight" suppressHydrationWarning>{t("products.newest.title")}</h2>
                        <p className="text-muted-foreground text-lg" suppressHydrationWarning>{t("products.newest.description")}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {
                        productsArray.map((item, idx) => (
                            <ProductsCard key={idx} item={item} />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}