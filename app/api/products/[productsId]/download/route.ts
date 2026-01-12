import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectMongoDB } from "@/lib/mongodb";
import { Account } from "@/models/Account";
import Products from "@/models/Products";
import Transactions from "@/models/Transactions";
import { verifyJWT } from "@/hooks/jwt";
import { incrementProductDownloadCount } from "@/hooks/updateProductStats";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productsId: string }> }
) {
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

    const { productsId } = await params;

    if (!productsId || typeof productsId !== "string") {
      return NextResponse.json(
        { error: "Invalid productsId parameter" },
        { status: 400 }
      );
    }

    // Find product by productsId
    const product = await Products.findOne({ productsId });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify user has a successful transaction for this product
    // Check by productsId (more reliable than _id)
    const successfulTransaction = await Transactions.findOne({
      "user._id": user._id.toString(),
      status: "success",
      "products.productsId": productsId,
    });

    if (!successfulTransaction) {
      return NextResponse.json(
        { error: "You must purchase this product before downloading" },
        { status: 403 }
      );
    }

    // Increment download count
    await incrementProductDownloadCount(product._id.toString());

    // Return success response
    return NextResponse.json(
      { message: "Download count updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating download count:", error);
    return NextResponse.json(
      { error: "Failed to update download count" },
      { status: 500 }
    );
  }
}
