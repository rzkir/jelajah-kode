import { NextResponse } from "next/server";

import {
  createType,
  getAllTypes,
  updateType,
  deleteType,
} from "@/services/typeServices";

import { checkAuthorization } from "@/lib/auth-utils";

// GET all types
export async function GET(request: Request) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const types = await getAllTypes();

    if (!Array.isArray(types)) {
      const response = NextResponse.json([], { status: 500 });
      return response;
    }

    const formattedTypes = types.map((type) => ({
      _id: type._id.toString(),
      title: type.title,
      typeId: type.typeId,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt,
    }));
    const response = NextResponse.json(formattedTypes);
    return response;
  } catch {
    const response = NextResponse.json(
      { error: "Failed to fetch types" },
      { status: 500 }
    );
    return response;
  }
}

// POST create new type
export async function POST(request: Request) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, typeId } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const type = await createType({ title: title, typeId: typeId });
    const formattedType = {
      _id: type._id.toString(),
      title: type.title,
      typeId: type.typeId,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt,
    };
    return NextResponse.json(formattedType, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create type" },
      { status: 500 }
    );
  }
}

// PUT update type
export async function PUT(request: Request) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, typeId } = await request.json();

    if (!id || !title) {
      return NextResponse.json(
        { error: "ID and name are required" },
        { status: 400 }
      );
    }

    const type = await updateType(id, { title, typeId });
    if (!type) {
      return NextResponse.json({ error: "Type not found" }, { status: 404 });
    }
    const formattedType = {
      _id: type._id.toString(),
      title: type.title,
      typeId: type.typeId,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt,
    };
    return NextResponse.json(formattedType);
  } catch {
    return NextResponse.json(
      { error: "Failed to update type" },
      { status: 500 }
    );
  }
}

// DELETE type
export async function DELETE(request: Request) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedType = await deleteType(id);
    if (!deletedType) {
      return NextResponse.json({ error: "Type not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Type deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete type" },
      { status: 500 }
    );
  }
}
