import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectMongoDB } from "@/lib/mongodb";
import { Account } from "@/models/Account";
import Transactions from "@/models/Transactions";
import Products from "@/models/Products";
import { verifyJWT } from "@/hooks/jwt";
import { snap } from "@/lib/midtrans";
import {
  calculateDiscountedPrice,
  getActiveDiscount,
} from "@/hooks/discountServices";

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

    try {
      await verifyJWT(token);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get products from query params
    const { searchParams } = new URL(request.url);
    const productsParam = searchParams.get("products");

    if (!productsParam) {
      return NextResponse.json([]);
    }

    // Parse products from query string format: "id1:qty1,id2:qty2"
    const productEntries = productsParam.split(",").map((entry) => {
      const [id, qty] = entry.split(":");
      return {
        productId: id,
        quantity: parseInt(qty, 10) || 1,
      };
    });

    if (productEntries.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch products from database
    const productIds = productEntries.map((p) => p.productId);
    const dbProducts = await Products.find({
      _id: { $in: productIds },
      status: "publish",
    });

    if (dbProducts.length === 0) {
      return NextResponse.json([]);
    }

    // Format products for checkout
    const checkoutProducts = productEntries
      .map((entry) => {
        const dbProduct = dbProducts.find(
          (p: { _id: { toString(): string } }) =>
            p._id.toString() === entry.productId
        );

        if (!dbProduct) {
          return null;
        }

        const quantity = entry.quantity || 1;

        return {
          _id: dbProduct._id.toString(),
          productsId: dbProduct.productsId,
          title: dbProduct.title,
          thumbnail: dbProduct.thumbnail,
          price: dbProduct.price, // Keep original price, discount will be calculated on frontend
          quantity: quantity,
          discount: dbProduct.discount,
          paymentType: dbProduct.paymentType,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    return NextResponse.json(checkoutProducts);
  } catch (error) {
    console.error("Error fetching checkout products:", error);
    return NextResponse.json(
      { error: "Failed to fetch checkout products" },
      { status: 500 }
    );
  }
}

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

    // Parse request body
    const body = await request.json();
    const { products } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "Products are required" },
        { status: 400 }
      );
    }

    // Validate and fetch products
    const productIds = products.map((p: { productId: string }) => p.productId);
    const dbProducts = await Products.find({
      _id: { $in: productIds },
      status: "publish",
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "Some products not found or not available" },
        { status: 400 }
      );
    }

    // Calculate total and prepare transaction products
    let totalAmount = 0;
    const transactionProducts = [];
    const hasPaidProducts = dbProducts.some(
      (p: { paymentType: string }) => p.paymentType === "paid"
    );

    for (const productData of products) {
      const dbProduct = dbProducts.find(
        (p: { _id: { toString(): string } }) =>
          p._id.toString() === productData.productId
      );

      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product ${productData.productId} not found` },
          { status: 400 }
        );
      }

      const quantity = productData.quantity || 1;

      // Calculate price with discount
      const activeDiscount = getActiveDiscount(dbProduct.discount);
      const itemPrice = calculateDiscountedPrice(
        dbProduct.price,
        activeDiscount
      );

      const amount = itemPrice * quantity;
      totalAmount += amount;

      // Prepare product item for transaction (flattened structure)
      transactionProducts.push({
        _id: dbProduct._id.toString(),
        productsId: dbProduct.productsId,
        title: dbProduct.title,
        thumbnail: dbProduct.thumbnail,
        price: itemPrice,
        quantity: quantity,
        downloadUrl: dbProduct.downloadUrl,
        paymentType: dbProduct.paymentType,
        discount: dbProduct.discount,
        amount: amount,
      });
    }

    // Determine payment method
    const paymentMethod = hasPaidProducts ? "paid" : "free";

    // Prepare user data
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
    };

    // Determine initial status - success for free products, pending for paid
    const initialStatus = paymentMethod === "free" ? "success" : "pending";

    // Create transaction
    const transaction = new Transactions({
      products: transactionProducts,
      user: userData,
      paymentMethod: paymentMethod,
      status: initialStatus,
      total_amount: totalAmount,
    });

    // Save transaction (order_id will be generated by pre-save hook)
    await transaction.save();

    // Get order_id (should be set by pre-save hook)
    const orderId = transaction.order_id;

    if (!orderId) {
      // Fallback: generate order_id if pre-save hook didn't set it
      const fallbackOrderId = `ORDER-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`;
      transaction.order_id = fallbackOrderId;
      await transaction.save();
    }

    let snapToken = null;

    // Generate Midtrans snap token for paid products
    if (paymentMethod === "paid" && totalAmount > 0) {
      try {
        const parameter = {
          transaction_details: {
            order_id: transaction.order_id,
            gross_amount: totalAmount,
          },
          customer_details: {
            first_name: user.name,
            email: user.email,
          },
          item_details: transactionProducts.map((tp) => ({
            id: tp.productsId,
            price: tp.price,
            quantity: tp.quantity,
            name: tp.title,
          })),
        };

        const snapResponse = await snap.createTransaction(parameter);
        snapToken = snapResponse.token;

        // Update transaction with snap token
        transaction.snap_token = snapToken;
        await transaction.save();
      } catch (error) {
        console.error("Midtrans error:", error);
        // If Midtrans fails, still save transaction but mark as error
        transaction.status = "canceled";
        await transaction.save();
        return NextResponse.json(
          { error: "Failed to create payment transaction" },
          { status: 500 }
        );
      }
    } else {
      // For free products, ensure transaction is saved with final status
      // Refresh transaction from database to ensure all data is current
      await transaction.save();

      // Update product stats (stock and sold) for free products
      // Since free products have status "success" immediately
      if (paymentMethod === "free" && initialStatus === "success") {
        await updateProductStatsOnSuccess(
          transactionProducts.map((tp) => ({
            _id: tp._id,
            quantity: tp.quantity,
          }))
        );
      }
    }

    // Refresh transaction from database to ensure we have the latest data
    const savedTransaction = await Transactions.findById(transaction._id);

    if (!savedTransaction) {
      return NextResponse.json(
        { error: "Failed to retrieve saved transaction" },
        { status: 500 }
      );
    }

    // Format response
    const transactionObj = savedTransaction.toObject();
    const response = {
      _id: transactionObj._id.toString(),
      order_id: transactionObj.order_id,
      snap_token: snapToken,
      total_amount: totalAmount,
      paymentMethod: paymentMethod,
      status: transactionObj.status,
      created_at:
        transactionObj.createdAt?.toISOString() || new Date().toISOString(),
      updated_at:
        transactionObj.updatedAt?.toISOString() || new Date().toISOString(),
    };

    console.log("Transaction created successfully:", {
      _id: response._id,
      order_id: response.order_id,
      paymentMethod: response.paymentMethod,
      status: response.status,
      total_amount: response.total_amount,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
