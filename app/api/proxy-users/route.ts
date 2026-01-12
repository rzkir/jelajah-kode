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

    const backendResponse = await fetch(`${BACKEND_URL}/api/users`, {
      method: "GET",
      headers,
    });

    const data = await backendResponse.json();

    // Create response with same data
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch users" },
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

    const backendResponse = await fetch(`${BACKEND_URL}/api/users`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    // Create response with same data
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update user" },
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

    const backendResponse = await fetch(`${BACKEND_URL}/api/users`, {
      method: "DELETE",
      headers,
      body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    // Create response with same data
    return NextResponse.json(data, {
      status: backendResponse.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
