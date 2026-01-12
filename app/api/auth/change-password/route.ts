import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";

import { connectMongoDB } from "@/lib/mongodb";

import { Account } from "@/models/Account";

import { verifyJWT } from "@/hooks/jwt";

export async function PUT(req: NextRequest) {
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

    const { userId, newPassword } = await req.json();

    if (!userId || !newPassword) {
      return NextResponse.json(
        { error: "User ID and new password are required" },
        { status: 400 }
      );
    }

    // Verify that the userId matches the authenticated user
    // Convert both to string for comparison
    const authenticatedUserId = String(decodedToken._id);
    const requestedUserId = String(userId);

    if (authenticatedUserId !== requestedUserId) {
      return NextResponse.json(
        { error: "Unauthorized: User ID mismatch" },
        { status: 403 }
      );
    }

    // Validate password length
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Find user
    const user = await Account.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update password (will be hashed automatically by pre-save hook)
    user.password = newPassword;
    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Failed to change password. Please try again." },
      { status: 500 }
    );
  }
}
