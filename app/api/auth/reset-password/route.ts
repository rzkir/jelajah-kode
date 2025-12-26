import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Account } from "@/models/Account";
import nodemailer from "nodemailer";
import { generatePasswordResetEmailTemplate } from "@/hooks/template-message";

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST - Send reset password OTP
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
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to send reset code. Please try again." },
      { status: 500 }
    );
  }
}

// PUT - Verify OTP and reset password
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    // Validate password
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Find user with valid reset token
    const user = await Account.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset code" },
        { status: 400 }
      );
    }

    // Update password
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password verification error:", error);
    return NextResponse.json(
      { error: "Failed to reset password. Please try again." },
      { status: 500 }
    );
  }
}

export const GET = POST;
