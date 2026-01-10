import { generateProductsPageMetadata } from "@/helper/meta/Metadata"

import Products from "@/components/content/products/products/Products"

import { fetchProductsBySearch, fetchProductCategories, fetchProductType } from "@/utils/fetching/FetchProducts"

export async function generateMetadata({ searchParams }: ProductsPageProps) {
    return generateProductsPageMetadata(searchParams);
}

interface ProductsPageProps {
    searchParams: Promise<{
        q?: string;
        page?: string;
        categories?: string;
        types?: string;
        tech?: string;
        minPrice?: string;
        maxPrice?: string;
        minRating?: string;
        popular?: string;
        discounted?: string;
        new?: string;
        sort?: string;
    }>;
}

export default async function Page({ searchParams }: ProductsPageProps) {
    const params = await searchParams;

    const searchOptions = {
        q: params.q || "",
        page: params.page || "1",
        limit: "10",
        categories: params.categories,
        types: params.types,
        tech: params.tech,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        minRating: params.minRating,
        popular: params.popular,
        discounted: params.discounted,
        new: params.new,
        sort: params.sort,
    };

    const [{ data: products, pagination }, categories, types] = await Promise.all([
        fetchProductsBySearch(searchOptions),
        fetchProductCategories(),
        fetchProductType(),
    ]);

    return (
        <Products
            products={products}
            pagination={pagination}
            categories={categories}
            types={types}
            initialFilters={params}
            page={parseInt(params.page || "1", 10)}
        />
    );
}
