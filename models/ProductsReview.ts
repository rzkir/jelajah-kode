import mongoose from "mongoose";

interface ProductsReviewDocument extends mongoose.Document {
  productsId: string;
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const authorSchema = new mongoose.Schema(
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
      required: true,
    },
  },
  { _id: false }
);

const productsReviewSchema = new mongoose.Schema(
  {
    productsId: {
      type: String,
      required: true,
      index: true, // Index for faster queries
    },
    author: {
      type: authorSchema,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt
  }
);

// Prevent OverwriteModelError by checking if model already exists
const modelName = process.env.NEXT_PUBLIC_PRODUCTS_REVIEWS as string;

const ProductsReview =
  mongoose.models[modelName] ||
  mongoose.model<ProductsReviewDocument>(modelName, productsReviewSchema);

export default ProductsReview;
