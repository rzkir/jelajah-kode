import { NextResponse } from "next/server";

import {
  createArticlesCategory,
  getAllArticlesCategories,
  updateArticlesCategory,
  deleteArticlesCategory,
} from "@/services/articlesCategoryService";

import { checkAuthorization } from "@/lib/auth-utils";

// GET all categories
export async function GET(request: Request) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await getAllArticlesCategories();

    if (!Array.isArray(categories)) {
      return NextResponse.json([], { status: 500 });
    }

    const formattedCategories = categories.map((category) => ({
      _id: category._id.toString(),
      title: category.title,
      categoryId: category.categoryId,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));
    return NextResponse.json(formattedCategories);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: Request) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, categoryId } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const category = await createArticlesCategory({ title: title, categoryId });
    const formattedCategory = {
      _id: category._id.toString(),
      title: category.title,
      categoryId: category.categoryId,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
    return NextResponse.json(formattedCategory, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(request: Request) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, categoryId } = await request.json();

    if (!id || !title) {
      return NextResponse.json(
        { error: "ID and name are required" },
        { status: 400 }
      );
    }

    const category = await updateArticlesCategory(id, { title, categoryId });
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    const formattedCategory = {
      _id: category._id.toString(),
      title: category.title,
      categoryId: category.categoryId,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
    return NextResponse.json(formattedCategory);
  } catch {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(request: Request) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedCategory = await deleteArticlesCategory(id);
    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Category deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
