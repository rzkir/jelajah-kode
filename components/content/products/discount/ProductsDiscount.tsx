"use client"

import ProductsCard from "@/components/ui/products/ProductsCard"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { useStateProductsDiscount } from "@/components/content/products/discount/lib/useStateProductsDiscount"

import { CountdownTimer } from "@/components/content/products/discount/CountdownTimer"

import { useTranslation } from "@/hooks/useTranslation"

export default function ProductsDiscount({ productsDiscount }: { productsDiscount: ProductsDiscountResponse }) {
    const { productsArray, earliestEndDate, mounted, timeLeft } = useStateProductsDiscount(productsDiscount);
    const { t } = useTranslation();

    return (
        <section>
            <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    {/* Heading */}
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight" suppressHydrationWarning>{t("products.discount.title")}</h2>
                        <p className="text-muted-foreground text-lg" suppressHydrationWarning>{t("products.discount.description")}</p>
                    </div>

                    {/* Countdowns */}
                    {earliestEndDate ? (
                        <CountdownTimer mounted={mounted} timeLeft={timeLeft} />
                    ) : (
                        <div className="flex flex-row items-center gap-3 px-4 py-2 rounded-lg bg-muted border">
                            <h3 className="text-sm font-medium text-muted-foreground" suppressHydrationWarning>{t("products.discount.noActiveDiscounts")}</h3>
                        </div>
                    )}
                </div>

                {/* Products Row */}
                <div className="w-full overflow-y-hidden relative">
                    <ScrollArea className="w-full">
                        <div
                            className="flex flex-row gap-4"
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {productsArray.map((item, idx) => (
                                <div key={idx} className="shrink-0 w-96">
                                    <ProductsCard item={item} />
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            </div>
        </section>
    )
}