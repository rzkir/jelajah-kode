import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import Articles from "@/models/Articles";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ articlesId: string }> }
) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { articlesId } = await params;

    if (!articlesId || typeof articlesId !== "string") {
      return NextResponse.json(
        { error: "Invalid articlesId parameter" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find article by articlesId
    const article = await Articles.findOne({ articlesId });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Format the article response to match the frontend interface
    const formattedArticle = {
      _id: article._id.toString(),
      title: article.title,
      articlesId: article.articlesId,
      thumbnail: article.thumbnail,
      description: article.description,
      content: article.content,
      category: article.category,
      author: article.author,
      tags: article.tags,
      status: article.status,
      created_at: article.createdAt,
      updated_at: article.updatedAt,
    };

    return NextResponse.json(formattedArticle);
  } catch (error) {
    console.error("Error fetching article by articlesId:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
