import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST() {
  // Clear the JWT token cookie
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the custom JWT token cookie
  response.cookies.set({
    name: "token",
    value: "",
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  // Try to clear NextAuth session if it exists
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      // Clear NextAuth session cookie
      response.cookies.set({
        name: "next-auth.session-token",
        value: "",
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      // Also clear the next-auth.csrf-token if it exists
      response.cookies.set({
        name: "next-auth.csrf-token",
        value: "",
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
  } catch (error) {
    console.error("Error clearing NextAuth session:", error);
  }

  return response;
}
