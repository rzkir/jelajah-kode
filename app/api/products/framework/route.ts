import { NextResponse } from "next/server";

import mongoose from "mongoose";

import { connectMongoDB } from "@/lib/mongodb";

const getDb = () => {
  if (!mongoose.connection.db) {
    throw new Error("Database connection not established");
  }
  return mongoose.connection.db;
};

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.NEXT_PUBLIC_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();
    const db = getDb();
    const frameworks = await db
      .collection(process.env.NEXT_PUBLIC_FRAMEWORKS as string)
      .find({})
      .toArray();
    return NextResponse.json(frameworks);
  } catch (error) {
    console.error("Error fetching frameworks:", error);
    return NextResponse.json(
      { error: "Failed to fetch frameworks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectMongoDB();
    const db = getDb();
    const body = await request.json();

    if (!body.thumbnail || !body.title || !body.frameworkId) {
      return NextResponse.json(
        { error: "Thumbnail, title, and frameworkId are required" },
        { status: 400 }
      );
    }

    const result = await db
      .collection(process.env.NEXT_PUBLIC_FRAMEWORKS as string)
      .insertOne({
        thumbnail: body.thumbnail,
        title: body.title,
        frameworkId: body.frameworkId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    return NextResponse.json({ _id: result.insertedId, ...body });
  } catch (error) {
    console.error("Error creating framework:", error);
    return NextResponse.json(
      { error: "Failed to create framework" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectMongoDB();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Framework ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body.thumbnail || !body.title || !body.frameworkId) {
      return NextResponse.json(
        { error: "Thumbnail, title, and frameworkId are required" },
        { status: 400 }
      );
    }

    const result = await db
      .collection(process.env.NEXT_PUBLIC_FRAMEWORKS as string)
      .updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        {
          $set: {
            thumbnail: body.thumbnail,
            title: body.title,
            frameworkId: body.frameworkId,
            updatedAt: new Date(),
          },
        }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Framework not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ _id: id, ...body });
  } catch (error) {
    console.error("Error updating framework:", error);
    return NextResponse.json(
      { error: "Failed to update framework" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectMongoDB();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Framework ID is required" },
        { status: 400 }
      );
    }

    const result = await db
      .collection(process.env.NEXT_PUBLIC_FRAMEWORKS as string)
      .deleteOne({
        _id: new mongoose.Types.ObjectId(id),
      });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Framework not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Framework deleted successfully" });
  } catch (error) {
    console.error("Error deleting framework:", error);
    return NextResponse.json(
      { error: "Failed to delete framework" },
      { status: 500 }
    );
  }
}
