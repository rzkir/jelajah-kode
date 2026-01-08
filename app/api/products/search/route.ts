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
    const categories =
      searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const types = searchParams.get("types")?.split(",").filter(Boolean) || [];
    const tech = searchParams.get("tech")?.split(",").filter(Boolean) || [];
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");
    const popular = searchParams.get("popular") === "true";
    const newArrivals = searchParams.get("new") === "true";
    const sort = searchParams.get("sort") || "newest";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build query object - search by productsId, title, or description
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
      status: "publish", // Only show published products
    };

    // If query is provided, search in productsId, title, and description
    // If query is empty, show all published products
    if (q && q.trim() !== "") {
      query.$or = [
        { productsId: { $regex: q, $options: "i" } },
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // Filter by categories
    if (categories.length > 0) {
      query["category.categoryId"] = { $in: categories };
    }

    // Filter by types
    if (types.length > 0) {
      query["type.typeId"] = { $in: types };
    }

    // Filter by tech stack (frameworks)
    if (tech.length > 0) {
      query["frameworks.title"] = { $in: tech };
    }

    // Filter by max price
    if (maxPrice) {
      query.price = { $lte: parseInt(maxPrice) };
    }

    // Filter by minimum rating
    if (minRating) {
      query.ratingAverage = { $gte: parseFloat(minRating) };
    }

    // Filter by popular (e.g., high view count or sold count)
    if (popular) {
      query.$or = query.$or || [];
      if (query.$or.length === 0) {
        delete query.$or;
      }
      // Consider popular as having high views or sales
      query.views = { $gte: 100 };
    }

    // Filter by new arrivals (last 30 days)
    if (newArrivals) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.createdAt = { $gte: thirtyDaysAgo };
    }

    // Build sort object
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

    // Fetch products with pagination
    const products = await Products.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortObj);

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
      ratingAverage: product.ratingAverage,
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
