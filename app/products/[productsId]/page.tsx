import ProductsDetails from "@/components/content/products/productsDetails/ProductsDetails"

import { fetchProductsById } from "@/utils/fetching/FetchProducts"

interface PageProps {
    params: Promise<{
        productsId: string
    }>
}

export default async function Page({ params }: PageProps) {
    const { productsId } = await params;
    const product = await fetchProductsById(productsId);

    return (
        <ProductsDetails product={product} />
    )
}
