import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API;
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;

export async function GET(request: NextRequest) {
  try {
    // Build the backend URL with query parameters
    const url = new URL(`${BACKEND_URL}/api/products/framework`);
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Forward request to backend with API_SECRET
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_SECRET}`,
    };

    const backendResponse = await fetch(url.toString(), {
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
      { error: "Failed to fetch frameworks" },
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
      `${BACKEND_URL}/api/products/framework`,
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
      { error: "Failed to create framework" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Build the backend URL with query parameters
    const url = new URL(`${BACKEND_URL}/api/products/framework`);
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Forward request to backend with API_SECRET
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_SECRET}`,
    };

    const backendResponse = await fetch(url.toString(), {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await backendResponse.json();

    // Create response with same data
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update framework" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Build the backend URL with query parameters
    const url = new URL(`${BACKEND_URL}/api/products/framework`);
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Forward request to backend with API_SECRET
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_SECRET}`,
    };

    const backendResponse = await fetch(url.toString(), {
      method: "DELETE",
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
      { error: "Failed to delete framework" },
      { status: 500 }
    );
  }
}
