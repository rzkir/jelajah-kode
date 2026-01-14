import Script from "next/script";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbScriptProps {
    items: BreadcrumbItem[];
}

export default function BreadcrumbScript({ items }: BreadcrumbScriptProps) {
    const baseUrl = BASE_URL;

    const breadcrumbList = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${baseUrl}${item.url}`,
        })),
    };

    return (
        <Script
            id="breadcrumb-structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(breadcrumbList),
            }}
        />
    );
}

