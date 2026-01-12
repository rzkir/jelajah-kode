/**
 * Development Configuration
 *
 * File ini digunakan untuk mengatasi masalah 401 ketika FE local (http)
 * mencoba fetch langsung ke BE (https) karena masalah cookie/authentication.
 *
 * Di development, gunakan proxy routes di FE untuk forward request ke BE.
 * Di production, gunakan direct call ke BE.
 */
export const USE_PROXY_IN_DEVELOPMENT = true;

/**
 * Check if currently in development mode
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

/**
 * Check if should use proxy routes
 * Proxy routes digunakan di development untuk mengatasi masalah http/https
 * Hanya di client-side, server-side tidak perlu proxy
 */
export const shouldUseProxy = (): boolean => {
  // Server-side tidak perlu proxy (no CORS issues)
  if (typeof window === "undefined") {
    return false;
  }
  return USE_PROXY_IN_DEVELOPMENT && isDevelopment();
};

/**
 * Get API endpoint URL
 * Di server-side: selalu gunakan direct URL (tidak ada masalah CORS)
 * Di client-side development: gunakan proxy route path
 * Di client-side production: gunakan direct URL
 *
 * @param proxyPath - Path untuk proxy route (e.g., "/api/auth/proxy-me")
 * @param directUrl - Full URL untuk direct call (e.g., "https://api.example.com/api/auth/me")
 * @returns URL yang sesuai dengan environment
 */
export const getApiUrl = (proxyPath: string, directUrl: string): string => {
  // Server-side: always use direct URL (no CORS issues on server)
  if (typeof window === "undefined") {
    return directUrl;
  }

  // Client-side: use proxy in development, direct in production
  return shouldUseProxy() ? proxyPath : directUrl;
};
