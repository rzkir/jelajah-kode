import mongoose from "mongoose";

const transactionsProductsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    productsId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    downloadUrl: {
      type: String,
    },
    paymentType: {
      type: String,
      enum: ["free", "paid"],
      required: true,
    },
    discount: {
      type: {
        type: String,
        enum: ["percentage", "fixed"],
      },
      value: Number,
      until: String,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admins", "user"],
      required: true,
    },
  },
  { _id: false }
);

const transactionsSchema = new mongoose.Schema(
  {
    products: {
      type: [transactionsProductsSchema],
      required: true,
    },
    user: {
      type: userSchema,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["paid", "free"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "expired", "canceled"],
      default: "pending",
    },
    total_amount: {
      type: Number,
    },
    order_id: {
      type: String,
      unique: true,
      sparse: true,
    },
    snap_token: {
      type: String,
    },
    payment_details: {
      payment_type: {
        type: String,
      },
      bank: {
        type: String,
      },
      va_number: {
        type: String,
      },
      transaction_id: {
        type: String,
      },
      transaction_time: {
        type: String,
      },
      settlement_time: {
        type: String,
      },
      currency: {
        type: String,
        default: "IDR",
      },
    },
  },
  {
    timestamps: true,
    collection: process.env.NEXT_PUBLIC_TRANSACTIONS as string,
  }
);

// Generate unique order_id before saving
transactionsSchema.pre("save", async function (next) {
  if (!this.order_id) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.order_id = `ORDER-${timestamp}-${random}`;
  }
  next();
});

const modelName = process.env.NEXT_PUBLIC_TRANSACTIONS as string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Transactions: any =
  mongoose.models[modelName] || mongoose.model(modelName, transactionsSchema);

export default Transactions;
