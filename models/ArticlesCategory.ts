import mongoose from "mongoose";

interface ArticlesCategoryDocument extends mongoose.Document {
  title: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

const articlesCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: String,
      required: true, // Now required since it's generated from title
      trim: true,
    },
  },
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt
  }
);

// Create the model with the proper Next.js pattern to avoid OverwriteModelError
const modelName = process.env.NEXT_PUBLIC_ARTICLES_CATEGORIES as string;

const ArticlesCategoryModel = mongoose.models[modelName]
  ? mongoose.model<ArticlesCategoryDocument>(modelName)
  : mongoose.model<ArticlesCategoryDocument>(modelName, articlesCategorySchema);

export const ArticlesCategory = ArticlesCategoryModel;
