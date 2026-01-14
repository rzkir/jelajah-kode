"use client"

import Link from 'next/link'

import { Share2, ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Badge } from '@/components/ui/badge'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

import { TypographyContent } from '@/components/ui/typography'

import useFormatDate from '@/hooks/FormatDate'

import { useTranslation } from '@/hooks/useTranslation'

import { toast } from 'sonner'

import Image from 'next/image'

function calculateReadTime(content?: string): number {
    if (!content) return 1;
    const words = content.split(/\s+/).length;
    const readTime = Math.ceil(words / 200);
    return readTime || 1;
}

export default function ArticlesDetails({ article }: { article: ArticlesDetails }) {
    const { formatDateArticle } = useFormatDate()
    const readTime = calculateReadTime(article.content)
    const { t } = useTranslation()

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.description,
                url: window.location.href,
            }).catch(() => {
                // User cancelled or error occurred
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    }

    return (
        <section className='min-h-full overflow-visible relative py-4'>
            <div className="container px-4 relative z-10">
                <Link
                    href="/articles"
                    className="inline-flex items-center gap-2 text-sm sm:text-base mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t("articlesDetails.backToArticles")}
                </Link>

                <div className="relative w-full h-full aspect-video rounded-xl overflow-hidden">
                    <Image
                        src={article.thumbnail}
                        alt={article.title}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="max-w-7xl mx-auto mt-6">
                    {/* Article Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 sm:mb-8 leading-tight text-foreground">
                        {article.title}
                    </h1>

                    {/* Author Info, Date, and Reading Time */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 text-muted-foreground">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                                <AvatarImage src={article.author.picture} alt={article.author.name} />
                                <AvatarFallback>
                                    {article.author.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{article.author.name}</span>
                        </div>
                        {article.createdAt && (
                            <span className="text-sm sm:text-base">
                                {formatDateArticle(article.createdAt)}
                            </span>
                        )}
                        <span className="text-sm sm:text-base">
                            {readTime} {t("articles.minRead")}
                        </span>
                    </div>

                    {/* Tags and Share Button */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-10">
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            {article.tags && article.tags.length > 0 && article.tags.map((tag) => (
                                <Badge
                                    key={tag.tagsId}
                                    variant="secondary"
                                    className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium"
                                >
                                    #{tag.title}
                                </Badge>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShare}
                            className="flex items-center gap-2"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {t("articlesDetails.share")}
                            </span>
                        </Button>
                    </div>

                    {/* Article Content */}
                    <div className="prose prose-lg max-w-none">
                        <TypographyContent
                            html={article.content}
                            className="text-foreground"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
