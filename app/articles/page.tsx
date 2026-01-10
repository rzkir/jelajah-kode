import { fetchArticles, fetchArticlesCategories } from "@/utils/fetching/FetchArticles"

import Articles from "@/components/pages/articles/articles/Articles"

import { generateArticlesPageMetadata } from "@/helper/meta/Metadata"

export async function generateMetadata({ searchParams }: ArticlesPageProps) {
    return generateArticlesPageMetadata(searchParams);
}

export default async function page({ searchParams }: ArticlesPageProps) {
    const params = await searchParams;
    const [articles, categories] = await Promise.all([
        fetchArticles(),
        fetchArticlesCategories(),
    ]);
    return (
        <Articles
            articles={articles}
            categories={categories}
            initialFilters={params}
            page={params?.page ? parseInt(params.page, 10) : 1}
        />
    )
}
