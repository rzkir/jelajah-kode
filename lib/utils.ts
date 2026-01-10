import { clsx, type ClassValue } from "clsx";

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts markdown image syntax and plain image URLs to HTML img tags
 * @param content - HTML content that may contain markdown images or plain URLs
 * @returns Processed HTML with proper img tags
 */
export function processImageUrls(content: string): string {
  let processed = content;

  // Convert markdown image syntax ![alt](url) to <img> tags
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  processed = processed.replace(markdownImageRegex, (match, alt, url) => {
    const cleanUrl = url.trim();
    const cleanAlt = alt.trim() || "Image";
    return `<img src="${cleanUrl}" alt="${cleanAlt}" style="max-width: 100%; height: auto;" />`;
  });

  // Convert plain image URLs (not already in img tags) to <img> tags
  // Match URLs that look like image URLs and are not already inside HTML tags
  const imageUrlRegex =
    /(https?:\/\/[^\s<>"']+\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?[^\s<>"']*)?)/gi;

  // Find all existing img tags to avoid processing URLs inside them
  let match;

  // Find all existing img tags
  const imgTagRegex = /<img[^>]*>/gi;
  const imgMatches: Array<{ start: number; end: number }> = [];

  while ((match = imgTagRegex.exec(processed)) !== null) {
    imgMatches.push({ start: match.index, end: match.index + match[0].length });
  }

  // Process each segment separately
  let currentIndex = 0;
  const segments: Array<{ text: string; isInsideImg: boolean }> = [];

  for (const imgMatch of imgMatches) {
    if (currentIndex < imgMatch.start) {
      segments.push({
        text: processed.substring(currentIndex, imgMatch.start),
        isInsideImg: false,
      });
    }
    segments.push({
      text: processed.substring(imgMatch.start, imgMatch.end),
      isInsideImg: true,
    });
    currentIndex = imgMatch.end;
  }

  if (currentIndex < processed.length) {
    segments.push({
      text: processed.substring(currentIndex),
      isInsideImg: false,
    });
  }

  // Process only segments that are not inside img tags
  processed = segments
    .map((segment) => {
      if (segment.isInsideImg) {
        return segment.text;
      }

      // Convert plain image URLs in this segment
      return segment.text.replace(
        imageUrlRegex,
        (match, url, extension, queryString, offset) => {
          // Check if this URL is already part of an HTML attribute
          const beforeMatch = segment.text.substring(
            Math.max(0, offset - 100),
            offset
          );

          // Skip if it's already in an HTML attribute (src=, href=, etc.)
          if (beforeMatch.match(/[=:]\s*$/)) {
            return match;
          }

          // Convert to img tag
          return `<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" />`;
        }
      );
    })
    .join("");

  return processed;
}
