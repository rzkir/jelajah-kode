import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// In production, consider using Redis for distributed systems
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

// Get client identifier (IP address)
function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (for proxies/load balancers)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip"); // Cloudflare
  const ip =
    cfConnectingIp ||
    (forwarded ? forwarded.split(",")[0].trim() : null) ||
    realIp ||
    "unknown";

  return ip;
}

export interface RateLimitOptions {
  maxRequests: number; // Maximum number of requests
  windowMs: number; // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  limit: number;
}

/**
 * Rate limit middleware
 * @param request - Next.js request object
 * @param options - Rate limit options
 * @returns Rate limit result (success: false if limit exceeded)
 */
export function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): RateLimitResult {
  const { maxRequests, windowMs } = options;
  const clientId = getClientIdentifier(request);
  const now = Date.now();

  // Get or create rate limit entry
  let entry = rateLimitStore.get(clientId);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  // Increment request count
  entry.count++;

  // Update store
  rateLimitStore.set(clientId, entry);

  // Check if limit exceeded
  if (entry.count > maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
      limit: maxRequests,
    };
  }

  return {
    success: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
    limit: maxRequests,
  };
}

/**
 * Create a rate limit response with appropriate headers
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  const response = NextResponse.json(
    {
      error: "Too many requests. Please try again later.",
      retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
    },
    { status: 429 }
  );

  // Add rate limit headers
  response.headers.set("X-RateLimit-Limit", result.limit.toString());
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
  response.headers.set(
    "X-RateLimit-Reset",
    new Date(result.resetTime).toISOString()
  );
  response.headers.set(
    "Retry-After",
    Math.ceil((result.resetTime - Date.now()) / 1000).toString()
  );

  return response;
}

/**
 * Rate limit middleware wrapper
 * Returns a function that can be used in route handlers
 */
export function withRateLimit(
  options: RateLimitOptions,
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const result = rateLimit(request, options);

    if (!result.success) {
      return createRateLimitResponse(result);
    }

    // Call the actual handler
    const response = await handler(request);

    // Add rate limit headers to successful response
    response.headers.set("X-RateLimit-Limit", result.limit.toString());
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
    response.headers.set(
      "X-RateLimit-Reset",
      new Date(result.resetTime).toISOString()
    );

    return response;
  };
}
