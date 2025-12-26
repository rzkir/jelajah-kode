import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/utils/auth/token";
import { getToken } from "next-auth/jwt";

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

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Allow all NextAuth API routes without middleware check
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Check NextAuth session token
  let nextAuthToken = null;
  try {
    nextAuthToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
  } catch {
    // Silent fail - no session
  }

  // Check if the path is public (exact match or starts with for auth pages)
  const isPublicPath =
    pathname === "/" || publicPaths.some((path) => pathname.startsWith(path));

  // Check if the path is admin-only
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

  // Determine user role from either NextAuth token or custom JWT
  let userRole: string | null = null;
  let isAuthenticated = false;

  // Check NextAuth session first (only if token exists and has required fields)
  if (nextAuthToken && nextAuthToken.email) {
    userRole = (nextAuthToken.role as string) || "user";
    isAuthenticated = true;
  }
  // Then check custom JWT token
  else if (token) {
    try {
      const payload = await verifyJWT(token);
      userRole = payload.role as string;
      isAuthenticated = true;
    } catch {
      // If token is invalid, remove it
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
    if (userRole === "admins") {
      // Redirect admins to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      // Redirect regular users to home
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If user is not on a public path and not authenticated, redirect to signin
  if (!isPublicPath && !isAuthenticated) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signinUrl);
  }

  // If user is on an admin path, verify their role
  if (isAdminPath && isAuthenticated) {
    if (userRole !== "admins") {
      // If not admin, redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }
    // If admin role is verified, allow access
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
