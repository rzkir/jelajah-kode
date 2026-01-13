import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import Articles from "@/models/Articles";

import { checkAuthorization } from "@/lib/auth-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
      default:
        sortObj = { createdAt: -1 };
    }

    const articles = await Articles.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortObj);

    const totalCount = await Articles.countDocuments(query);

    const formattedArticles = articles.map((article: Articles) => ({
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
    console.error("Error fetching articles by categoryId:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
