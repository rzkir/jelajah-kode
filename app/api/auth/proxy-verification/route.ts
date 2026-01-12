import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/auth/verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendResponse.json();

    // Create response with same data
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Extract token from backend response if verification is successful
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

        // Set cookie for frontend domain
        response.cookies.set({
          name: "token",
          value: tokenValue,
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
        });
      }
    }

    return response;
  } catch {
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/auth/verification`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendResponse.json();

    // Create response with same data
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Extract token from backend response if verification is successful
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

        // Set cookie for frontend domain
        response.cookies.set({
          name: "token",
          value: tokenValue,
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "none" : "lax",
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
        });
      }
    }

    return response;
  } catch {
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
