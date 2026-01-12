import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectMongoDB } from "@/lib/mongodb";
import { Account } from "@/models/Account";
import Transactions from "@/models/Transactions";
import { verifyJWT } from "@/hooks/jwt";
import { updateProductStatsOnSuccess } from "@/hooks/updateProductStats";

export async function PUT(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { order_id, status } = body;

    if (!order_id || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["pending", "success", "expired", "canceled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error:
            "Invalid status. Must be one of: pending, success, expired, canceled",
        },
        { status: 400 }
      );
    }

    // Find transaction by order_id
    const transaction = await Transactions.findOne({ order_id });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Verify that the transaction belongs to the current user
    if (transaction.user._id.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Unauthorized to update this transaction" },
        { status: 403 }
      );
    }

    // Get previous status to check if we need to update products
    const previousStatus = transaction.status;

    // Update transaction status
    transaction.status = status;
    await transaction.save();

    // If status changed to "success", update product stats (stock and sold)
    if (status === "success" && previousStatus !== "success") {
      await updateProductStatsOnSuccess(
        transaction.products.map((p: { _id: string; quantity: number }) => ({
          _id: p._id,
          quantity: p.quantity,
        }))
      );
    }

    // Format response
    const transactionObj = transaction.toObject();
    const response = {
      _id: transactionObj._id.toString(),
      order_id: transactionObj.order_id,
      status: transactionObj.status,
      updated_at:
        transactionObj.updatedAt?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Update transaction error:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}
