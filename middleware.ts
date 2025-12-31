import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple JWT decoding function that works in edge runtime
function decodeJWT(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    // Decode the payload (the middle part)
    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decodedPayload = atob(paddedPayload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("JWT decoding error:", error);
    throw new Error("Invalid token");
  }
}

// Define public paths that don't require authentication
const publicPaths = [
  "/signin",
  "/signup",
  "/verification",
  "/change-password",
  "/forget-password",
  "/reset-password",
];

// Define admin-only paths
const adminPaths = ["/dashboard"];

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const method = request.method;

  // CRITICAL: Always allow all API routes to pass through without any checks
  // This prevents redirects on POST/PUT/DELETE requests to API endpoints
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Only handle GET requests for page routes
  // Never redirect POST/PUT/DELETE/PATCH requests
  if (method !== "GET") {
    return NextResponse.next();
  }

  // Check if the path is public (exact match or starts with for auth pages)
  const isPublicPath =
    pathname === "/" || publicPaths.some((path) => pathname.startsWith(path));

  // Check if the path is admin-only
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

  // Determine user role from JWT token (decode only, no verification)
  let userRole: string | null = null;
  let isAuthenticated = false;

  // Check JWT token only if it exists
  if (token) {
    try {
      const decoded = decodeJWT(token);

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        throw new Error("Token expired");
      }

      userRole = decoded.role as string;
      isAuthenticated = true;
    } catch (error) {
      console.error("Token decoding error:", error);
      // If token is invalid or expired, remove it
      const response = NextResponse.next();
      response.cookies.delete("token");
      if (!isPublicPath) {
        const signinUrl = new URL("/signin", request.url);
        signinUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(signinUrl);
      }
      return response;
    }
  }

  // If user is authenticated and on signin/signup page
  if (isAuthenticated && (pathname === "/signin" || pathname === "/signup")) {
    // Check if the user is coming from a logout action
    const fromLogout = request.nextUrl.searchParams.get("logout");

    if (fromLogout) {
      // Allow the user to stay on signin page if they just logged out
      return NextResponse.next();
    } else {
      if (userRole === "admins") {
        // Redirect admins to dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        // Redirect regular users to home
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  // If user is not on a public path and not authenticated, redirect to signin
  if (!isPublicPath && !isAuthenticated) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signinUrl);
  }

  // If user is on an admin path, verify their role
  if (isAdminPath) {
    if (!isAuthenticated) {
      // If not authenticated at all, redirect to signin
      const signinUrl = new URL("/signin", request.url);
      signinUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(signinUrl);
    }

    if (userRole !== "admins") {
      // If not admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If admin role is verified, allow access
    return NextResponse.next();
  }

  // Allow access to product detail pages only for authenticated admins
  if (pathname.startsWith("/dashboard/products/products/")) {
    if (!isAuthenticated) {
      // If not authenticated, redirect to signin
      const signinUrl = new URL("/signin", request.url);
      signinUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(signinUrl);
    }

    if (userRole !== "admins") {
      // If not admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If admin role is verified, allow access to product pages
    return NextResponse.next();
  }

  // For all other cases, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
