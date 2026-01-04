import React from 'react'

import Image from 'next/image'

export default function Discount({ productsDiscount }: { productsDiscount: ProductsDiscountResponse }) {
    return (
        <section className="py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Discount</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsDiscount.data.map((product) => (
                    <div key={product._id}>
                        <Image src={product.thumbnail} alt={product.title} width={300} height={300} />
                        <h3 className="text-lg font-bold">{product.title}</h3>
                    </div>
                ))}
            </div>
        </section>
    )
}
