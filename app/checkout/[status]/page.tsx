import { Suspense } from 'react'

import CheckoutSuccess from '@/components/checkout/CheckoutSuccess'

import { generateCheckoutStatusMetadata } from '@/helper/meta/Metadata'

import { Loader2 } from 'lucide-react'

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
        <Suspense
            fallback={
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </div>
            }
        >
            <CheckoutSuccess status={params.status} />
        </Suspense>
    )
}

