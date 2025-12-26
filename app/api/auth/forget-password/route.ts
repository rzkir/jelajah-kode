import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Account } from "@/models/Account";
import nodemailer from "nodemailer";
import { generatePasswordResetEmailTemplate } from "@/hooks/template-message";

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST - Send forget password OTP
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
      return NextResponse.json(
        { error: "No account found with this email" },
        { status: 404 }
      );
    }

    // Check if user signed up with OAuth (Google/GitHub)
    if (user.provider && user.provider !== "email") {
      return NextResponse.json(
        {
          error: `This account uses ${user.provider} login. Please sign in with ${user.provider} instead.`,
        },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Save reset token and expiry (10 minutes)
    user.resetToken = otp;
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send email with OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS_ADMIN,
      },
    });

    const { html, text } = generatePasswordResetEmailTemplate(otp);

    await transporter.sendMail({
      from: process.env.EMAIL_ADMIN,
      to: email,
      subject: "Password Reset Code",
      text: text,
      html: html,
    });

    return NextResponse.json(
      { message: "Password reset code sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forget password error:", error);
    return NextResponse.json(
      { error: "Failed to send reset code. Please try again." },
      { status: 500 }
    );
  }
}

export const GET = POST;
