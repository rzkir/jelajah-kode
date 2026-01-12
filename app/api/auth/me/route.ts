import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";

import { connectMongoDB } from "@/lib/mongodb";

import { Account } from "@/models/Account";

import { verifyJWT } from "@/hooks/jwt";

import { rateLimit, createRateLimitResponse } from "@/lib/rate-limit";

// Rate limit configuration: 10 requests per minute
const RATE_LIMIT_OPTIONS = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
};

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = rateLimit(request, RATE_LIMIT_OPTIONS);
  if (!rateLimitResult.success) {
    const response = createRateLimitResponse(rateLimitResult);
    return response;
  }
  try {
    await connectMongoDB();

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      const response = NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
      return response;
    }

    let decodedToken;
    try {
      decodedToken = await verifyJWT(token);
    } catch {
      const response = NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
      return response;
    }

    const user = await Account.findById(decodedToken._id);

    if (!user) {
      const response = NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
      return response;
    }

    // Convert to plain object to access timestamps safely
    const userObj = user.toObject() as {
      _id: { toString(): string };
      email: string;
      name: string;
      role: string;
      picture?: string;
      status: string;
      isVerified: string;
      emailVerified?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    };

    const userData = {
      _id: userObj._id.toString(),
      email: userObj.email,
      name: userObj.name,
      role: userObj.role,
      picture: userObj.picture,
      status: userObj.status,
      isVerified: userObj.isVerified,
      emailVerified: userObj.emailVerified,
      created_at: userObj.createdAt?.toISOString() || new Date().toISOString(),
      updated_at: userObj.updatedAt?.toISOString() || new Date().toISOString(),
    };

    const response = NextResponse.json(userData, { status: 200 });

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
  } catch {
    const response = NextResponse.json(
      { error: "Failed to get user data. Please try again." },
      { status: 500 }
    );
    return response;
  }
}

export async function PUT(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = rateLimit(request, RATE_LIMIT_OPTIONS);
  if (!rateLimitResult.success) {
    const response = createRateLimitResponse(rateLimitResult);
    return response;
  }

  try {
    await connectMongoDB();

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await verifyJWT(token);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Check if user exists
    const existingUser = await Account.findById(decodedToken._id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { picture, name } = body;

    // Prepare update object
    const updateData: {
      picture?: string;
      name?: string;
    } = {};

    // Update user fields
    if (picture !== undefined) {
      updateData.picture = picture;
    }
    if (name !== undefined && name.trim() !== "") {
      updateData.name = name.trim();
    }

    // Update user using findByIdAndUpdate to ensure fields are saved
    const user = await Account.findByIdAndUpdate(decodedToken._id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Convert to plain object to access timestamps safely
    const userObj = user.toObject() as {
      _id: { toString(): string };
      email: string;
      name: string;
      role: string;
      picture?: string;
      status: string;
      isVerified: string;
      emailVerified?: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    };

    const userData = {
      _id: userObj._id.toString(),
      email: userObj.email,
      name: userObj.name,
      role: userObj.role,
      picture: userObj.picture,
      status: userObj.status,
      isVerified: userObj.isVerified,
      emailVerified: userObj.emailVerified,
      created_at: userObj.createdAt?.toISOString() || new Date().toISOString(),
      updated_at: userObj.updatedAt?.toISOString() || new Date().toISOString(),
    };

    const response = NextResponse.json(userData, { status: 200 });

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
  } catch (error) {
    console.error("Error updating user profile:", error);
    const response = NextResponse.json(
      { error: "Failed to update user profile. Please try again." },
      { status: 500 }
    );
    return response;
  }
}
