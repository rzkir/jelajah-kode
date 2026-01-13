import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import { Types } from "mongoose";

import Products from "@/models/Products";

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

    if (!Types.ObjectId.isValid(adminId)) {
      return NextResponse.json(
        { error: "Invalid admin ID format" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;
    const sortBy = searchParams.get("sort") || "createdAt"; // "createdAt" or "popular"

    // Determine sort order
    let sortOrder: Record<string, 1 | -1> = { createdAt: -1 };
    if (sortBy === "popular") {
      sortOrder = { downloadCount: -1, createdAt: -1 };
    }

    // Fetch products by author/admin
    const products = await Products.find({
      "author._id": new Types.ObjectId(adminId),
      status: "publish",
    })
      .skip(skip)
      .limit(limit)
      .sort(sortOrder);

    // Get total count
    const totalCount = await Products.countDocuments({
      "author._id": new Types.ObjectId(adminId),
      status: "publish",
    });

    // Format response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedProducts = products.map((product: any) => ({
      _id: product._id.toString(),
      productsId: product.productsId,
      title: product.title,
      thumbnail: product.thumbnail,
      frameworks: product.frameworks,
      price: product.price,
      stock: product.stock,
      sold: product.sold,
      downloadCount: product.downloadCount,
      category: product.category,
      ratingAverage: product.ratingAverage,
      ratingCount: product.ratingCount,
      views: product.views,
      discount: product.discount,
      author: product.author,
      tags: product.tags,
      type: product.type,
      paymentType: product.paymentType,
      status: product.status,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
    }));

    return NextResponse.json({
      data: formattedProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
