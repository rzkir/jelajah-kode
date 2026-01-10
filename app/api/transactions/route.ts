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

    // If no order_id, return all transactions for the user
    if (!orderId) {
      const allTransactions = await Transactions.find({
        "user._id": user._id.toString(),
      })
        .sort({ createdAt: -1 })
        .limit(100);

      const transactionsList = allTransactions.map(
        (txn: { toObject: () => unknown }) => {
          const txnObj = txn.toObject() as {
            _id: { toString(): string };
            products: unknown[];
            user: { _id: { toString(): string } };
            paymentMethod: string;
            status: string;
            total_amount?: number;
            order_id?: string;
            snap_token?: string;
            payment_details?: unknown;
            createdAt?: Date;
            updatedAt?: Date;
          };
          return {
            _id: txnObj._id.toString(),
            products: txnObj.products,
            user: txnObj.user,
            paymentMethod: txnObj.paymentMethod,
            status: txnObj.status,
            total_amount: txnObj.total_amount,
            order_id: txnObj.order_id,
            snap_token: txnObj.snap_token || null,
            payment_details: txnObj.payment_details || null,
            created_at:
              txnObj.createdAt?.toISOString() || new Date().toISOString(),
            updated_at:
              txnObj.updatedAt?.toISOString() || new Date().toISOString(),
          };
        }
      );

      return NextResponse.json(transactionsList, { status: 200 });
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

    // If paid transaction and still pending (or missing payment_details), fetch latest status from Midtrans
    const hasPaymentDetails =
      transaction.payment_details && transaction.payment_details.payment_type;

    if (
      transaction.paymentMethod === "paid" &&
      transaction.order_id &&
      (transaction.status === "pending" || !hasPaymentDetails)
    ) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const midtransStatus = await (coreApi as any).transaction.status(
          transaction.order_id
        );

        if (midtransStatus && midtransStatus.transaction_status) {
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
          if (
            midtransStatus.va_numbers &&
            midtransStatus.va_numbers.length > 0
          ) {
            paymentDetails.bank =
              midtransStatus.va_numbers[0].bank?.toUpperCase();
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

          // Update transaction with payment details
          transaction.payment_details = paymentDetails;

          // Update status if changed
          if (midtransStatus.transaction_status) {
            const statusMap: Record<
              string,
              "pending" | "success" | "expired" | "canceled"
            > = {
              pending: "pending",
              settlement: "success",
              success: "success",
              capture: "success", // credit card transactions often use "capture"
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

          // Reload transaction to get updated data
          await transaction.populate();
        }
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
          console.log(
            `Transaction ${transaction.order_id} not found in Midtrans yet`
          );
        } else {
          console.error(
            "Failed to fetch payment details from Midtrans:",
            error
          );
        }
        // Continue even if Midtrans API fails
      }
    }

    // Reload transaction to ensure we have the latest data
    const updatedTransaction = await Transactions.findOne({
      order_id: orderId,
    });
    const transactionObj = updatedTransaction
      ? updatedTransaction.toObject()
      : transaction.toObject();
    const response = {
      _id: transactionObj._id.toString(),
      products: transactionObj.products,
      user: transactionObj.user,
      paymentMethod: transactionObj.paymentMethod,
      status: transactionObj.status,
      total_amount: transactionObj.total_amount,
      order_id: transactionObj.order_id,
      snap_token: transactionObj.snap_token || null,
      payment_details: transactionObj.payment_details || null,
      created_at:
        transactionObj.createdAt?.toISOString() || new Date().toISOString(),
      updated_at:
        transactionObj.updatedAt?.toISOString() || new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Get transaction error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 }
    );
  }
}
