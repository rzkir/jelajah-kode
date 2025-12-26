import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Account } from "@/models/Account";

// POST - Check if email exists and return provider
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const user = await Account.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    // Return existence and provider info
    return NextResponse.json(
      {
        exists: true,
        provider: user.provider || "email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json(
      { error: "Failed to check email. Please try again." },
      { status: 500 }
    );
  }
}

export const GET = POST;
