import { Suspense } from 'react'

import Checkout from '@/components/checkout/Checkout'

import { generateCheckoutMetadata } from '@/helper/meta/Metadata'

import { Loader2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
    searchParams: Promise<{
        productId?: string
        title?: string
    }>
}

export async function generateMetadata({ searchParams }: PageProps) {
    return generateCheckoutMetadata(searchParams)
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </div>
            }
        >
            <Checkout />
        </Suspense>
    )
}
