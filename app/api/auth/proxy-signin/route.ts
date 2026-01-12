import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    // Create response with same data
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Forward rate limit headers from backend
    const rateLimitLimit = backendResponse.headers.get("X-RateLimit-Limit");
    const rateLimitRemaining = backendResponse.headers.get(
      "X-RateLimit-Remaining"
    );
    const rateLimitReset = backendResponse.headers.get("X-RateLimit-Reset");
    const retryAfter = backendResponse.headers.get("Retry-After");

    if (rateLimitLimit) {
      response.headers.set("X-RateLimit-Limit", rateLimitLimit);
    }
    if (rateLimitRemaining) {
      response.headers.set("X-RateLimit-Remaining", rateLimitRemaining);
    }
    if (rateLimitReset) {
      response.headers.set("X-RateLimit-Reset", rateLimitReset);
    }
    if (retryAfter) {
      response.headers.set("Retry-After", retryAfter);
    }

    // Extract token from backend response
    // Backend sets cookie via Set-Cookie header
    // We need to extract the token value and set it for frontend domain

    // Get Set-Cookie header
    const setCookieHeader = backendResponse.headers.get("set-cookie");

    if (setCookieHeader) {
      // Parse cookie: "token=value; HttpOnly; Secure; SameSite=None; Path=/"
      const tokenMatch = setCookieHeader.match(/token=([^;]+)/);

      if (tokenMatch && tokenMatch[1]) {
        const tokenValue = tokenMatch[1];

        // Detect if we're in production (HTTPS) or development (HTTP)
        const isProduction =
          process.env.NODE_ENV === "production" ||
          (typeof request.headers.get("x-forwarded-proto") === "string" &&
            request.headers.get("x-forwarded-proto") === "https");

        // Set cookie for frontend domain
        response.cookies.set({
          name: "token",
          value: tokenValue,
          httpOnly: true,
          secure: isProduction, // true in production (HTTPS), false in development (HTTP)
          sameSite: isProduction ? "none" : "lax", // none for cross-origin in production, lax for same-site in dev
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
        });
      }
    }

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 });
  }
}
