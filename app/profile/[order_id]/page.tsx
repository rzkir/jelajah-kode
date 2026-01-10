import OrderDetails from '@/components/pages/profile/order/OrderDetails'

import { generateOrderDetailsMetadata } from '@/helper/meta/Metadata'

export async function generateMetadata({ params }: { params: Promise<{ order_id: string }> }) {
    return generateOrderDetailsMetadata(params);
}

export default function page() {
    return (
        <OrderDetails />
    )
}
