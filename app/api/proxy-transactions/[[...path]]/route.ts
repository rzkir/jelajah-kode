import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API;

// Helper function to handle all HTTP methods for transactions proxy
async function handleRequest(
  request: NextRequest,
  method: string,
  body?: string,
  pathSegments?: string[]
) {
  try {
    // Get the token cookie from the frontend request
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Build the sub-path from path segments (e.g., ["midtrans-status"] or [])
    // Optional catch-all [[...path]] can be undefined, empty array, or array with segments
    const subPath =
      pathSegments && pathSegments.length > 0
        ? `/${pathSegments.join("/")}`
        : "";

    // Build the backend URL with sub-path and query parameters
    const url = new URL(`${BACKEND_URL}/api/transactions${subPath}`);
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Debug logging in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[PROXY-TRANSACTIONS] ${method} ${request.nextUrl.pathname}${
          request.nextUrl.search
        } -> ${url.toString()}`
      );
    }

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

    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: "include",
    };

    if (body) {
      fetchOptions.body = body;
    }

    const backendResponse = await fetch(url.toString(), fetchOptions);

    const data = await backendResponse.json();

    // Create response with same data
    const response = NextResponse.json(data, {
      status: backendResponse.status,
    });

    return response;
  } catch (error) {
    console.error(`Proxy transactions ${method} error:`, error);
    return NextResponse.json(
      { error: `Failed to process transactions request` },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] | string }> }
) {
  try {
    const resolvedParams = await params;
    // For optional catch-all, path can be undefined when no segments exist
    const path = resolvedParams?.path;
    const pathArray =
      path === undefined ? [] : Array.isArray(path) ? path : path ? [path] : [];
    return handleRequest(request, "GET", undefined, pathArray);
  } catch (error) {
    console.error("Proxy transactions GET error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] | string }> }
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams?.path;
    const pathArray =
      path === undefined ? [] : Array.isArray(path) ? path : path ? [path] : [];
    const body = await request.text();
    return handleRequest(request, "POST", body, pathArray);
  } catch (error) {
    console.error("Proxy transactions POST error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] | string }> }
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams?.path;
    const pathArray =
      path === undefined ? [] : Array.isArray(path) ? path : path ? [path] : [];
    const body = await request.text();
    return handleRequest(request, "PUT", body, pathArray);
  } catch (error) {
    console.error("Proxy transactions PUT error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] | string }> }
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams?.path;
    const pathArray =
      path === undefined ? [] : Array.isArray(path) ? path : path ? [path] : [];
    return handleRequest(request, "DELETE", undefined, pathArray);
  } catch (error) {
    console.error("Proxy transactions DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
