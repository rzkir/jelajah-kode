import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectMongoDB } from "@/lib/mongodb";
import { Account } from "@/models/Account";
import Ratings from "@/models/Ratings";
import Products from "@/models/Products";
import Transactions from "@/models/Transactions";
import { verifyJWT } from "@/hooks/jwt";

// GET - Check if user has rated a product or get ratings for a product
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

    // Get productsId from query params
    const { searchParams } = new URL(request.url);
    const productsId = searchParams.get("productsId");

    if (!productsId) {
      return NextResponse.json(
        { error: "productsId is required" },
        { status: 400 }
      );
    }

    // Check if user has already rated this product
    const existingRating = await Ratings.findOne({
      productsId,
      "author._id": user._id.toString(),
    });

    if (existingRating) {
      const ratingObj = existingRating.toObject();
      return NextResponse.json({
        hasRated: true,
        rating: {
          _id: ratingObj._id.toString(),
          productsId: ratingObj.productsId,
          rating: ratingObj.rating,
          comment: ratingObj.comment,
          author: ratingObj.author,
          created_at:
            ratingObj.createdAt?.toISOString() || new Date().toISOString(),
          updated_at:
            ratingObj.updatedAt?.toISOString() || new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ hasRated: false });
  } catch (error) {
    console.error("Get rating error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rating" },
      { status: 500 }
    );
  }
}

// POST - Submit a rating
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
    const { productsId, rating, comment } = body;

    if (!productsId || !rating || !comment) {
      return NextResponse.json(
        { error: "productsId, rating, and comment are required" },
        { status: 400 }
      );
    }

    // Validate rating
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate comment
    if (typeof comment !== "string" || comment.trim().length === 0) {
      return NextResponse.json(
        { error: "Comment is required" },
        { status: 400 }
      );
    }

    if (comment.length > 1000) {
      return NextResponse.json(
        { error: "Comment must be less than 1000 characters" },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await Products.findOne({ productsId });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify user has a successful transaction for this product
    const successfulTransaction = await Transactions.findOne({
      "user._id": user._id.toString(),
      status: "success",
      "products.productsId": productsId,
    });

    if (!successfulTransaction) {
      return NextResponse.json(
        { error: "You must purchase this product before rating" },
        { status: 403 }
      );
    }

    // Check if user has already rated this product
    const existingRating = await Ratings.findOne({
      productsId,
      "author._id": user._id.toString(),
    });

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.comment = comment.trim();
      await existingRating.save();

      // Update product rating average
      await updateProductRating(product._id.toString());

      const ratingObj = existingRating.toObject();
      return NextResponse.json(
        {
          _id: ratingObj._id.toString(),
          productsId: ratingObj.productsId,
          rating: ratingObj.rating,
          comment: ratingObj.comment,
          author: ratingObj.author,
          created_at:
            ratingObj.createdAt?.toISOString() || new Date().toISOString(),
          updated_at:
            ratingObj.updatedAt?.toISOString() || new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Create new rating
    const newRating = new Ratings({
      productsId,
      rating,
      comment: comment.trim(),
      author: {
        _id: user._id.toString(),
        name: user.name,
        picture: user.picture || "",
        role: user.role,
      },
    });

    await newRating.save();

    // Update product rating average
    await updateProductRating(product._id.toString());

    const ratingObj = newRating.toObject();
    return NextResponse.json(
      {
        _id: ratingObj._id.toString(),
        productsId: ratingObj.productsId,
        rating: ratingObj.rating,
        comment: ratingObj.comment,
        author: ratingObj.author,
        created_at:
          ratingObj.createdAt?.toISOString() || new Date().toISOString(),
        updated_at:
          ratingObj.updatedAt?.toISOString() || new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create rating error:", error);
    return NextResponse.json(
      { error: "Failed to create rating" },
      { status: 500 }
    );
  }
}

// Helper function to update product rating average
async function updateProductRating(productId: string): Promise<void> {
  try {
    const product = await Products.findById(productId);
    if (!product) {
      return;
    }

    const ratings = await Ratings.find({
      productsId: product.productsId,
    });

    if (ratings.length === 0) {
      return;
    }

    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / ratings.length;

    await Products.findByIdAndUpdate(productId, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      ratingCount: ratings.length,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
}
