import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API;

export async function DELETE(request: NextRequest) {
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

    // Forward request to backend
    const backendResponse = await fetch(
      `${BACKEND_URL}/api/auth/delete-account`,
      {
        method: "DELETE",
        headers,
        credentials: "include",
      }
    );

    const data = await backendResponse.json();

    // Create response with same data
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    // Detect if we're in production (HTTPS) or development (HTTP)
    const isProduction =
      process.env.NODE_ENV === "production" ||
      (typeof request.headers.get("x-forwarded-proto") === "string" &&
        request.headers.get("x-forwarded-proto") === "https");

    // Forward any Set-Cookie headers from backend to frontend (to clear cookie)
    const setCookieHeader = backendResponse.headers.get("set-cookie");
    if (setCookieHeader) {
      // Parse and forward the cookie deletion
      const tokenMatch = setCookieHeader.match(/token=([^;]*)/);
      if (tokenMatch) {
        // Clear cookie for frontend domain
        response.cookies.set({
          name: "token",
          value: "",
          httpOnly: true,
          secure: isProduction, // true in production (HTTPS), false in development (HTTP)
          sameSite: isProduction ? "none" : "lax", // none for cross-origin in production, lax for same-site in dev
          expires: new Date(0), // Set expiration to past date to delete cookie
          path: "/",
        });
        console.log(
          "[PROXY-DELETE-ACCOUNT] Cookie cleared for frontend domain"
        );
      }
    }

    return response;
  } catch (error) {
    console.error("Proxy delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
