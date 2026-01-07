import CheckoutSuccess from '@/components/checkout/CheckoutSuccess'

import { generateCheckoutStatusMetadata } from '@/helper/meta/Metadata'

interface PageProps {
    params: Promise<{
        status: string
        title?: string
    }>
}

export async function generateMetadata({ params }: PageProps) {
    return generateCheckoutStatusMetadata(params)
}

export default function CheckoutStatusPage({ params }: { params: { status: string } }) {
    return (
        <CheckoutSuccess status={params.status} />
    )
}