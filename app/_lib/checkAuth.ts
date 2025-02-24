import { verifyToken } from "@/app/_lib/jwt";
import { NextRequest } from "next/server";

export async function getAuthUser(request: NextRequest) {
  const tokenCookie = request.cookies.get("jwt");
  if (!tokenCookie) return null;

  const token = tokenCookie?.value;
  console.log("Extracted Token:", token);
  if (!token) return null;

  try {
    return verifyToken(token); // Decode and return user info
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}