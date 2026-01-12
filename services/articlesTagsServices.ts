import ArticlesTags from "@/models/ArticlesTags";

import { connectMongoDB } from "@/lib/mongodb";

import { generateFrameworkId } from "@/hooks/TextFormatter";

export async function createArticlesTag(data: {
  title: string;
  tagsId?: string;
}) {
  try {
    await connectMongoDB();
    // Create tag with the provided tagsId or generate from title
    const tagsId = data.tagsId || generateFrameworkId(data.title);
    const tag = await ArticlesTags.create({
      title: data.title,
      tagsId: tagsId,
    });
    return tag;
  } catch (error) {
    throw error;
  }
}

// Get all tags
export async function getAllArticlesTags() {
  try {
    await connectMongoDB();
    const tags = await ArticlesTags.find().sort({ createdAt: -1 }).lean();
    return tags;
  } catch (error) {
    throw error;
  }
}

// Get a single tag by ID
export async function getArticlesTagById(id: string) {
  try {
    await connectMongoDB();
    const tag = await ArticlesTags.findById(id);
    return tag;
  } catch (error) {
    throw error;
  }
}

// Update a tag
export async function updateArticlesTag(
  id: string,
  data: { title: string; tagsId?: string }
) {
  try {
    await connectMongoDB();
    // Generate tagsId from title if not provided
    const tagsId = data.tagsId || generateFrameworkId(data.title);
    const tag = await ArticlesTags.findByIdAndUpdate(
      id,
      { title: data.title, tagsId: tagsId, updatedAt: new Date() },
      { new: true }
    );
    return tag;
  } catch (error) {
    throw error;
  }
}

// Delete a tag
export async function deleteArticlesTag(id: string) {
  try {
    await connectMongoDB();
    const tag = await ArticlesTags.findByIdAndDelete(id);
    return tag;
  } catch (error) {
    throw error;
  }
}

// Get only tag names
export async function getArticlesTagNames() {
  try {
    await connectMongoDB();
    const tags = await ArticlesTags.find().select("title -_id");
    return tags.map((tag) => tag.title);
  } catch (error) {
    throw error;
  }
}
