import { NextResponse } from "next/server";

import imagekit from "@/lib/imagekit";

import { checkAuthorization } from "@/lib/auth-utils";

export async function POST(request: Request) {
  if (!checkAuthorization(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to ImageKit in products folder
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: "/products",
    });

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error) {
    console.error("Error uploading products image:", error);
    return NextResponse.json(
      { error: "Failed to upload products image" },
      { status: 500 }
    );
  }
}
