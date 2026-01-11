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

        // Set cookie for frontend domain (localhost)
        response.cookies.set({
          name: "token",
          value: tokenValue,
          httpOnly: true,
          secure: false, // Development: allow HTTP
          sameSite: "lax",
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
        });

        console.log("[PROXY-SIGNIN] Cookie set for frontend domain");
      } else {
        console.warn(
          "[PROXY-SIGNIN] Could not extract token from Set-Cookie header:",
          setCookieHeader
        );
      }
    } else {
      console.warn(
        "[PROXY-SIGNIN] No Set-Cookie header found in backend response"
      );
      console.log(
        "[PROXY-SIGNIN] All headers:",
        Object.fromEntries(backendResponse.headers.entries())
      );
    }

    return response;
  } catch (error) {
    console.error("Proxy signin error:", error);
    return NextResponse.json({ error: "Failed to sign in" }, { status: 500 });
  }
}
