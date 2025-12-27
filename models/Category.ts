import mongoose from "mongoose";

interface CategoryDocument extends mongoose.Document {
  title: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema(
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
const CategoryModel = mongoose.models.Category
  ? mongoose.model<CategoryDocument>("Category")
  : mongoose.model<CategoryDocument>("Category", categorySchema);

export const Category = CategoryModel;
