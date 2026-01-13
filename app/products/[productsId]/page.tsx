import ProductsDetails from "@/components/pages/products/products-details/ProductsDetails"

import { generateProductsDetailsMetadata } from "@/helper/meta/Metadata"

import { fetchProductsById } from "@/utils/fetching/FetchProducts"

interface PageProps {
    params: Promise<{
        productsId: string
    }>
}

export async function generateMetadata({ params }: PageProps) {
    return generateProductsDetailsMetadata(params)
}

export default async function Page({ params }: PageProps) {
    const { productsId } = await params
    const product = await fetchProductsById(productsId)

    return (
        <ProductsDetails product={product} />
    )
}
