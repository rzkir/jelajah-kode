import mongoose from "mongoose";

const articlesCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const articlesTagsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    tagsId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

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
    },
    role: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const articlesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    articlesId: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    category: {
      type: articlesCategorySchema,
    },
    author: {
      type: authorSchema,
      required: true,
    },
    tags: {
      type: [articlesTagsSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["publish", "draft"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

articlesSchema.pre("save", function (next) {
  next();
});

articlesSchema.pre("validate", function (next) {
  if (this.category && Array.isArray(this.category)) {
    if (this.category.length > 0) {
      this.category = this.category[0];
    } else {
      this.category = undefined;
    }
  }

  next();
});

articlesSchema.set("toJSON", {
  transform: function (doc: unknown, ret: { category?: unknown }) {
    // Ensure category is always an object, not an array
    if (
      ret.category &&
      Array.isArray(ret.category) &&
      ret.category.length > 0
    ) {
      ret.category = ret.category[0];
    }
    return ret;
  },
});

articlesSchema.set("toObject", {
  transform: function (doc: unknown, ret: { category?: unknown }) {
    // Ensure category is always an object, not an array
    if (
      ret.category &&
      Array.isArray(ret.category) &&
      ret.category.length > 0
    ) {
      ret.category = ret.category[0];
    }
    return ret;
  },
});

const modelName = process.env.NEXT_PUBLIC_ARTICLES as string;

const ArticlesModel = mongoose.models[modelName]
  ? mongoose.model<Articles>(modelName)
  : mongoose.model<Articles>(modelName, articlesSchema);

export default ArticlesModel;
