import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import Products from "@/models/Products";

import { checkAuthorization } from "@/lib/auth-utils";

export async function GET(request: Request) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const query = {
      status: "publish",
      sold: { $gt: 0 },
    };

    const products = await Products.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ sold: -1, createdAt: -1 });

    const totalCount = await Products.countDocuments(query);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedProducts = products.map((product: any) => ({
      _id: product._id.toString(),
      productsId: product.productsId,
      title: product.title,
      thumbnail: product.thumbnail,
      price: product.price,
      stock: product.stock,
      sold: product.sold,
      downloadCount: product.downloadCount,
      ratingAverage: product.ratingAverage,
      ratingCount: product.ratingCount,
      category: product.category,
      frameworks: product.frameworks,
      discount: product.discount,
      author: product.author,
      type: product.type,
      paymentType: product.paymentType,
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
    console.error("Error fetching most saled products:", error);
    return NextResponse.json(
      { error: "Failed to fetch most saled products" },
      { status: 500 }
    );
  }
}
