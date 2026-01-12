import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API;

const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Get the FormData from the request
    const formData = await request.formData();

    // Forward request to backend with API_SECRET
    const headers: HeadersInit = {
      Authorization: `Bearer ${API_SECRET}`,
    };

    const backendResponse = await fetch(
      `${BACKEND_URL}/api/products/framework/upload`,
      {
        method: "POST",
        headers,
        body: formData,
        cache: "no-store",
      }
    );

    const data = await backendResponse.json();

    // Create response with same data
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to upload framework" },
      { status: 500 }
    );
  }
}
