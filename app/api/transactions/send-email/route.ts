import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";

import { connectMongoDB } from "@/lib/mongodb";

import { Account } from "@/models/Account";

import Transactions from "@/models/Transactions";

import { verifyJWT } from "@/hooks/jwt";

import { getEmailService } from "@/lib/email-service";

export async function POST(request: NextRequest) {
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

    // Get user
    const user = await Account.findById(decodedToken._id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only admins can send emails
    if (user.role !== "admins") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const { order_id } = await request.json();

    if (!order_id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find transaction
    const transaction = await Transactions.findOne({ order_id });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Check if transaction is pending
    if (transaction.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending transactions can receive email notifications" },
        { status: 400 }
      );
    }

    // Prepare products data for email
    const products = transaction.products.map(
      (product: { title: string; quantity: number; price: number }) => ({
        title: product.title,
        quantity: product.quantity,
        price: product.price,
      })
    );

    // Send email
    const emailService = getEmailService();
    await emailService.sendTransactionPendingEmail(
      transaction.user.email,
      transaction.order_id || "",
      transaction.user.name,
      transaction.total_amount || 0,
      products
    );

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
