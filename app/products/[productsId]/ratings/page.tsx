import RatingsDetails from '@/components/pages/products/ratings/RatingsDetails'

import { generateProductsRatingsMetadata } from '@/helper/meta/Metadata'

interface PageProps {
    params: Promise<{
        productsId: string
    }>
}

export async function generateMetadata({ params }: PageProps) {
    return generateProductsRatingsMetadata(params)
}

export default function Page() {
    return (
        <RatingsDetails />
    )
}
