import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import { Account } from "@/models/Account";

import { checkAuthorization } from "@/lib/auth-utils";

export async function GET(request: Request) {
  try {
    // Check authorization
    if (!checkAuthorization(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const isVerified = searchParams.get("isVerified") || "";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build query object
    const query: {
      $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
      status?: string;
      isVerified?: string;
    } = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (isVerified) {
      query.isVerified = isVerified;
    }

    // Fetch users with pagination
    const users = await Account.find(query)
      .select(
        "-password -resetToken -resetTokenExpiry -verificationToken -verificationTokenExpiry"
      )
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination info
    const totalCount = await Account.countDocuments(query);

    // Format response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedUsers = users.map((user: any) => ({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      picture: user.picture,
      status: user.status,
      isVerified: user.isVerified,
      emailVerified: user.emailVerified,
      created_at: user.createdAt?.toISOString() || new Date().toISOString(),
      updated_at: user.updatedAt?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json({
      data: formattedUsers,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Check authorization
    if (!checkAuthorization(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    // Parse request body
    const body = await request.json();
    const { userId, status } = body;

    if (!userId || !status) {
      return NextResponse.json(
        { error: "User ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["active", "inactive"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status. Must be one of: active, inactive",
        },
        { status: 400 }
      );
    }

    // Find and update user
    const user = await Account.findByIdAndUpdate(
      userId,
      { status },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userObj = user.toObject() as any;
    const formattedUser = {
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

    return NextResponse.json(formattedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { error: "Failed to update user status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Check authorization
    if (!checkAuthorization(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();

    // Parse request body
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find and delete user
    const user = await Account.findByIdAndDelete(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
