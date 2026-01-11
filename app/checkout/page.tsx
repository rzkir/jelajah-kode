import Checkout from '@/components/checkout/Checkout'

import { generateCheckoutMetadata } from '@/helper/meta/Metadata'

export async function generateMetadata({ searchParams }: CheckoutPageProps) {
    return generateCheckoutMetadata(searchParams)
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
    const params = await searchParams;
    const productsParam = params.products || "";

    return (
        <Checkout productsParam={productsParam} />
    )
}