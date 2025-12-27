import { NextResponse } from "next/server";

import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";

import { connectToDatabase } from "@/lib/mongodb";

import { Account } from "@/models/Account";

export async function GET(request: Request) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      // If no session, redirect to sign in
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Connect to database to fetch user role
    await connectToDatabase();

    // Find user by email to get the role
    const user = await Account.findOne({ email: session.user.email });

    if (!user) {
      // If user doesn't exist in our database, redirect to sign in
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Redirect based on user role
    const role = user.role;
    if (role === "admins") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Error in auth callback:", error);
    // On error, redirect to home page
    return NextResponse.redirect(new URL("/", request.url));
  }
}
