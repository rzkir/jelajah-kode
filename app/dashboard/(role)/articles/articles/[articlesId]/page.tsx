import { fetchArticlesDetailsById } from '@/utils/fetching/FetchArticles';

import { generateArticlesDetailsMetadata } from '@/helper/meta/Metadata';

import ArticleDetails from '@/components/dashboard/articles/details/ArticleDetails';

export async function generateMetadata({ params }: { params: Promise<{ articlesId: string }> }) {
    return generateArticlesDetailsMetadata(params);
}

export default async function ArticleDetailsPage({ params }: { params: Promise<{ articlesId: string }> }) {
    const { articlesId } = await params;
    const article = await fetchArticlesDetailsById(articlesId);

    return (
        <ArticleDetails article={article} />
    );
}
