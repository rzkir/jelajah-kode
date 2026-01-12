import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";

import { connectMongoDB } from "@/lib/mongodb";

import { Account } from "@/models/Account";

import Transactions from "@/models/Transactions";

import { verifyJWT } from "@/hooks/jwt";

export async function DELETE(request: NextRequest) {
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

    // Only admins can delete transactions
    if (user.role !== "admins") {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("id");
    const orderId = searchParams.get("order_id");

    if (!transactionId && !orderId) {
      return NextResponse.json(
        { error: "Transaction ID or Order ID is required" },
        { status: 400 }
      );
    }

    // Find transaction
    const transaction = transactionId
      ? await Transactions.findById(transactionId)
      : await Transactions.findOne({ order_id: orderId });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Delete transaction
    await Transactions.findByIdAndDelete(transaction._id);

    return NextResponse.json(
      { message: "Transaction deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete transaction error:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}

