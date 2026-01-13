import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import { Types } from "mongoose";

import { Account } from "@/models/Account";

import Products from "@/models/Products";

import Articles from "@/models/Articles";

import { checkAuthorization } from "@/lib/auth-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ adminId: string }> }
) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { adminId } = await params;

    if (!adminId || typeof adminId !== "string") {
      return NextResponse.json(
        { error: "Invalid adminId parameter" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Check if adminId is a valid MongoDB ObjectId
    let admin;
    if (Types.ObjectId.isValid(adminId)) {
      admin = await Account.findById(adminId);
    } else {
      return NextResponse.json(
        { error: "Invalid admin ID format" },
        { status: 400 }
      );
    }

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Only return admins (not regular users)
    if (admin.role !== "admins") {
      return NextResponse.json(
        { error: "User is not an admin" },
        { status: 403 }
      );
    }

    // Get admin's products count
    const productsCount = await Products.countDocuments({
      "author._id": adminId,
      status: "publish",
    });

    // Get admin's articles count
    const articlesCount = await Articles.countDocuments({
      "author._id": adminId,
      status: "publish",
    });

    // Calculate average rating from all published products
    const publishedProducts = await Products.find({
      "author._id": adminId,
      status: "publish",
    }).select("ratingAverage");

    const ratingsWithValues = publishedProducts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((p: any) => p.ratingAverage)
      .filter(
        (rating: number | undefined): rating is number =>
          rating !== undefined && rating !== null && rating > 0
      );

    let averageRating = 0;
    if (ratingsWithValues.length > 0) {
      const totalRating = ratingsWithValues.reduce(
        (sum: number, rating: number) => sum + rating,
        0
      );
      averageRating = totalRating / ratingsWithValues.length;
    }

    // Get total download count and sold count from all published products
    const productsWithStats = await Products.find({
      "author._id": adminId,
      status: "publish",
    }).select("downloadCount sold");

    const downloadCount = productsWithStats.reduce(
      (total: number, product: { downloadCount?: number }) => {
        return total + (product.downloadCount || 0);
      },
      0
    );

    const totalSold = productsWithStats.reduce(
      (total: number, product: { sold?: number }) => {
        return total + (product.sold || 0);
      },
      0
    );

    // Format admin response
    const adminObj = admin.toObject() as {
      _id: { toString(): string };
      email: string;
      name: string;
      role: string;
      picture?: string;
      status: string;
      createdAt?: Date;
    };

    const adminData = {
      _id: adminObj._id.toString(),
      name: adminObj.name,
      email: adminObj.email,
      picture: adminObj.picture,
      role: adminObj.role,
      status: adminObj.status,
      created_at: adminObj.createdAt?.toISOString() || new Date().toISOString(),
      stats: {
        products: productsCount,
        articles: articlesCount,
        rating: parseFloat(averageRating.toFixed(1)),
        downloads: downloadCount,
        sold: totalSold,
      },
    };

    return NextResponse.json(adminData);
  } catch (error) {
    console.error("Error fetching admin:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin" },
      { status: 500 }
    );
  }
}
