import Articles from "@/components/content/articles/articles/Articles";

import { fetchArticlesByCategory, fetchArticlesCategories } from "@/utils/fetching/FetchArticles";

import { generateArticlesCategoryMetadata } from "@/helper/meta/Metadata";

export async function generateMetadata({
    params,
    searchParams,
}: ArticlesCategoryPageProps) {
    return generateArticlesCategoryMetadata(params, searchParams);
}

export default async function Page({
    params,
    searchParams,
}: ArticlesCategoryPageProps) {
    const { categoryId } = await params;
    const searchParamsData = await searchParams;

    const page = parseInt(searchParamsData.page || "1", 10);
    const limit = 10;
    const sort = searchParamsData.sort || "newest";

    const [{ data: articles, pagination }, categories] = await Promise.all([
        fetchArticlesByCategory(categoryId, page, limit, sort),
        fetchArticlesCategories(),
    ]);

    return (
        <Articles
            articles={articles}
            categories={categories}
            pagination={pagination}
            initialFilters={{
                category: categoryId,
                page: page.toString(),
                sort,
            }}
            page={page}
        />
    );
}
