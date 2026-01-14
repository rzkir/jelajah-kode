import { NextRequest, NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import { Subscription } from "@/models/Subscription";

import { emailSchema } from "@/hooks/validation";

import { getEmailService } from "@/lib/email-service";

// Get client IP address from request
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip"); // Cloudflare

  const ip =
    cfConnectingIp ||
    (forwarded ? forwarded.split(",")[0].trim() : null) ||
    realIp ||
    "unknown";

  return ip;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format and Gmail requirement
    const emailValidation = emailSchema.safeParse(email);
    if (!emailValidation.success) {
      return NextResponse.json(
        {
          error:
            emailValidation.error.issues[0]?.message ||
            "Email must be a Gmail address (@gmail.com)",
        },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Get client IP address
    const clientIP = getClientIP(request);

    // Skip IP check if IP is unknown (for development/testing)
    if (clientIP !== "unknown") {
      // Check if IP address already has a subscription
      const existingSubscriptionByIP = await Subscription.findOne({
        ipAddress: clientIP,
      });

      if (existingSubscriptionByIP) {
        return NextResponse.json(
          { error: "You have already subscribed from this IP address" },
          { status: 400 }
        );
      }
    }

    // Check if email already exists
    const existingSubscription = await Subscription.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 400 }
      );
    }

    // Create new subscription
    const subscription = new Subscription({
      email: email.toLowerCase().trim(),
      ipAddress: clientIP,
    });

    let savedSubscription;
    try {
      savedSubscription = await subscription.save();
    } catch (saveError: unknown) {
      // Handle duplicate key error (race condition)
      if (
        saveError &&
        typeof saveError === "object" &&
        "code" in saveError &&
        (saveError.code === 11000 || saveError.code === 11001)
      ) {
        return NextResponse.json(
          { error: "Email already subscribed" },
          { status: 400 }
        );
      }
      throw saveError;
    }

    // Send welcome email (non-blocking, don't fail subscription if email fails)
    try {
      const emailService = getEmailService();
      await emailService.sendSubscriptionWelcomeEmail(savedSubscription.email);
    } catch (emailError) {
      // Log error but don't fail the subscription
      console.error("Failed to send welcome email:", emailError);
    }

    return NextResponse.json(
      {
        message: "Successfully subscribed",
        subscription: {
          _id: savedSubscription._id.toString(),
          email: savedSubscription.email,
          created_at: savedSubscription.createdAt,
          updated_at: savedSubscription.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (email) {
      // Check if specific email is subscribed
      const subscription = await Subscription.findOne({
        email: email.toLowerCase().trim(),
      });

      if (!subscription) {
        return NextResponse.json({ subscribed: false }, { status: 200 });
      }

      return NextResponse.json({
        subscribed: true,
        subscription: {
          _id: subscription._id.toString(),
          email: subscription.email,
          created_at: subscription.createdAt,
          updated_at: subscription.updatedAt,
        },
      });
    }

    // Get all subscriptions (for admin use, might want to add auth check)
    const subscriptions = await Subscription.find({})
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({
      subscriptions: subscriptions.map((sub) => ({
        _id: sub._id.toString(),
        email: sub.email,
        created_at: sub.createdAt,
        updated_at: sub.updatedAt,
      })),
    });
  } catch (error: unknown) {
    console.error("Get subscriptions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}
