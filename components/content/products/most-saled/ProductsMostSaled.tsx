"use client"

import ProductsCard from "@/components/ui/products/ProductsCard"

export default function ProductsMostSaled({ productsMostSaled }: { productsMostSaled: ProductsMostSaledResponse }) {
    const productsArray = Array.isArray(productsMostSaled.data) ? productsMostSaled.data : [];

    return (
        <section className="py-10">
            <div className="container mx-auto space-y-6 px-4 xl:px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Most Saled Products</h2>
                        <p className="text-muted-foreground text-lg">Browse our most saled products</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {productsArray.map((item, idx) => (
                        <ProductsCard key={idx} item={item} />
                    ))}
                </div>
            </div>
        </section>
    )
}