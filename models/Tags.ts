import mongoose from "mongoose";

interface TagsDocument extends mongoose.Document {
  title: string;
  tagsId: string;
  createdAt: Date;
  updatedAt: Date;
}

const tagsSchema = new mongoose.Schema(
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
const TagsModel = mongoose.models.Tags
  ? mongoose.model<TagsDocument>(process.env.NEXT_PUBLIC_TAGS as string)
  : mongoose.model<TagsDocument>(
      process.env.NEXT_PUBLIC_TAGS as string,
      tagsSchema
    );

export default TagsModel;
