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
        description: product.description,
        faqs: product.faqs,
        price: product.price,
        stock: product.stock,
        sold: product.sold,
        download: product.download,
        category: product.category,
        rating: product.rating,
        views: product.views,
        ratingCount: product.ratingCount,
        images: product.images,
        discount: product.discount,
        author: product.author,
        tags: product.tags,
        paymentType: product.paymentType,
        status: product.status,
        created_at: product.created_at,
        updated_at: product.updated_at,
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
        description: product.description,
        faqs: product.faqs,
        price: product.price,
        stock: product.stock,
        sold: product.sold,
        download: product.download,
        category: product.category,
        rating: product.rating,
        views: product.views,
        ratingCount: product.ratingCount,
        images: product.images,
        discount: product.discount,
        author: product.author,
        tags: product.tags,
        paymentType: product.paymentType,
        status: product.status,
        created_at: product.created_at,
        updated_at: product.updated_at,
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
      "price",
      "stock",
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

    // Build product data explicitly to avoid any field conflicts
    const formattedTags = formatTags(body.tags);

    const productData = {
      title: body.title,
      productsId: body.productsId,
      thumbnail: body.thumbnail,
      description: body.description,
      faqs: body.faqs || "",
      price: typeof body.price === "number" ? body.price : Number(body.price),
      stock: typeof body.stock === "number" ? body.stock : Number(body.stock),
      download: body.download || "",
      paymentType: body.paymentType,
      status: body.status,
      tags: formattedTags,
      frameworks: parseArrayField(body.frameworks),
      category: parseArrayField(body.category),
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

    // Create new product - ensure tags is a fresh array of plain objects
    const productDataForMongoose = {
      ...productData,
      tags: formattedTags.map((tag) => ({
        title: String(tag.title),
        tagsId: String(tag.tagsId),
      })),
    };

    // Create product instance - create a clean copy to avoid any reference issues
    // This ensures we have plain JavaScript objects that Mongoose can properly cast
    const cleanProductData = JSON.parse(JSON.stringify(productDataForMongoose));

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
      category: savedProduct.category,
      rating: savedProduct.rating,
      views: savedProduct.views,
      ratingCount: savedProduct.ratingCount,
      images: savedProduct.images,
      discount: savedProduct.discount,
      author: savedProduct.author,
      tags: savedProduct.tags,
      paymentType: savedProduct.paymentType,
      status: savedProduct.status,
      created_at: savedProduct.created_at,
      updated_at: savedProduct.updated_at,
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

    // Find and update the product
    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true } // Return the updated document
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
      category: updatedProduct.category,
      rating: updatedProduct.rating,
      views: updatedProduct.views,
      ratingCount: updatedProduct.ratingCount,
      images: updatedProduct.images,
      discount: updatedProduct.discount,
      author: updatedProduct.author,
      tags: updatedProduct.tags,
      paymentType: updatedProduct.paymentType,
      status: updatedProduct.status,
      created_at: updatedProduct.created_at,
      updated_at: updatedProduct.updated_at,
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
