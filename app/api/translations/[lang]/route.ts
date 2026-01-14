import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
    const { lang } = await params;

    // Validate language
    if (lang !== "id" && lang !== "en") {
      return NextResponse.json(
        { error: "Invalid language. Supported: id, en" },
        { status: 400 }
      );
    }

    // Read translation file dynamically
    const filePath = join(process.cwd(), "locales", `${lang}.json`);
    const fileContents = await readFile(filePath, "utf-8");
    const translations = JSON.parse(fileContents);

    // Add cache headers for better performance
    // But allow revalidation for realtime updates
    return NextResponse.json(translations, {
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error loading translations:", error);
    return NextResponse.json(
      { error: "Failed to load translations" },
      { status: 500 }
    );
  }
}
