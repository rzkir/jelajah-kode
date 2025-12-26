import { NextResponse } from "next/server";

import { Account } from "@/models/Account";

import { generateJWT } from "@/utils/auth/token";

import { connectToDatabase } from "@/lib/mongodb";

import nodemailer from "nodemailer";

import { generateVerificationEmailTemplate } from "@/hooks/template-message";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();

    await connectToDatabase();

    // Check if account already exists
    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new account with OTP
    const account = new Account({
      email,
      password,
      name,
      role: role || "user",
      provider: "email",
      verificationToken: otp,
      verificationTokenExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    const savedAccount = await account.save();

    // Ensure the account was properly saved
    // Check both the returned saved account and the original account
    if ((!savedAccount || !savedAccount._id) && (!account || !account._id)) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    // Send OTP to user's email
    const emailService = process.env.EMAIL_SERVICE;
    const emailUser = process.env.EMAIL_ADMIN;
    const emailPass = process.env.EMAIL_PASS_ADMIN;

    if (!emailUser || !emailPass) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const { html, text } = generateVerificationEmailTemplate(otp);

    await transporter.sendMail({
      from: emailUser,
      to: account.email,
      subject: "Welcome to Jelajah Kode! Email Verification Code",
      html,
      text,
    });

    return NextResponse.json(
      {
        message:
          "Account created successfully. Verification OTP sent to your email.",
        userId: account._id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { token } = await request.json();

    await connectToDatabase();

    const account = await Account.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Mark account as verified
    account.isVerified = "true" as const;
    account.verificationToken = undefined;
    account.verificationTokenExpiry = undefined;
    await account.save();

    // Generate JWT token
    const jwtToken = await generateJWT({
      _id: account._id,
      email: account.email,
      role: account.role,
    });

    const response = NextResponse.json({
      message: "Email verification successful",
      user: {
        _id: account._id,
        email: account.email,
        name: account.name,
        status: account.status,
        isVerified: account.isVerified,
        role: account.role,
        picture: account.picture,
      },
    });

    response.cookies.set({
      name: "token",
      value: jwtToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: unknown) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
