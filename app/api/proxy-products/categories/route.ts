import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API;

const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

export async function GET() {
  try {
    // Forward request to backend with API_SECRET
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_SECRET}`,
    };

    const backendResponse = await fetch(
      `${BACKEND_URL}/api/products/categories`,
      {
        method: "GET",
        headers,
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
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to backend with API_SECRET
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_SECRET}`,
    };

    const backendResponse = await fetch(
      `${BACKEND_URL}/api/products/categories`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
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
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to backend with API_SECRET
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_SECRET}`,
    };

    const backendResponse = await fetch(
      `${BACKEND_URL}/api/products/categories`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
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
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward request to backend with API_SECRET
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_SECRET}`,
    };

    const backendResponse = await fetch(
      `${BACKEND_URL}/api/products/categories`,
      {
        method: "DELETE",
        headers,
        body: JSON.stringify(body),
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
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
