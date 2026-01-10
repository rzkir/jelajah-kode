import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import { Types } from "mongoose";

import mongoose from "mongoose";

import Articles from "@/models/Articles";

export async function GET(request: Request) {
  try {
    await connectMongoDB();

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Check if there's an id parameter for single article lookup
    const id = searchParams.get("id");

    // For single article lookup by ID, allow without auth (public access)
    // For listing/search operations, require auth
    if (!id) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build query object
    const query: {
      $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
      _id?: Types.ObjectId;
      articlesId?: string;
      status?: string;
    } = {};

    if (id) {
      // Check if id is a valid MongoDB ObjectId (24 character hex string)
      if (Types.ObjectId.isValid(id) && id.length === 24) {
        query._id = new Types.ObjectId(id);
      } else {
        // If not a valid ObjectId, treat it as an articlesId (slug)
        query.articlesId = id;
      }
      // Only allow access to published articles for public access
      query.status = "publish";
    } else if (search) {
      // Only apply search criteria if not looking up by id
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Check if searching by ID (single article lookup)
    if (id) {
      // If ID is provided, fetch single article
      const article = await Articles.findOne(query);

      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      // Format single article response
      const formattedArticle = {
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
      };

      return NextResponse.json(formattedArticle);
    } else {
      // Fetch articles with pagination for search queries
      const articles = await Articles.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 });

      // Get total count for pagination info
      const totalCount = await Articles.countDocuments(query);

      // Format response
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
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "articlesId",
      "thumbnail",
      "description",
      "author",
      "status",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            error: `${
              field.charAt(0).toUpperCase() + field.slice(1)
            } is required`,
          },
          { status: 400 }
        );
      }
    }

    // Helper function to parse array fields that might be stringified
    const parseArrayField = (field: unknown): unknown[] => {
      if (Array.isArray(field)) {
        return field;
      }
      if (typeof field === "string") {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      if (field === null || field === undefined) {
        return [];
      }
      return [];
    };

    // Validate and format tags array
    const formatTags = (
      tags: unknown
    ): Array<{ title: string; tagsId: string }> => {
      const parsed = parseArrayField(tags);
      return parsed
        .map((tag) => {
          if (
            typeof tag === "object" &&
            tag !== null &&
            "title" in tag &&
            "tagsId" in tag
          ) {
            return {
              title: String(tag.title),
              tagsId: String(tag.tagsId),
            };
          }
          return null;
        })
        .filter(
          (tag): tag is { title: string; tagsId: string } => tag !== null
        );
    };

    // Validate and format category object
    const formatCategory = (
      category: unknown
    ): { title: string; categoryId: string } | null => {
      // Handle array input (for backward compatibility) - take first element
      if (Array.isArray(category) && category.length > 0) {
        const cat = category[0];
        if (
          typeof cat === "object" &&
          cat !== null &&
          "title" in cat &&
          "categoryId" in cat
        ) {
          return {
            title: String(cat.title),
            categoryId: String(cat.categoryId),
          };
        }
      }
      // Handle object input
      if (
        typeof category === "object" &&
        category !== null &&
        "title" in category &&
        "categoryId" in category
      ) {
        return {
          title: String(category.title),
          categoryId: String(category.categoryId),
        };
      }
      return null;
    };

    // Build article data explicitly to avoid any field conflicts
    const formattedTags = formatTags(body.tags);
    const formattedCategory = formatCategory(body.category);

    // Validate category is provided
    if (!formattedCategory) {
      return NextResponse.json(
        { error: "Category is required and must have title and categoryId" },
        { status: 400 }
      );
    }

    const articleData = {
      title: body.title,
      articlesId: body.articlesId,
      thumbnail: body.thumbnail,
      description: body.description,
      content: body.content || "",
      status: body.status,
      tags: formattedTags,
      category: formattedCategory,
      author: body.author,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Ensure tags is always an array of objects (not stringified)
    if (!Array.isArray(articleData.tags)) {
      console.error("Tags is not an array:", articleData.tags);
      return NextResponse.json(
        { error: "Tags must be an array" },
        { status: 400 }
      );
    }

    // Validate each tag has the required structure
    for (const tag of articleData.tags) {
      if (
        !tag ||
        typeof tag !== "object" ||
        !("title" in tag) ||
        !("tagsId" in tag)
      ) {
        console.error("Invalid tag structure:", tag);
        return NextResponse.json(
          { error: "Each tag must have title and tagsId" },
          { status: 400 }
        );
      }
    }

    // Validate category has the required structure
    if (
      !articleData.category ||
      typeof articleData.category !== "object" ||
      !("title" in articleData.category) ||
      !("categoryId" in articleData.category)
    ) {
      console.error("Invalid category structure:", articleData.category);
      return NextResponse.json(
        { error: "Category must have title and categoryId" },
        { status: 400 }
      );
    }

    // Create new article - ensure tags and category are fresh objects
    const articleDataForMongoose: {
      [key: string]: unknown;
      category?: { title: string; categoryId: string };
    } = {
      ...articleData,
      tags: formattedTags.map((tag) => ({
        title: String(tag.title),
        tagsId: String(tag.tagsId),
      })),
    };

    // Ensure category is an object, not an array
    if (formattedCategory) {
      articleDataForMongoose.category = {
        title: String(formattedCategory.title),
        categoryId: String(formattedCategory.categoryId),
      };
    }

    // Create article instance - create a clean copy to avoid any reference issues
    // This ensures we have plain JavaScript objects that Mongoose can properly cast
    const cleanArticleData = JSON.parse(JSON.stringify(articleDataForMongoose));

    // Double check: ensure category is not an array
    if (cleanArticleData.category && Array.isArray(cleanArticleData.category)) {
      cleanArticleData.category = cleanArticleData.category[0] || undefined;
    }

    const newArticle = new Articles(cleanArticleData);

    const savedArticle = await newArticle.save();

    const formattedArticle = {
      _id: savedArticle._id.toString(),
      articlesId: savedArticle.articlesId,
      title: savedArticle.title,
      thumbnail: savedArticle.thumbnail,
      description: savedArticle.description,
      content: savedArticle.content || "",
      category: savedArticle.category,
      author: savedArticle.author,
      tags: savedArticle.tags,
      status: savedArticle.status,
      created_at: savedArticle.createdAt,
      updated_at: savedArticle.updatedAt,
    };

    return NextResponse.json(formattedArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);

    // Provide more detailed error messages
    if (error instanceof Error) {
      // Check if it's a Mongoose validation error
      if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        return NextResponse.json(
          {
            error: "Validation error",
            details:
              validationErrors.length > 0 ? validationErrors : [error.message],
          },
          { status: 400 }
        );
      }

      // Return the actual error message
      return NextResponse.json(
        { error: error.message || "Failed to create article" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Helper function to parse array fields that might be stringified
    const parseArrayField = (field: unknown): unknown[] => {
      if (Array.isArray(field)) {
        return field;
      }
      if (typeof field === "string") {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      if (field === null || field === undefined) {
        return [];
      }
      return [];
    };

    // Validate and format tags array
    const formatTags = (
      tags: unknown
    ): Array<{ title: string; tagsId: string }> => {
      const parsed = parseArrayField(tags);
      return parsed
        .map((tag) => {
          if (
            typeof tag === "object" &&
            tag !== null &&
            "title" in tag &&
            "tagsId" in tag
          ) {
            return {
              title: String(tag.title),
              tagsId: String(tag.tagsId),
            };
          }
          return null;
        })
        .filter(
          (tag): tag is { title: string; tagsId: string } => tag !== null
        );
    };

    // Validate and format category object
    const formatCategory = (
      category: unknown
    ): { title: string; categoryId: string } | null => {
      // Handle array input (for backward compatibility) - take first element
      if (Array.isArray(category) && category.length > 0) {
        const cat = category[0];
        if (
          typeof cat === "object" &&
          cat !== null &&
          "title" in cat &&
          "categoryId" in cat
        ) {
          return {
            title: String(cat.title),
            categoryId: String(cat.categoryId),
          };
        }
      }
      // Handle object input
      if (
        typeof category === "object" &&
        category !== null &&
        "title" in category &&
        "categoryId" in category
      ) {
        return {
          title: String(category.title),
          categoryId: String(category.categoryId),
        };
      }
      return null;
    };

    // Format the data
    const formattedTags = formatTags(body.tags);
    const formattedCategory = formatCategory(body.category);

    // Validate category is provided
    if (!formattedCategory) {
      return NextResponse.json(
        { error: "Category is required and must have title and categoryId" },
        { status: 400 }
      );
    }

    // Validate each tag has the required structure
    for (const tag of formattedTags) {
      if (
        !tag ||
        typeof tag !== "object" ||
        !("title" in tag) ||
        !("tagsId" in tag)
      ) {
        console.error("Invalid tag structure:", tag);
        return NextResponse.json(
          { error: "Each tag must have title and tagsId" },
          { status: 400 }
        );
      }
    }

    // Validate category has the required structure
    if (
      !formattedCategory ||
      typeof formattedCategory !== "object" ||
      !("title" in formattedCategory) ||
      !("categoryId" in formattedCategory)
    ) {
      console.error("Invalid category structure:", formattedCategory);
      return NextResponse.json(
        { error: "Category must have title and categoryId" },
        { status: 400 }
      );
    }

    // Prepare update data with formatted objects
    const updateData: {
      [key: string]: unknown;
      category?: { title: string; categoryId: string };
      updated_at: Date;
    } = {
      ...body,
      tags: formattedTags.map((tag) => ({
        title: String(tag.title),
        tagsId: String(tag.tagsId),
      })),
      updated_at: new Date(),
    };

    // Ensure category is an object, not an array
    if (formattedCategory) {
      updateData.category = {
        title: String(formattedCategory.title),
        categoryId: String(formattedCategory.categoryId),
      };
    }

    // Double check: ensure category is not an array
    if (updateData.category && Array.isArray(updateData.category)) {
      updateData.category = updateData.category[0] || undefined;
    }

    // Find and update the article
    // Ensure category is not an array before updating
    if (updateData.category && Array.isArray(updateData.category)) {
      updateData.category = updateData.category[0] || undefined;
    }

    const updatedArticle = await Articles.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const formattedArticle = {
      _id: updatedArticle._id.toString(),
      articlesId: updatedArticle.articlesId,
      title: updatedArticle.title,
      thumbnail: updatedArticle.thumbnail,
      description: updatedArticle.description,
      content: updatedArticle.content || "",
      category: updatedArticle.category,
      author: updatedArticle.author,
      tags: updatedArticle.tags,
      status: updatedArticle.status,
      created_at: updatedArticle.createdAt,
      updated_at: updatedArticle.updatedAt,
    };

    return NextResponse.json(formattedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const deletedArticle = await Articles.findByIdAndDelete(id);

    if (!deletedArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
