import mongoose from "mongoose";

interface ArticlesTagsDocument extends mongoose.Document {
  title: string;
  tagsId: string;
  createdAt: Date;
  updatedAt: Date;
}

const articlesTagsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tagsId: {
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
const modelName = process.env.NEXT_PUBLIC_ARTICLES_TAGS as string;

const ArticlesTagsModel = mongoose.models[modelName]
  ? mongoose.model<ArticlesTagsDocument>(modelName)
  : mongoose.model<ArticlesTagsDocument>(modelName, articlesTagsSchema);

export default ArticlesTagsModel;
