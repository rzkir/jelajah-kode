import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API;

export async function GET(request: NextRequest) {
  try {
    // Get the token cookie from the frontend request
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Forward request to backend with cookies
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Forward the cookie if it exists
    if (token) {
      headers.Cookie = `token=${token}`;
    } else {
      // Fallback: forward all cookies from the request
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        headers.Cookie = cookieHeader;
      }
    }

    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    const data = await backendResponse.json();

    // Create response with same data
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Forward any Set-Cookie headers from backend to frontend
    const setCookieHeader = backendResponse.headers.get("set-cookie");
    if (setCookieHeader) {
      // Parse and forward the cookie
      const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
      if (tokenMatch && tokenMatch[1]) {
        const tokenValue = tokenMatch[1];
        // Detect if we're in production (HTTPS) or development (HTTP)
        const isProduction =
          process.env.NODE_ENV === "production" ||
          (typeof request.headers.get("x-forwarded-proto") === "string" &&
            request.headers.get("x-forwarded-proto") === "https");

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
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Get the token cookie from the frontend request
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Forward request to backend with cookies
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Forward the cookie if it exists
    if (token) {
      headers.Cookie = `token=${token}`;
    } else {
      // Fallback: forward all cookies from the request
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        headers.Cookie = cookieHeader;
      }
    }

    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: "PUT",
      headers,
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    // Create response with same data
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Forward any Set-Cookie headers from backend to frontend
    const setCookieHeader = backendResponse.headers.get("set-cookie");
    if (setCookieHeader) {
      const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
      if (tokenMatch && tokenMatch[1]) {
        const tokenValue = tokenMatch[1];
        // Detect if we're in production (HTTPS) or development (HTTP)
        const isProduction =
          process.env.NODE_ENV === "production" ||
          (typeof request.headers.get("x-forwarded-proto") === "string" &&
            request.headers.get("x-forwarded-proto") === "https");

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
    return NextResponse.json(
      { error: "Failed to update user data" },
      { status: 500 }
    );
  }
}
