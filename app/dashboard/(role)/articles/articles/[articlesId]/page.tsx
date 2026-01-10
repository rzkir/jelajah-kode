import { fetchArticlesById } from '@/utils/fetching/FetchArticles';
import { TypographyContent } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, User, Tag, FolderOpen, FileText, Hash } from 'lucide-react';
import Image from 'next/image';

function formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month} ${year} ${hours}:${minutes}`;
}

export async function generateMetadata({ params }: { params: Promise<{ articlesId: string }> }) {
    const { articlesId } = await params;
    try {
        const article = await fetchArticlesById(articlesId);
        return {
            title: `${article.title || 'Article'} | Jelal Kode`,
            description: article.description || `View article ${articlesId} on Jelal Kode platform`,
        };
    } catch {
        return {
            title: `Article ${articlesId} | Jelal Kode`,
            description: `View article details for ${articlesId} on Jelal Kode platform`,
        };
    }
}

export default async function ArticleDetailsPage({ params }: { params: Promise<{ articlesId: string }> }) {
    const { articlesId } = await params;
    const article = await fetchArticlesById(articlesId);

    return (
        <div className="container py-8 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Hash className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground font-mono">ID: {article._id}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground font-mono">Articles ID: {article.articlesId}</span>
                </div>

                <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

                <div className="flex items-center gap-4 mb-4 flex-wrap">
                    <Badge variant={article.status === 'publish' ? 'default' : 'secondary'}>
                        {article.status}
                    </Badge>
                    {article.category && (
                        <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {article.category.title}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail */}
            {article.thumbnail && (
                <div className="mb-8 relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={article.thumbnail}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    />
                </div>
            )}

            {/* Description */}
            {article.description && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Description
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground leading-relaxed">{article.description}</p>
                    </CardContent>
                </Card>
            )}

            {/* Author Information */}
            {article.author && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Author Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={article.author.picture} alt={article.author.name} />
                                <AvatarFallback>
                                    {article.author.name?.charAt(0).toUpperCase() || 'A'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-lg">{article.author.name}</p>
                                <p className="text-sm text-muted-foreground">Role: {article.author.role}</p>
                                {article.author._id && (
                                    <p className="text-xs text-muted-foreground font-mono mt-1">
                                        ID: {article.author._id}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            Tags
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-sm">
                                    {tag.title}
                                    <span className="ml-2 text-xs text-muted-foreground font-mono">
                                        ({tag.tagsId})
                                    </span>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Content */}
            {article.content && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TypographyContent html={article.content} />
                    </CardContent>
                </Card>
            )}

            {/* Metadata */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Metadata
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {article.created_at && (
                            <div>
                                <p className="text-sm font-semibold mb-1">Created At</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(article.created_at)}
                                </p>
                            </div>
                        )}
                        {article.updated_at && (
                            <div>
                                <p className="text-sm font-semibold mb-1">Updated At</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(article.updated_at)}
                                </p>
                            </div>
                        )}
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <div>
                            <p className="text-sm font-semibold mb-1">Database ID</p>
                            <p className="text-xs text-muted-foreground font-mono break-all">
                                {article._id}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold mb-1">Articles ID</p>
                            <p className="text-xs text-muted-foreground font-mono">
                                {article.articlesId}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
