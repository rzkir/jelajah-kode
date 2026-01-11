import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API;

export async function GET(request: NextRequest) {
  try {
    // Get the token cookie from the frontend request
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Build the backend URL with query parameters
    const url = new URL(`${BACKEND_URL}/api/checkout`);
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

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

    // Forward Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const backendResponse = await fetch(url.toString(), {
      method: "GET",
      headers,
      credentials: "include",
    });

    const data = await backendResponse.json();

    // Create response with same data
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    return response;
  } catch (error) {
    console.error("Proxy checkout GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch checkout products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Forward Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    const backendResponse = await fetch(`${BACKEND_URL}/api/checkout`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    // Create response with same data
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    return response;
  } catch (error) {
    console.error("Proxy checkout POST error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}

