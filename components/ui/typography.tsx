import React from 'react';

export function TypographyH1({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <h1 className={`scroll-m-20 text-center text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-balance max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto ${className}`}>
            {children}
        </h1>
    )
}

export function TypographyH2({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <h2 className={`scroll-m-20 border-b pb-2 text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight first:mt-0 max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl ${className}`}>
            {children}
        </h2>
    )
}

export function TypographyH3({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <h3 className={`scroll-m-20 text-lg sm:text-xl md:text-2xl font-semibold tracking-tight max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl ${className}`}>
            {children}
        </h3>
    )
}

export function TypographyH4({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <h4 className={`scroll-m-20 text-base sm:text-lg md:text-xl font-semibold tracking-tight max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl ${className}`}>
            {children}
        </h4>
    )
}

export function TypographyP({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <p className={`leading-7 not-first:mt-6 text-sm sm:text-base max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl ${className}`}>
            {children}
        </p>
    )
}

export function TypographyBlockquote({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <blockquote className={`mt-6 border-l-2 pl-4 sm:pl-6 italic max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl ${className}`}>
            {children}
        </blockquote>
    )
}

export function TypographyTable() {
    return (
        <div className="my-6 w-full overflow-y-auto">
            <table className="w-full">
                <thead>
                    <tr className="even:bg-muted m-0 border-t p-0">
                        <th className="border px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right">
                        </th>
                        <th className="border px-4 py-2 text-left font-bold [[align=center]]:text-center [[align=right]]:text-right">
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="even:bg-muted m-0 border-t p-0">
                        <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
                        </td>
                        <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
                        </td>
                    </tr>
                    <tr className="even:bg-muted m-0 border-t p-0">
                        <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
                        </td>
                        <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
                        </td>
                    </tr>
                    <tr className="even:bg-muted m-0 border-t p-0">
                        <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
                        </td>
                        <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export function TypographyList({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <ul className={`my-6 ml-4 sm:ml-6 list-disc [&>li]:mt-2 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl ${className}`}>
            {children}
        </ul>
    )
}

export function TypographyInlineCode({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <code className={`bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ${className}`}>
            {children}
        </code>
    )
}

export function TypographyLead({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <p className={`text-muted-foreground text-lg sm:text-xl max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl ${className}`}>
            {children}
        </p>
    )
}

export function TypographyLarge({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return <div className={`text-base sm:text-lg font-semibold max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl ${className}`}>{children}</div>
}

export function TypographySmall({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <small className={`text-sm leading-none font-medium ${className}`}>
            {children}
        </small>
    )
}

export function TypographyMuted({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <p className={`text-muted-foreground text-xs sm:text-sm max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl ${className}`}>
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
    html: string;
    className?: string;
    youtubeWrapperClassName?: string;
    youtubeContainerClassName?: string;
    youtubeIframeClassName?: string;
}) {
    // Extract YouTube embed URLs from description
    const youtubeEmbedRegex = /https?:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)(\?[^"<>\s]*)?/gi;
    const youtubeLinkRegex = /<a[^>]*href=["'](https?:\/\/www\.youtube\.com\/embed\/[^"'\s]+)["'][^>]*>.*?<\/a>/gi;

    let processedHtml = html;
    const youtubeUrls: string[] = [];

    // Extract URLs from anchor tags
    processedHtml = processedHtml.replace(youtubeLinkRegex, (match, url) => {
        youtubeUrls.push(url);
        return '';
    });

    // Extract direct embed URLs
    processedHtml = processedHtml.replace(youtubeEmbedRegex, (match) => {
        if (!youtubeUrls.includes(match)) {
            youtubeUrls.push(match);
        }
        return '';
    });

    return (
        <>
            <div
                className={`w-full max-w-full overflow-x-hidden wrap-break-word
                    [&_h1]:scroll-m-20 [&_h1]:text-2xl [&_h1]:sm:text-3xl [&_h1]:md:text-4xl [&_h1]:font-extrabold [&_h1]:tracking-tight [&_h1]:mb-4 [&_h1]:w-full [&_h1]:max-w-full [&_h1]:wrap-break-word
                        [&_h2]:scroll-m-20 [&_h2]:border-b [&_h2]:pb-2 [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:md:text-3xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:w-full [&_h2]:max-w-full [&_h2]:wrap
                    [&_h3]:scroll-m-20 [&_h3]:text-lg [&_h3]:sm:text-xl [&_h3]:md:text-2xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:w-full [&_h3]:max-w-full [&_h3]:wrap-break-word
                    [&_h4]:scroll-m-20 [&_h4]:text-base [&_h4]:sm:text-lg [&_h4]:md:text-xl [&_h4]:font-semibold [&_h4]:tracking-tight [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:w-full [&_h4]:max-w-full [&_h4]:wrap-break-word
                    [&_p]:leading-7 [&_p]:text-sm [&_p]:sm:text-base [&_p]:md:text-base [&_p]:mb-4 [&_p]:w-full [&_p]:max-w-full [&_p]:wrap-break-word [&_p]:not(:first-child):mt-6
                    [&_ul]:my-6 [&_ul]:ml-4 [&_ul]:sm:ml-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:w-full [&_ul]:max-w-full [&_ul]:wrap-break-word
                    [&_ol]:my-6 [&_ol]:ml-4 [&_ol]:sm:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:w-full [&_ol]:max-w-full [&_ol]:wrap-break-word
                    [&_li]:mt-2 [&_li]:leading-7 [&_li]:text-sm [&_li]:sm:text-base [&_li]:wrap-break-word
                    [&_strong]:font-semibold [&_strong]:wrap-break-word
                    [&_em]:italic [&_em]:wrap-break-word
                    [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80 [&_a]:wrap-break-word
                    [&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:sm:pl-6 [&_blockquote]:italic [&_blockquote]:w-full [&_blockquote]:max-w-full [&_blockquote]:wrap-break-word
                    [&_code]:bg-muted [&_code]:relative [&_code]:rounded [&_code]:px-[0.3rem] [&_code]:py-[0.2rem] [&_code]:font-mono [&_code]:text-xs [&_code]:sm:text-sm [&_code]:font-semibold [&_code]:wrap-break-word
                    [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:sm:p-4 [&_pre]:w-full [&_pre]:max-w-full [&_pre]:wrap-break-word
                    [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:break-normal [&_pre_code]:whitespace-pre-wrap
                    [&_hr]:my-8 [&_hr]:border-t [&_hr]:w-full [&_hr]:max-w-full
                    [&_table]:my-6 [&_table]:w-full [&_table]:max-w-full [&_table]:border-collapse [&_table]:overflow-x-auto [&_table]:block [&_table]:sm:table [&_table]:wrap-break-word
                    [&_th]:border [&_th]:px-2 [&_th]:sm:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-bold [&_th]:text-xs [&_th]:sm:text-sm [&_th]:wrap-break-word
                    [&_td]:border [&_td]:px-2 [&_td]:sm:px-4 [&_td]:py-2 [&_td]:text-xs [&_td]:sm:text-sm [&_td]:wrap-break-word
                    [&_img]:rounded-lg [&_img]:my-4 [&_img]:max-w-full [&_img]:h-auto [&_img]:w-auto
                    ${className}`}
                style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                dangerouslySetInnerHTML={{ __html: processedHtml }}
            />
            {youtubeUrls.length > 0 && (
                <div className={`space-y-4 mt-6 ${youtubeWrapperClassName || ''}`}>
                    {youtubeUrls.map((url, index) => (
                        <div
                            key={index}
                            className={`w-full aspect-video rounded-lg overflow-hidden ${youtubeContainerClassName || ''}`}
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
