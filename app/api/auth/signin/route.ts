import { NextRequest, NextResponse } from "next/server";

import { Account } from "@/models/Account";

import { generateJWT } from "@/hooks/jwt";

import { connectMongoDB } from "@/lib/mongodb";

import { rateLimit, createRateLimitResponse } from "@/lib/rate-limit";

// Rate limit configuration: 5 requests per minute for signin (stricter than /me)
const RATE_LIMIT_OPTIONS = {
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
};

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = rateLimit(request, RATE_LIMIT_OPTIONS);
  if (!rateLimitResult.success) {
    const response = createRateLimitResponse(rateLimitResult);
    return response;
  }
  try {
    const { email, password } = await request.json();

    await connectMongoDB();

    const account = await Account.findOne({ email });
    if (!account) {
      const response = NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
      return response;
    }

    const isPasswordValid = await account.comparePassword(password);
    if (!isPasswordValid) {
      const response = NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
      return response;
    }

    // Check if account is active
    if (account.status === "inactive") {
      const response = NextResponse.json(
        { error: "Your account has been deactivated. Please contact support." },
        { status: 403 }
      );
      return response;
    }

    // Check if account is verified
    if (account.isVerified === "false" || account.isVerified === false) {
      const response = NextResponse.json(
        { error: "Please verify your email before signing in." },
        { status: 403 }
      );
      return response;
    }

    const token = await generateJWT({
      _id: account._id,
      email: account.email,
      role: account.role,
    });

    const response = NextResponse.json(
      {
        message: "Sign in successful",
        user: {
          _id: account._id,
          email: account.email,
          name: account.name,
          role: account.role,
        },
      },
      { status: 200 }
    );

    // Set cookie with CORS-friendly settings
    // Detect if request is from localhost (development) or production
    const origin = request.headers.get("origin");
    const isLocalhost =
      origin && (origin.includes("localhost") || origin.includes("127.0.0.1"));

    // For localhost (development): use lax and secure false (HTTP allowed)
    // For production (cross-origin): use none and secure true (HTTPS required)
    const cookieSettings = isLocalhost
      ? {
          secure: false, // Allow HTTP in development
          sameSite: "lax" as const, // Works for same-site in development
        }
      : {
          secure: true, // Require HTTPS in production
          sameSite: "none" as const, // Required for cross-origin
        };

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      ...cookieSettings,
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      // Don't set domain - let browser handle it
    });

    // Add rate limit headers to response
    response.headers.set("X-RateLimit-Limit", rateLimitResult.limit.toString());
    response.headers.set(
      "X-RateLimit-Remaining",
      rateLimitResult.remaining.toString()
    );
    response.headers.set(
      "X-RateLimit-Reset",
      new Date(rateLimitResult.resetTime).toISOString()
    );

    return response;
  } catch (error: unknown) {
    console.error("Sign in error:", error);
    const response = NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
    return response;
  }
}
