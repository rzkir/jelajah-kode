import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import { Types } from "mongoose";

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

    // Fetch articles by author/admin
    const articles = await Articles.find({
      "author._id": new Types.ObjectId(adminId),
      status: "publish",
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count
    const totalCount = await Articles.countDocuments({
      "author._id": new Types.ObjectId(adminId),
      status: "publish",
    });

    // Format response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedArticles = articles.map((article: any) => ({
      _id: article._id.toString(),
      articlesId: article.articlesId,
      title: article.title,
      thumbnail: article.thumbnail,
      description: article.description,
      category: article.category,
      author: article.author,
      tags: article.tags,
      status: article.status,
      created_at: article.createdAt,
      updated_at: article.updatedAt,
    }));

    return NextResponse.json({
      data: formattedArticles,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
