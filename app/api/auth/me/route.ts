import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import { connectMongoDB } from "@/lib/mongodb";

import { Account } from "@/models/Account";

import { verifyJWT } from "@/hooks/jwt";

export async function GET() {
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

    const user = await Account.findById(decodedToken._id);

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

    return NextResponse.json(userData, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to get user data. Please try again." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile. Please try again." },
      { status: 500 }
    );
  }
}
