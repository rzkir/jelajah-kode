import { TypographyContent } from '@/components/ui/typography';

import { Badge } from '@/components/ui/badge';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { User, Tag, FolderOpen, FileText } from 'lucide-react';

import Image from 'next/image';

export default function ArticleDetails({ article }: { article: ArticlesDetails }) {
    return (
        <section>
            <div className="container mx-auto">
                {/* Header Section */}
                <div className="mb-8">
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
            </div>
        </section>
    )
}
