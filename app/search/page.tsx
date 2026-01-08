import SearchProducts from "@/components/content/search/SearchProducts";

import { generateSearchPageMetadata } from "@/helper/meta/Metadata";

import { fetchProductsBySearch, fetchProductCategories, fetchProductType } from "@/utils/fetching/FetchProducts";

export async function generateMetadata({ searchParams }: SearchPageProps) {
    return generateSearchPageMetadata(searchParams);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;

    const searchOptions = {
        q: params.q || "",
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

    const [{ data: products, pagination, query }, categories, types] = await Promise.all([
        fetchProductsBySearch(searchOptions),
        fetchProductCategories(),
        fetchProductType(),
    ]);

    return (
        <SearchProducts
            products={products}
            pagination={pagination}
            query={query}
            page={parseInt(params.page || "1", 10)}
            categories={categories}
            types={types}
            initialFilters={params}
        />
    );
}