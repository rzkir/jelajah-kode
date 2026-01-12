import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API;
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

export async function GET() {
  try {
    // Forward request to backend with API_SECRET
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_SECRET}`,
    };

    const backendResponse = await fetch(`${BACKEND_URL}/api/products/type`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await backendResponse.json();

    // Create response with same data
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch types" },
      { status: 500 }
    );
  }
}
