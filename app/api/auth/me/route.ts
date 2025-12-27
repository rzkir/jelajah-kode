import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";

import { Account } from "@/models/Account";

import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";

import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await Account.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userWithTimestamps = user as mongoose.Document & {
      createdAt?: Date;
      updatedAt?: Date;
    };

    const userData = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      picture: user.picture,
      status: user.status,
      isVerified: user.isVerified,
      provider: user.provider,
      created_at:
        userWithTimestamps.createdAt?.toISOString() || new Date().toISOString(),
      updated_at:
        userWithTimestamps.updatedAt?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json(userData, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to get user data. Please try again." },
      { status: 500 }
    );
  }
}
