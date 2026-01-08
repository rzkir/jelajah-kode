import { ProductsPageMetadata } from "@/helper/meta/Metadata"

import Products from "@/components/content/products/products/Products"

import { fetchProductsBySearch, fetchProductCategories, fetchProductType } from "@/utils/fetching/FetchProducts"

export const metadata = ProductsPageMetadata

interface ProductsPageProps {
    searchParams: Promise<{
        page?: string;
        categories?: string;
        types?: string;
        tech?: string;
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
        q: "", // No search query for products page
        page: params.page || "1",
        limit: "10",
        categories: params.categories,
        types: params.types,
        tech: params.tech,
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
