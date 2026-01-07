import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import Products from "@/models/Products";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const skip = (page - 1) * limit;

    const query = {
      discount: { $exists: true, $ne: null },
      status: "publish",
    };

    const products = await Products.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination info
    const totalCount = await Products.countDocuments(query);

    // Format response
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
      category: product.category,
      rating: product.rating,
      ratingAverage: product.ratingAverage,
      views: product.views,
      ratingCount: product.ratingCount,
      discount: product.discount,
      author: product.author,
      type: product.type,
      paymentType: product.paymentType,
      frameworks: product.frameworks,
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
    console.error("Error fetching products with discount:", error);
    return NextResponse.json(
      { error: "Failed to fetch products with discount" },
      { status: 500 }
    );
  }
}
