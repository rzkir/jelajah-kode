import mongoose from "mongoose";

interface RatingsDocument extends mongoose.Document {
  productsId: string;
  rating: number;
  comment: string;
  author: {
    _id: string;
    name: string;
    picture?: string;
    role: "admins" | "user";
  };
  createdAt: Date;
  updatedAt: Date;
}

const ratingsUserSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admins", "user"],
      required: true,
    },
  },
  { _id: false }
);

const ratingsSchema = new mongoose.Schema(
  {
    productsId: {
      type: String,
      required: true,
      index: true, // Index for faster queries by productsId
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Rating must be an integer between 1 and 5",
      },
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000, // Limit comment length
    },
    author: {
      type: ratingsUserSchema,
      required: true,
    },
  },
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt
    collection: process.env.NEXT_PUBLIC_RATINGS || "ratings",
  }
);

// Compound index to prevent duplicate ratings from same user for same product
ratingsSchema.index({ productsId: 1, "author._id": 1 }, { unique: true });

// Prevent OverwriteModelError by checking if model already exists
const modelName = process.env.NEXT_PUBLIC_RATINGS || "Ratings";

const Ratings =
  mongoose.models[modelName] ||
  mongoose.model<RatingsDocument>(modelName, ratingsSchema);

export default Ratings;
