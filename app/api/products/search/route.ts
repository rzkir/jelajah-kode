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
    const minPrice = searchParams.get("minPrice");
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

    // Store search conditions separately to combine with popular filter if needed
    const searchConditions =
      q && q.trim() !== ""
        ? [
            { productsId: { $regex: q, $options: "i" } },
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
          ]
        : null;

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

    // Filter by price range (considering discount)
    // We'll handle this in aggregation pipeline to calculate discounted price
    const priceRangeFilter = minPrice || maxPrice;

    // Filter by minimum rating
    if (minRating) {
      query.ratingAverage = { $gte: parseFloat(minRating) };
    }

    // Filter by popular (products with downloads)
    if (popular) {
      // Consider popular as having downloads (similar to /api/products/popular)
      const popularCondition = { downloadCount: { $gt: 0 } };

      // If there's a search query, combine with $and
      if (searchConditions) {
        query.$and = [{ $or: searchConditions }, popularCondition];
      } else {
        // No search query, just use popular condition
        query.downloadCount = { $gt: 0 };
      }
    } else if (searchConditions) {
      // Only search query, no popular filter
      query.$or = searchConditions;
    }

    // Filter by new arrivals (last 30 days)
    if (newArrivals) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.createdAt = { $gte: thirtyDaysAgo };
    }

    // Build aggregation pipeline
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline: any[] = [{ $match: query }];

    // Add field to calculate final price (considering discount)
    // Check if discount exists and is not expired
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    pipeline.push({
      $addFields: {
        finalPrice: {
          $cond: {
            if: {
              $and: [
                { $ne: ["$discount", null] },
                { $ne: ["$discount", {}] },
                {
                  $or: [
                    { $not: "$discount.until" },
                    { $eq: ["$discount.until", ""] },
                    {
                      $and: [
                        { $ne: ["$discount.until", null] },
                        {
                          $gt: [
                            {
                              $dateFromString: {
                                dateString: "$discount.until",
                                onError: new Date(0), // Return epoch if invalid
                              },
                            },
                            today,
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            then: {
              $cond: {
                if: { $eq: ["$discount.type", "percentage"] },
                then: {
                  $multiply: [
                    "$price",
                    { $subtract: [1, { $divide: ["$discount.value", 100] }] },
                  ],
                },
                else: {
                  $max: [0, { $subtract: ["$price", "$discount.value"] }],
                },
              },
            },
            else: "$price",
          },
        },
      },
    });

    // Filter by price range using finalPrice
    if (priceRangeFilter) {
      const priceMatch: { $gte?: number; $lte?: number } = {};
      if (minPrice) {
        priceMatch.$gte = parseInt(minPrice);
      }
      if (maxPrice) {
        priceMatch.$lte = parseInt(maxPrice);
      }
      pipeline.push({ $match: { finalPrice: priceMatch } });
    }

    // Build sort object
    let sortObj: { [key: string]: 1 | -1 } = { createdAt: -1 };
    switch (sort) {
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "price-low":
        sortObj = { finalPrice: 1 };
        break;
      case "price-high":
        sortObj = { finalPrice: -1 };
        break;
      case "rating":
        sortObj = { ratingAverage: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    // Add sort and pagination
    pipeline.push({ $sort: sortObj });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // Execute aggregation
    const products = await Products.aggregate(pipeline);

    // Get total count (need to run separate aggregation for count)
    const countPipeline = [...pipeline];
    countPipeline.pop(); // Remove limit
    countPipeline.pop(); // Remove skip
    countPipeline.push({ $count: "total" });
    const countResult = await Products.aggregate(countPipeline);
    const totalCount = countResult[0]?.total || 0;

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
