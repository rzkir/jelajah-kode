import { NextRequest, NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import Ratings from "@/models/Ratings";

import { checkAuthorization } from "@/lib/auth-utils";

// GET - Get all ratings for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productsId: string }> }
) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();

    const { productsId } = await params;

    if (!productsId || typeof productsId !== "string") {
      return NextResponse.json(
        { error: "Invalid productsId parameter" },
        { status: 400 }
      );
    }

    // Get query params for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Fetch ratings for this product, sorted by newest first
    const ratings = await Ratings.find({ productsId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Ratings.countDocuments({ productsId });

    // Format ratings
    const formattedRatings = ratings.map((rating) => {
      const ratingObj = rating.toObject();
      return {
        _id: ratingObj._id.toString(),
        productsId: ratingObj.productsId,
        rating: ratingObj.rating,
        comment: ratingObj.comment,
        author: ratingObj.author,
        created_at:
          ratingObj.createdAt?.toISOString() || new Date().toISOString(),
        updated_at:
          ratingObj.updatedAt?.toISOString() || new Date().toISOString(),
      };
    });

    return NextResponse.json({
      ratings: formattedRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get ratings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}
