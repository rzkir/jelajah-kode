import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import Products from "@/models/Products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId } = await params;

    if (!categoryId || typeof categoryId !== "string") {
      return NextResponse.json(
        { error: "Invalid categoryId parameter" },
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
      "category.categoryId": string;
      status: string;
    } = {
      "category.categoryId": categoryId,
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

    const formattedProducts = products.map(
      (product: ProductsByCategoryItem) => ({
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
      })
    );

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
    console.error("Error fetching products by categoryId:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
