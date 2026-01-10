"use client"

import { Card, CardTitle, CardContent } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import Link from "next/link"

import { ArrowRight, Clock } from "lucide-react"

import Image from "next/image"

import useFormatDate from "@/hooks/FormatDate"

interface ArticlesCardProps {
    item: {
        articlesId: string;
        title: string;
        thumbnail: string;
        description: string;
        content?: string;
        category: {
            title: string;
            categoryId: string;
        };
        tags?: Array<{
            title: string;
            tagsId: string;
        }>;
        author: {
            name: string;
            picture?: string;
        };
        createdAt?: string;
        created_at?: string;
    };
    href?: string;
    className?: string;
}

// Calculate read time based on content/description length (average reading speed: 200 words per minute)
function calculateReadTime(content?: string, description?: string): number {
    const text = content || description || "";
    if (!text) return 1; // Default 1 minute if no text
    const words = text.split(/\s+/).length;
    const readTime = Math.ceil(words / 200);
    return readTime || 1; // Minimum 1 minute
}

export default function ArticlesCard({
    item,
    href,
    className = ""
}: ArticlesCardProps) {
    const { formatDateArticle } = useFormatDate();
    const readTime = calculateReadTime(item.content, item.description);
    const articleHref = href || `/articles/${item.articlesId}`;

    return (
        <Link href={articleHref} className={`group ${className}`}>
            <Card className="p-0 overflow-hidden h-full transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/50">
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        loading="lazy"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3 z-10">
                        <Badge
                            variant="secondary"
                            className="text-sm font-bold px-3 py-1 shadow-lg"
                        >
                            {item.category.title}
                        </Badge>
                    </div>
                </div>

                <CardContent className="-mt-7 p-6 space-y-4">
                    {/* Read Time */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{readTime} min read</span>
                    </div>

                    {/* Title */}
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                    </CardTitle>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.description}
                    </p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {item.tags.slice(0, 3).map((tag, tagIdx) => (
                                <Badge
                                    key={tagIdx}
                                    variant="outline"
                                    className="text-xs px-2 py-1"
                                >
                                    #{tag.title}
                                </Badge>
                            ))}
                            {item.tags.length > 3 && (
                                <Badge
                                    variant="outline"
                                    className="text-xs px-2 py-1"
                                >
                                    +{item.tags.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Author and Date */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{item.author.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                                {formatDateArticle(item.createdAt || item.created_at)}
                            </span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

