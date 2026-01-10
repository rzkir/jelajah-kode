import { fetchArticlesDetailsById } from "@/utils/fetching/FetchArticles"

import ArticlesDetails from "@/components/pages/articles/details/ArticlesDetails"

import { generateArticlesDetailsMetadata } from "@/helper/meta/Metadata"

export async function generateMetadata({ params }: { params: Promise<{ articlesId: string }> }) {
    return generateArticlesDetailsMetadata(params);
}

export default async function Page({ params }: { params: Promise<{ articlesId: string }> }) {
    const { articlesId } = await params;
    const article = await fetchArticlesDetailsById(articlesId);

    return (
        <ArticlesDetails article={article} />
    )
}
