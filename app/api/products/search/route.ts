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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Check if query parameter is empty
    if (!q || q.trim() === "") {
      return NextResponse.json(
        {
          message:
            "Parameter 'q' tidak boleh kosong. Silakan masukkan kata kunci pencarian.",
        },
        { status: 400 }
      );
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build query object - search by productsId, title, or description
    const query: {
      $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
      productsId?: { $regex: string; $options: string };
      status?: string;
    } = {
      status: "publish", // Only show published products
    };

    if (q) {
      // Search in productsId, title, and description
      query.$or = [
        { productsId: { $regex: q, $options: "i" } },
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // Fetch products with pagination
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
      frameworks: product.frameworks,
      price: product.price,
      stock: product.stock,
      sold: product.sold,
      downloadUrl: product.downloadUrl,
      downloadCount: product.downloadCount,
      category: product.category,
      type: product.type,
      rating: product.rating,
      views: product.views,
      ratingCount: product.ratingCount,
      discount: product.discount,
      author: product.author,
      tags: product.tags,
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
      query: q,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
