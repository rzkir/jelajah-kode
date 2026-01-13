import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import Products from "@/models/Products";

import { checkAuthorization } from "@/lib/auth-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tagsId: string }> }
) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { tagsId } = await params;

    if (!tagsId || typeof tagsId !== "string") {
      return NextResponse.json(
        { error: "Invalid tagsId parameter" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort = searchParams.get("sort") || "newest";

    const skip = (page - 1) * limit;

    const query: {
      "tags.tagsId": string;
      status: string;
    } = {
      "tags.tagsId": tagsId,
      status: "publish",
    };

    let sortObj: { [key: string]: 1 | -1 } = { createdAt: -1 };
    switch (sort) {
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "price-low":
        sortObj = { price: 1 };
        break;
      case "price-high":
        sortObj = { price: -1 };
        break;
      case "rating":
        sortObj = { ratingAverage: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const products = await Products.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortObj);

    const totalCount = await Products.countDocuments(query);

    const formattedProducts = products.map((product: ProductsByTagsItem) => ({
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
      type: product.type,
      rating: product.rating,
      ratingAverage: product.ratingAverage,
      ratingCount: product.ratingCount,
      discount: product.discount,
      author: product.author,
      paymentType: product.paymentType,
      status: product.status,
      created_at: product.created_at,
      updated_at: product.updated_at,
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
    console.error("Error fetching products by tagsId:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
