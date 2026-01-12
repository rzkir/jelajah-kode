import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Detect if request is from localhost (development) or production
  const origin = request.headers.get("origin");
  const isLocalhost =
    origin && (origin.includes("localhost") || origin.includes("127.0.0.1"));

  // Use same cookie settings as signin for consistency
  const cookieSettings = isLocalhost
    ? {
        secure: false,
        sameSite: "lax" as const,
      }
    : {
        secure: true,
        sameSite: "none" as const,
      };

  // Set cookie with CORS-friendly settings for deletion
  response.cookies.set({
    name: "token",
    value: "",
    expires: new Date(0),
    httpOnly: true,
    ...cookieSettings,
    path: "/",
  });

  return response;
}
