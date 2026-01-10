import React from 'react';

import { processImageUrls } from '@/lib/utils';

export function TypographyH1({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <h1 className={`scroll-m-20 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight md:leading-tight lg:leading-tight text-balance mb-6 sm:mb-8 md:mb-10 px-4 sm:px-6 md:px-8 max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto ${className}`}>
            {children}
        </h1>
    )
}

export function TypographyH2({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <h2 className={`scroll-m-20 border-b border-border/40 pb-3 sm:pb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight sm:leading-tight md:leading-tight first:mt-0 mt-8 sm:mt-10 md:mt-12 mb-4 sm:mb-6 md:mb-8 px-4 sm:px-6 md:px-8 max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl ${className}`}>
            {children}
        </h2>
    )
}

export function TypographyH3({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <h3 className={`scroll-m-20 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-snug sm:leading-snug md:leading-snug mt-6 sm:mt-8 md:mt-10 mb-3 sm:mb-4 md:mb-6 px-4 sm:px-6 md:px-8 max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl ${className}`}>
            {children}
        </h3>
    )
}

export function TypographyH4({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <h4 className={`scroll-m-20 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight leading-snug sm:leading-snug md:leading-snug mt-5 sm:mt-6 md:mt-8 mb-2 sm:mb-3 md:mb-4 px-4 sm:px-6 md:px-8 max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl ${className}`}>
            {children}
        </h4>
    )
}

export function TypographyP({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <p className={`leading-relaxed sm:leading-relaxed md:leading-relaxed text-base sm:text-lg md:text-lg not-first:mt-4 sm:not-first:mt-6 md:not-first:mt-8 mb-4 sm:mb-5 md:mb-6 px-4 sm:px-6 md:px-8 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl text-foreground/90 ${className}`}>
            {children}
        </p>
    )
}

export function TypographyBlockquote({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <blockquote className={`mt-6 sm:mt-8 md:mt-10 mb-6 sm:mb-8 md:mb-10 border-l-4 border-primary/50 pl-4 sm:pl-6 md:pl-8 italic text-base sm:text-lg md:text-xl leading-relaxed sm:leading-relaxed md:leading-relaxed text-foreground/80 bg-muted/30 py-3 sm:py-4 md:py-5 px-4 sm:px-6 md:px-8 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-r-lg ${className}`}>
            {children}
        </blockquote>
    )
}

export function TypographyTable() {
    return (
        <div className="my-6 sm:my-8 md:my-10 w-full overflow-x-auto px-4 sm:px-6 md:px-8">
            <div className="min-w-full inline-block">
                <table className="w-full border-collapse border border-border rounded-lg overflow-hidden shadow-sm">
                    <thead>
                        <tr className="bg-muted/50 border-b border-border">
                            <th className="border border-border px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left font-bold text-sm sm:text-base md:text-lg [[align=center]]:text-center [[align=right]]:text-right">
                            </th>
                            <th className="border border-border px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left font-bold text-sm sm:text-base md:text-lg [[align=center]]:text-center [[align=right]]:text-right">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="even:bg-muted/20 hover:bg-muted/30 transition-colors">
                            <td className="border border-border px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-sm sm:text-base [[align=center]]:text-center [[align=right]]:text-right">
                            </td>
                            <td className="border border-border px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-sm sm:text-base [[align=center]]:text-center [[align=right]]:text-right">
                            </td>
                        </tr>
                        <tr className="even:bg-muted/20 hover:bg-muted/30 transition-colors">
                            <td className="border border-border px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-sm sm:text-base [[align=center]]:text-center [[align=right]]:text-right">
                            </td>
                            <td className="border border-border px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-sm sm:text-base [[align=center]]:text-center [[align=right]]:text-right">
                            </td>
                        </tr>
                        <tr className="even:bg-muted/20 hover:bg-muted/30 transition-colors">
                            <td className="border border-border px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-sm sm:text-base [[align=center]]:text-center [[align=right]]:text-right">
                            </td>
                            <td className="border border-border px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-sm sm:text-base [[align=center]]:text-center [[align=right]]:text-right">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export function TypographyList({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <ul className={`my-6 sm:my-8 md:my-10 ml-4 sm:ml-6 md:ml-8 list-disc space-y-2 sm:space-y-3 md:space-y-4 [&>li]:leading-relaxed [&>li]:text-base [&>li]:sm:text-lg [&>li]:md:text-lg [&>li]:text-foreground/90 [&>li]:pl-2 [&>li]:sm:pl-3 [&>li]:md:pl-4 [&>li]:wrap-break-word [&>li]:overflow-wrap-anywhere max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl px-4 sm:px-6 md:px-8 ${className}`}>
            {children}
        </ul>
    )
}

export function TypographyInlineCode({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <code className={`bg-muted relative rounded-md px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 font-mono text-xs sm:text-sm md:text-sm font-semibold text-foreground border border-border/50 ${className}`}>
            {children}
        </code>
    )
}

export function TypographyLead({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <p className={`text-muted-foreground text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-relaxed md:leading-relaxed mb-4 sm:mb-6 md:mb-8 px-4 sm:px-6 md:px-8 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl ${className}`}>
            {children}
        </p>
    )
}

export function TypographyLarge({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <div className={`text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed sm:leading-relaxed md:leading-relaxed mb-4 sm:mb-5 md:mb-6 px-4 sm:px-6 md:px-8 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl ${className}`}>
            {children}
        </div>
    )
}

export function TypographySmall({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <small className={`text-xs sm:text-sm md:text-sm leading-relaxed font-medium text-foreground/70 ${className}`}>
            {children}
        </small>
    )
}

export function TypographyMuted({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <p className={`text-muted-foreground text-sm sm:text-base md:text-base leading-relaxed sm:leading-relaxed md:leading-relaxed mb-3 sm:mb-4 md:mb-5 px-4 sm:px-6 md:px-8 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl ${className}`}>
            {children}
        </p>
    )
}

// Component untuk render HTML content dengan styling typography
export function TypographyContent({
    html,
    className = "",
    youtubeWrapperClassName = "",
    youtubeContainerClassName = "",
    youtubeIframeClassName = ""
}: {
    html: string | undefined | null;
    className?: string;
    youtubeWrapperClassName?: string;
    youtubeContainerClassName?: string;
    youtubeIframeClassName?: string;
}) {
    // Safety check: return early if html is undefined, null, or empty
    if (!html || typeof html !== 'string') {
        return null;
    }

    // Extract YouTube embed URLs from description
    const youtubeEmbedRegex = /https?:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)(\?[^"<>\s]*)?/gi;
    const youtubeLinkRegex = /<a[^>]*href=["'](https?:\/\/www\.youtube\.com\/embed\/[^"'\s]+)["'][^>]*>.*?<\/a>/gi;

    let processedHtml = html;
    const youtubeUrls: string[] = [];

    processedHtml = processedHtml.replace(youtubeLinkRegex, (match, url) => {
        youtubeUrls.push(url);
        return '';
    });

    processedHtml = processedHtml.replace(youtubeEmbedRegex, (match) => {
        if (!youtubeUrls.includes(match)) {
            youtubeUrls.push(match);
        }
        return '';
    });

    processedHtml = processImageUrls(processedHtml);

    return (
        <>
            <div
                className={`w-full max-w-full overflow-x-hidden wrap-break-word 
                    [&_h1]:scroll-m-20 [&_h1]:text-3xl [&_h1]:sm:text-4xl [&_h1]:md:text-5xl [&_h1]:lg:text-6xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:leading-tight [&_h1]:mb-6 [&_h1]:sm:mb-8 [&_h1]:md:mb-10 [&_h1]:mt-6 [&_h1]:sm:mt-8 [&_h1]:md:mt-10 [&_h1]:text-center [&_h1]:text-balance [&_h1]:wrap-break-word
                    [&_h2]:scroll-m-20 [&_h2]:border-b [&_h2]:border-border/40 [&_h2]:pb-3 [&_h2]:sm:pb-4 [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:md:text-4xl [&_h2]:lg:text-5xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:leading-tight [&_h2]:mt-8 [&_h2]:sm:mt-10 [&_h2]:md:mt-12 [&_h2]:mb-4 [&_h2]:sm:mb-6 [&_h2]:md:mb-8 [&_h2]:wrap-break-word
                    [&_h3]:scroll-m-20 [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:md:text-3xl [&_h3]:lg:text-4xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:leading-snug [&_h3]:mt-6 [&_h3]:sm:mt-8 [&_h3]:md:mt-10 [&_h3]:mb-3 [&_h3]:sm:mb-4 [&_h3]:md:mb-6 [&_h3]:wrap-break-word
                    [&_h4]:scroll-m-20 [&_h4]:text-lg [&_h4]:sm:text-xl [&_h4]:md:text-2xl [&_h4]:lg:text-3xl [&_h4]:font-semibold [&_h4]:tracking-tight [&_h4]:leading-snug [&_h4]:mt-5 [&_h4]:sm:mt-6 [&_h4]:md:mt-8 [&_h4]:mb-2 [&_h4]:sm:mb-3 [&_h4]:md:mb-4 [&_h4]:wrap-break-word
                    [&_p]:leading-relaxed [&_p]:text-base [&_p]:sm:text-lg [&_p]:md:text-lg [&_p]:mb-4 [&_p]:sm:mb-5 [&_p]:md:mb-6 [&_p]:text-foreground/90 [&_p]:not(:first-child):mt-4 [&_p]:sm:not(:first-child):mt-6 [&_p]:md:not(:first-child):mt-8 [&_p]:wrap-break-word
                    [&_ul]:my-6 [&_ul]:sm:my-8 [&_ul]:md:my-10 [&_ul]:ml-4 [&_ul]:sm:ml-6 [&_ul]:md:ml-8 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:sm:space-y-3 [&_ul]:md:space-y-4 [&_ul]:wrap-break-word
                    [&_ol]:my-6 [&_ol]:sm:my-8 [&_ol]:md:my-10 [&_ol]:ml-4 [&_ol]:sm:ml-6 [&_ol]:md:ml-8 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:sm:space-y-3 [&_ol]:md:space-y-4 [&_ol]:wrap-break-word
                    [&_li]:leading-relaxed [&_li]:text-base [&_li]:sm:text-lg [&_li]:md:text-lg [&_li]:text-foreground/90 [&_li]:pl-2 [&_li]:sm:pl-3 [&_li]:md:pl-4 [&_li]:wrap-break-word [&_li]:overflow-wrap-anywhere
                    [&_strong]:font-semibold [&_strong]:wrap-break-word
                    [&_em]:italic [&_em]:wrap-break-word
                    [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80 [&_a]:transition-colors [&_a]:wrap-break-word
                    [&_blockquote]:mt-6 [&_blockquote]:sm:mt-8 [&_blockquote]:md:mt-10 [&_blockquote]:mb-6 [&_blockquote]:sm:mb-8 [&_blockquote]:md:mb-10 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:sm:pl-6 [&_blockquote]:md:pl-8 [&_blockquote]:italic [&_blockquote]:text-base [&_blockquote]:sm:text-lg [&_blockquote]:md:text-xl [&_blockquote]:leading-relaxed [&_blockquote]:text-foreground/80 [&_blockquote]:bg-muted/30 [&_blockquote]:py-3 [&_blockquote]:sm:py-4 [&_blockquote]:md:py-5 [&_blockquote]:rounded-r-lg [&_blockquote]:wrap-break-word
                    [&_code]:bg-muted [&_code]:relative [&_code]:rounded-md [&_code]:px-2 [&_code]:sm:px-2.5 [&_code]:md:px-3 [&_code]:py-1 [&_code]:sm:py-1.5 [&_code]:font-mono [&_code]:text-xs [&_code]:sm:text-sm [&_code]:md:text-sm [&_code]:font-semibold [&_code]:border [&_code]:border-border/50 [&_code]:wrap-break-word
                    [&_pre]:my-6 [&_pre]:sm:my-8 [&_pre]:md:my-10 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:sm:p-4 [&_pre]:md:p-6 [&_pre]:border [&_pre]:border-border/50 [&_pre]:wrap-break-word
                    [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:break-normal [&_pre_code]:whitespace-pre-wrap [&_pre_code]:text-xs [&_pre_code]:sm:text-sm [&_pre_code]:md:text-sm
                    [&_hr]:my-8 [&_hr]:sm:my-10 [&_hr]:md:my-12 [&_hr]:border-t [&_hr]:border-border/40 [&_hr]:w-full
                    [&_table]:my-6 [&_table]:sm:my-8 [&_table]:md:my-10 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-border [&_table]:rounded-lg [&_table]:overflow-hidden [&_table]:shadow-sm [&_table]:wrap-break-word
                    [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:sm:px-4 [&_th]:md:px-6 [&_th]:py-2 [&_th]:sm:py-3 [&_th]:md:py-4 [&_th]:text-left [&_th]:font-bold [&_th]:text-sm [&_th]:sm:text-base [&_th]:md:text-lg [&_th]:bg-muted/50 [&_th]:wrap-break-word
                    [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:sm:px-4 [&_td]:md:px-6 [&_td]:py-2 [&_td]:sm:py-3 [&_td]:md:py-4 [&_td]:text-sm [&_td]:sm:text-base [&_td]:wrap-break-word
                    [&_tr]:even:bg-muted/20 [&_tr]:hover:bg-muted/30 [&_tr]:transition-colors
                    [&_img]:rounded-lg [&_img]:my-4 [&_img]:sm:my-6 [&_img]:md:my-8 [&_img]:max-w-full [&_img]:h-auto [&_img]:w-auto [&_img]:shadow-md
                    ${className}`}
                style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: processedHtml }}
            />
            {youtubeUrls.length > 0 && (
                <div className={`space-y-6 sm:space-y-8 md:space-y-10 ${youtubeWrapperClassName || ''}`}>
                    {youtubeUrls.map((url, index) => (
                        <div
                            key={index}
                            className={`w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-border/50 ${youtubeContainerClassName || ''}`}
                            style={{ maxWidth: '100%' }}
                        >
                            <iframe
                                src={url}
                                title={`YouTube video ${index + 1}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className={`w-full h-full border-0 ${youtubeIframeClassName || ''}`}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}
