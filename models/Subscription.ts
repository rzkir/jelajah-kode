import mongoose from "mongoose";

interface SubscriptionDocument extends mongoose.Document {
  email: string;
  ipAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent OverwriteModelError by checking if model already exists
const modelName = process.env.NEXT_PUBLIC_SUBSCRIPTION as string;

const SubscriptionModel =
  mongoose.models[modelName] ||
  mongoose.model<SubscriptionDocument>(modelName, subscriptionSchema);

export const Subscription = SubscriptionModel;
