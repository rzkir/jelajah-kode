import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/mongodb";

import { Types } from "mongoose";

import mongoose from "mongoose";

import Products from "@/models/Products";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build query object
    const query: {
      $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
      _id?: Types.ObjectId;
    } = {};

    // Check if there's an id parameter for single product lookup
    const id = searchParams.get("id");
    if (id) {
      query._id = new Types.ObjectId(id);
    } else if (search) {
      // Only apply search criteria if not looking up by id
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Check if searching by ID (single product lookup)
    if (id) {
      // If ID is provided, fetch single product
      const product = await Products.findOne(query);

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      // Format single product response
      const formattedProduct = {
        _id: product._id.toString(),
        productsId: product.productsId,
        title: product.title,
        thumbnail: product.thumbnail,
        frameworks: product.frameworks,
        price: product.price,
        stock: product.stock,
        sold: product.sold,
        downloadUrl: product.downloadUrl,
        downloadCount: product.downloadCount,
        category: product.category,
        rating: product.rating,
        views: product.views,
        ratingCount: product.ratingCount,
        discount: product.discount,
        author: product.author,
        tags: product.tags,
        type: product.type,
        paymentType: product.paymentType,
        status: product.status,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      };

      return NextResponse.json(formattedProduct);
    } else {
      // Fetch products with pagination for search queries
      const products = await Products.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      // Get total count for pagination info
      const totalCount = await Products.countDocuments(query);

      // Format response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedProducts = products.map((product: any) => ({
        _id: product._id.toString(),
        productsId: product.productsId,
        title: product.title,
        thumbnail: product.thumbnail,
        frameworks: product.frameworks,
        price: product.price,
        stock: product.stock,
        sold: product.sold,
        downloadUrl: product.downloadUrl,
        downloadCount: product.downloadCount,
        category: product.category,
        rating: product.rating,
        views: product.views,
        ratingCount: product.ratingCount,
        discount: product.discount,
        author: product.author,
        tags: product.tags,
        type: product.type,
        paymentType: product.paymentType,
        status: product.status,
        created_at: product.createdAt,
        updated_at: product.updatedAt,
      }));

      return NextResponse.json({
        data: formattedProducts,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        },
      });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "productsId",
      "thumbnail",
      "description",
      "author",
      "paymentType",
      "status",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            error: `${
              field.charAt(0).toUpperCase() + field.slice(1)
            } is required`,
          },
          { status: 400 }
        );
      }
    }

    // Validate price - handle special case for paymentType "free"
    if (body.paymentType === "free") {
      // For free products, ensure price is 0
      body.price = 0;
    } else if (body.paymentType === "paid") {
      // For paid products, price must be provided and greater than 0
      if (body.price === undefined || body.price === null || body.price <= 0) {
        return NextResponse.json(
          {
            error:
              "Price is required and must be greater than 0 for paid products",
          },
          { status: 400 }
        );
      }
    }

    // Validate stock - must be a number (can be 0)
    if (
      body.stock === undefined ||
      body.stock === null ||
      typeof body.stock !== "number"
    ) {
      return NextResponse.json(
        { error: "Stock is required and must be a number" },
        { status: 400 }
      );
    }

    // Helper function to parse array fields that might be stringified
    const parseArrayField = (field: unknown): unknown[] => {
      if (Array.isArray(field)) {
        return field;
      }
      if (typeof field === "string") {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    };

    // Validate and format tags array
    const formatTags = (
      tags: unknown
    ): Array<{ title: string; tagsId: string }> => {
      const parsed = parseArrayField(tags);
      return parsed
        .map((tag) => {
          if (
            typeof tag === "object" &&
            tag !== null &&
            "title" in tag &&
            "tagsId" in tag
          ) {
            return {
              title: String(tag.title),
              tagsId: String(tag.tagsId),
            };
          }
          return null;
        })
        .filter(
          (tag): tag is { title: string; tagsId: string } => tag !== null
        );
    };

    // Validate and format category object
    const formatCategory = (
      category: unknown
    ): { title: string; categoryId: string } | null => {
      // Handle array input (for backward compatibility) - take first element
      if (Array.isArray(category) && category.length > 0) {
        const cat = category[0];
        if (
          typeof cat === "object" &&
          cat !== null &&
          "title" in cat &&
          "categoryId" in cat
        ) {
          return {
            title: String(cat.title),
            categoryId: String(cat.categoryId),
          };
        }
      }
      // Handle object input
      if (
        typeof category === "object" &&
        category !== null &&
        "title" in category &&
        "categoryId" in category
      ) {
        return {
          title: String(category.title),
          categoryId: String(category.categoryId),
        };
      }
      return null;
    };

    // Validate and format type object
    const formatType = (
      type: unknown
    ): { title: string; typeId: string } | null => {
      // Handle array input (for backward compatibility) - take first element
      if (Array.isArray(type) && type.length > 0) {
        const t = type[0];
        if (
          typeof t === "object" &&
          t !== null &&
          "title" in t &&
          "typeId" in t
        ) {
          return {
            title: String(t.title),
            typeId: String(t.typeId),
          };
        }
      }
      // Handle object input
      if (
        typeof type === "object" &&
        type !== null &&
        "title" in type &&
        "typeId" in type
      ) {
        return {
          title: String(type.title),
          typeId: String(type.typeId),
        };
      }
      return null;
    };

    // Build product data explicitly to avoid any field conflicts
    const formattedTags = formatTags(body.tags);
    const formattedCategory = formatCategory(body.category);
    const formattedType = formatType(body.type);

    // Validate category is provided
    if (!formattedCategory) {
      return NextResponse.json(
        { error: "Category is required and must have title and categoryId" },
        { status: 400 }
      );
    }

    // Validate type is provided
    if (!formattedType) {
      return NextResponse.json(
        { error: "Type is required and must have title and typeId" },
        { status: 400 }
      );
    }

    // Ensure price is set correctly based on paymentType
    const finalPrice =
      body.paymentType === "free"
        ? 0
        : typeof body.price === "number"
        ? body.price
        : Number(body.price);

    const productData = {
      title: body.title,
      productsId: body.productsId,
      thumbnail: body.thumbnail,
      description: body.description,
      faqs: body.faqs || "",
      price: finalPrice,
      stock: typeof body.stock === "number" ? body.stock : Number(body.stock),
      sold: typeof body.sold === "number" ? body.sold : 0,
      downloadUrl: typeof body.downloadUrl === "string" ? body.downloadUrl : "",
      downloadCount:
        typeof body.downloadCount === "number" ? body.downloadCount : 0,
      paymentType: body.paymentType,
      status: body.status,
      tags: formattedTags,
      frameworks: parseArrayField(body.frameworks),
      category: formattedCategory,
      type: formattedType,
      images: parseArrayField(body.images),
      discount: body.discount || undefined,
      author: body.author,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Ensure tags is always an array of objects (not stringified)
    if (!Array.isArray(productData.tags)) {
      console.error("Tags is not an array:", productData.tags);
      return NextResponse.json(
        { error: "Tags must be an array" },
        { status: 400 }
      );
    }

    // Validate each tag has the required structure
    for (const tag of productData.tags) {
      if (
        !tag ||
        typeof tag !== "object" ||
        !("title" in tag) ||
        !("tagsId" in tag)
      ) {
        console.error("Invalid tag structure:", tag);
        return NextResponse.json(
          { error: "Each tag must have title and tagsId" },
          { status: 400 }
        );
      }
    }

    // Validate category has the required structure
    if (
      !productData.category ||
      typeof productData.category !== "object" ||
      !("title" in productData.category) ||
      !("categoryId" in productData.category)
    ) {
      console.error("Invalid category structure:", productData.category);
      return NextResponse.json(
        { error: "Category must have title and categoryId" },
        { status: 400 }
      );
    }

    // Validate type has the required structure
    if (
      !productData.type ||
      typeof productData.type !== "object" ||
      !("title" in productData.type) ||
      !("typeId" in productData.type)
    ) {
      console.error("Invalid type structure:", productData.type);
      return NextResponse.json(
        { error: "Type must have title and typeId" },
        { status: 400 }
      );
    }

    // Create new product - ensure tags, category, and type are fresh objects
    const productDataForMongoose: {
      [key: string]: unknown;
      category?: { title: string; categoryId: string };
      type?: { title: string; typeId: string };
    } = {
      ...productData,
      tags: formattedTags.map((tag) => ({
        title: String(tag.title),
        tagsId: String(tag.tagsId),
      })),
    };

    // Ensure category is an object, not an array
    if (formattedCategory) {
      productDataForMongoose.category = {
        title: String(formattedCategory.title),
        categoryId: String(formattedCategory.categoryId),
      };
    }

    // Ensure type is an object, not an array
    if (formattedType) {
      productDataForMongoose.type = {
        title: String(formattedType.title),
        typeId: String(formattedType.typeId),
      };
    }

    // Create product instance - create a clean copy to avoid any reference issues
    // This ensures we have plain JavaScript objects that Mongoose can properly cast
    const cleanProductData = JSON.parse(JSON.stringify(productDataForMongoose));

    // Double check: ensure category is not an array
    if (cleanProductData.category && Array.isArray(cleanProductData.category)) {
      cleanProductData.category = cleanProductData.category[0] || undefined;
    }

    // Double check: ensure type is not an array
    if (cleanProductData.type && Array.isArray(cleanProductData.type)) {
      cleanProductData.type = cleanProductData.type[0] || undefined;
    }

    const newProduct = new Products(cleanProductData);

    const savedProduct = await newProduct.save();

    const formattedProduct = {
      _id: savedProduct._id.toString(),
      productsId: savedProduct.productsId,
      title: savedProduct.title,
      thumbnail: savedProduct.thumbnail,
      frameworks: savedProduct.frameworks,
      description: savedProduct.description,
      faqs: savedProduct.faqs,
      price: savedProduct.price,
      stock: savedProduct.stock,
      sold: savedProduct.sold,
      downloadUrl: savedProduct.downloadUrl,
      downloadCount: savedProduct.downloadCount,
      category: savedProduct.category,
      rating: savedProduct.rating,
      views: savedProduct.views,
      ratingCount: savedProduct.ratingCount,
      images: savedProduct.images,
      discount: savedProduct.discount,
      author: savedProduct.author,
      tags: savedProduct.tags,
      type: savedProduct.type,
      paymentType: savedProduct.paymentType,
      status: savedProduct.status,
      created_at: savedProduct.createdAt,
      updated_at: savedProduct.updatedAt,
    };

    return NextResponse.json(formattedProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);

    // Provide more detailed error messages
    if (error instanceof Error) {
      // Check if it's a Mongoose validation error
      if (error instanceof mongoose.Error.ValidationError) {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        return NextResponse.json(
          {
            error: "Validation error",
            details:
              validationErrors.length > 0 ? validationErrors : [error.message],
          },
          { status: 400 }
        );
      }

      // Return the actual error message
      return NextResponse.json(
        { error: error.message || "Failed to create product" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Helper function to parse array fields that might be stringified
    const parseArrayField = (field: unknown): unknown[] => {
      if (Array.isArray(field)) {
        return field;
      }
      if (typeof field === "string") {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      }
      return [];
    };

    // Validate and format tags array
    const formatTags = (
      tags: unknown
    ): Array<{ title: string; tagsId: string }> => {
      const parsed = parseArrayField(tags);
      return parsed
        .map((tag) => {
          if (
            typeof tag === "object" &&
            tag !== null &&
            "title" in tag &&
            "tagsId" in tag
          ) {
            return {
              title: String(tag.title),
              tagsId: String(tag.tagsId),
            };
          }
          return null;
        })
        .filter(
          (tag): tag is { title: string; tagsId: string } => tag !== null
        );
    };

    // Validate and format category object
    const formatCategory = (
      category: unknown
    ): { title: string; categoryId: string } | null => {
      // Handle array input (for backward compatibility) - take first element
      if (Array.isArray(category) && category.length > 0) {
        const cat = category[0];
        if (
          typeof cat === "object" &&
          cat !== null &&
          "title" in cat &&
          "categoryId" in cat
        ) {
          return {
            title: String(cat.title),
            categoryId: String(cat.categoryId),
          };
        }
      }
      // Handle object input
      if (
        typeof category === "object" &&
        category !== null &&
        "title" in category &&
        "categoryId" in category
      ) {
        return {
          title: String(category.title),
          categoryId: String(category.categoryId),
        };
      }
      return null;
    };

    // Validate and format type object
    const formatType = (
      type: unknown
    ): { title: string; typeId: string } | null => {
      // Handle array input (for backward compatibility) - take first element
      if (Array.isArray(type) && type.length > 0) {
        const t = type[0];
        if (
          typeof t === "object" &&
          t !== null &&
          "title" in t &&
          "typeId" in t
        ) {
          return {
            title: String(t.title),
            typeId: String(t.typeId),
          };
        }
      }
      // Handle object input
      if (
        typeof type === "object" &&
        type !== null &&
        "title" in type &&
        "typeId" in type
      ) {
        return {
          title: String(type.title),
          typeId: String(type.typeId),
        };
      }
      return null;
    };

    // Format the data
    const formattedTags = formatTags(body.tags);
    const formattedCategory = formatCategory(body.category);
    const formattedType = formatType(body.type);

    // Validate category is provided
    if (!formattedCategory) {
      return NextResponse.json(
        { error: "Category is required and must have title and categoryId" },
        { status: 400 }
      );
    }

    // Validate type is provided
    if (!formattedType) {
      return NextResponse.json(
        { error: "Type is required and must have title and typeId" },
        { status: 400 }
      );
    }

    // Validate each tag has the required structure
    for (const tag of formattedTags) {
      if (
        !tag ||
        typeof tag !== "object" ||
        !("title" in tag) ||
        !("tagsId" in tag)
      ) {
        console.error("Invalid tag structure:", tag);
        return NextResponse.json(
          { error: "Each tag must have title and tagsId" },
          { status: 400 }
        );
      }
    }

    // Validate category has the required structure
    if (
      !formattedCategory ||
      typeof formattedCategory !== "object" ||
      !("title" in formattedCategory) ||
      !("categoryId" in formattedCategory)
    ) {
      console.error("Invalid category structure:", formattedCategory);
      return NextResponse.json(
        { error: "Category must have title and categoryId" },
        { status: 400 }
      );
    }

    // Validate type has the required structure
    if (
      !formattedType ||
      typeof formattedType !== "object" ||
      !("title" in formattedType) ||
      !("typeId" in formattedType)
    ) {
      console.error("Invalid type structure:", formattedType);
      return NextResponse.json(
        { error: "Type must have title and typeId" },
        { status: 400 }
      );
    }

    // Prepare update data with formatted objects
    const updateData: {
      [key: string]: unknown;
      category?: { title: string; categoryId: string };
      type?: { title: string; typeId: string };
      updatedAt: Date;
    } = {
      ...body,
      tags: formattedTags.map((tag) => ({
        title: String(tag.title),
        tagsId: String(tag.tagsId),
      })),
      updatedAt: new Date(),
    };

    // Ensure category is an object, not an array
    if (formattedCategory) {
      updateData.category = {
        title: String(formattedCategory.title),
        categoryId: String(formattedCategory.categoryId),
      };
    }

    // Ensure type is an object, not an array
    if (formattedType) {
      updateData.type = {
        title: String(formattedType.title),
        typeId: String(formattedType.typeId),
      };
    }

    // Double check: ensure category is not an array
    if (updateData.category && Array.isArray(updateData.category)) {
      updateData.category = updateData.category[0] || undefined;
    }

    // Double check: ensure type is not an array
    if (updateData.type && Array.isArray(updateData.type)) {
      updateData.type = updateData.type[0] || undefined;
    }

    // Find and update the product
    // Ensure category is not an array before updating
    if (updateData.category && Array.isArray(updateData.category)) {
      updateData.category = updateData.category[0] || undefined;
    }

    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const formattedProduct = {
      _id: updatedProduct._id.toString(),
      productsId: updatedProduct.productsId,
      title: updatedProduct.title,
      thumbnail: updatedProduct.thumbnail,
      frameworks: updatedProduct.frameworks,
      description: updatedProduct.description,
      faqs: updatedProduct.faqs,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
      sold: updatedProduct.sold,
      downloadUrl: updatedProduct.downloadUrl,
      downloadCount: updatedProduct.downloadCount,
      category: updatedProduct.category,
      rating: updatedProduct.rating,
      views: updatedProduct.views,
      ratingCount: updatedProduct.ratingCount,
      images: updatedProduct.images,
      discount: updatedProduct.discount,
      author: updatedProduct.author,
      tags: updatedProduct.tags,
      type: updatedProduct.type,
      paymentType: updatedProduct.paymentType,
      status: updatedProduct.status,
      created_at: updatedProduct.createdAt,
      updated_at: updatedProduct.updatedAt,
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const deletedProduct = await Products.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
