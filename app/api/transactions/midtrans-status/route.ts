import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectMongoDB } from "@/lib/mongodb";
import { Account } from "@/models/Account";
import Transactions from "@/models/Transactions";
import { verifyJWT } from "@/hooks/jwt";
import { coreApi } from "@/lib/midtrans";
import { updateProductStatsOnSuccess } from "@/hooks/updateProductStats";

export async function GET(request: NextRequest) {
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

    // Get order_id from query params
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Find transaction by order_id
    const transaction = await Transactions.findOne({ order_id: orderId });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Verify that the transaction belongs to the current user
    if (transaction.user._id.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Unauthorized to view this transaction" },
        { status: 403 }
      );
    }

    // Get transaction status from Midtrans
    let midtransStatus = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      midtransStatus = await (coreApi as any).transaction.status(orderId);
    } catch (error: unknown) {
      // Handle 404 error (transaction not found in Midtrans yet)
      if (
        error &&
        typeof error === "object" &&
        "httpStatusCode" in error &&
        error.httpStatusCode === "404"
      ) {
        // Transaction doesn't exist in Midtrans yet (maybe not paid yet)
        // This is normal for pending transactions
        console.log(`Transaction ${orderId} not found in Midtrans yet`);
      } else {
        console.error("Midtrans status error:", error);
      }
      // Continue even if Midtrans API fails
    }

    // Update transaction with payment details if available
    if (midtransStatus) {
      const paymentDetails: {
        payment_type?: string;
        bank?: string;
        va_number?: string;
        transaction_id?: string;
        transaction_time?: string;
        settlement_time?: string;
        currency?: string;
      } = {};

      if (midtransStatus.payment_type) {
        paymentDetails.payment_type = midtransStatus.payment_type;
      }

      // Handle bank transfer (VA)
      if (midtransStatus.va_numbers && midtransStatus.va_numbers.length > 0) {
        paymentDetails.bank = midtransStatus.va_numbers[0].bank?.toUpperCase();
        paymentDetails.va_number = midtransStatus.va_numbers[0].va_number;
      }

      // Handle credit card
      if (midtransStatus.payment_type === "credit_card") {
        paymentDetails.bank = midtransStatus.bank;
      }

      if (midtransStatus.transaction_id) {
        paymentDetails.transaction_id = midtransStatus.transaction_id;
      }

      if (midtransStatus.transaction_time) {
        paymentDetails.transaction_time = midtransStatus.transaction_time;
      }

      if (midtransStatus.settlement_time) {
        paymentDetails.settlement_time = midtransStatus.settlement_time;
      }

      if (midtransStatus.currency) {
        paymentDetails.currency = midtransStatus.currency;
      }

      // Only update if payment_details has data
      if (Object.keys(paymentDetails).length > 0) {
        // Update transaction with payment details
        transaction.payment_details = paymentDetails;
      }

      // Update status if changed
      if (midtransStatus.transaction_status) {
        const statusMap: Record<
          string,
          "pending" | "success" | "expired" | "canceled"
        > = {
          pending: "pending",
          settlement: "success",
          success: "success",
          expire: "expired",
          cancel: "canceled",
          deny: "canceled",
        };

        const newStatus = statusMap[midtransStatus.transaction_status];
        if (newStatus) {
          // Get previous status to check if we need to update products
          const previousStatus = transaction.status;
          transaction.status = newStatus;

          // If status changed to "success", update product stats (stock and sold)
          if (newStatus === "success" && previousStatus !== "success") {
            await updateProductStatsOnSuccess(
              transaction.products.map(
                (p: { _id: string; quantity: number }) => ({
                  _id: p._id,
                  quantity: p.quantity,
                })
              )
            );
          }
        }
      }

      await transaction.save();
    }

    // Reload transaction to ensure we have the latest data
    const finalTransaction = await Transactions.findOne({ order_id: orderId });
    const transactionObj = finalTransaction
      ? finalTransaction.toObject()
      : transaction.toObject();

    const response = {
      _id: transactionObj._id.toString(),
      order_id: transactionObj.order_id,
      status: transactionObj.status,
      payment_details: transactionObj.payment_details || null,
      updated_at:
        transactionObj.updatedAt?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get Midtrans status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction status" },
      { status: 500 }
    );
  }
}
