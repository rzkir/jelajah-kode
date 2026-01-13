import { generateProductsTypeMetadata } from "@/helper/meta/Metadata";

import Products from "@/components/pages/products/products/Products";

import {
    fetchProductsByType,
    fetchProductCategories,
    fetchProductType,
} from "@/utils/fetching/FetchProducts";

export async function generateMetadata({
    params,
    searchParams,
}: ProductsTypePageProps) {
    return generateProductsTypeMetadata(params, searchParams);
}

export default async function Page({
    params,
    searchParams,
}: ProductsTypePageProps) {
    const { typeId } = await params;
    const searchParamsData = await searchParams;

    const page = parseInt(searchParamsData.page || "1", 10);
    const limit = 10;
    const sort = searchParamsData.sort || "newest";

    const [{ data: products, pagination }, categories, types] =
        await Promise.all([
            fetchProductsByType(typeId, page, limit, sort),
            fetchProductCategories(),
            fetchProductType(),
        ]);

    const formattedProducts: ProductsSearchItem[] = products.map((product) => ({
        _id: product._id,
        productsId: product.productsId,
        title: product.title,
        thumbnail: product.thumbnail,
        frameworks: product.frameworks,
        price: product.price,
        stock: product.stock,
        downloadCount: product.downloadCount,
        ratingCount: product.ratingCount,
        ratingAverage: product.ratingAverage,
        category: product.category,
        type: product.type,
        discount: product.discount
            ? {
                type: product.discount.type,
                value: product.discount.value,
                until: product.discount.until || "",
            }
            : undefined,
        author: product.author,
        paymentType: product.paymentType,
        status: product.status,
        created_at: product.created_at,
        updated_at: product.updated_at,
    }));

    return (
        <Products
            products={formattedProducts}
            pagination={pagination}
            categories={categories}
            types={types}
            initialFilters={{
                types: typeId,
                page: page.toString(),
                sort,
            }}
            page={page}
        />
    );
}

