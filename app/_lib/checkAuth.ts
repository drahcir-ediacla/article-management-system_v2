// "use server";
// import { verifyToken } from "@/app/_lib/jwt";
// import { NextRequest } from "next/server";

// export async function checkAuth(request: NextRequest) {
//   const tokenCookie = request.cookies.get("jwt");
//   if (!tokenCookie) return null;

//   const token = tokenCookie?.value;
//   console.log("Extracted Token:", token);
//   if (!token) return null;

//   try {
//     return verifyToken(token); // Decode and return user info
//   } catch (error) {
//     console.error("Invalid token:", error);
//     return null;
//   }
// }

"use server";
import { verifyToken } from "@/app/_lib/jwt";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function checkAuth(request: NextRequest) {
  const tokenCookie = request.cookies.get("jwt");
  if (!tokenCookie) return null;

  const token = tokenCookie?.value;
  console.log("Extracted Token:", token);
  if (!token) return null;

  try {
    return verifyToken(token); // Decode and return user info
  } catch (error) {
    console.warn("JWT expired, refreshing token...");
    
    // Try to refresh the token
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/refresh-token`, {
          credentials: "include", // Important: Sends cookies with request
      });

      if (!res.ok) throw new Error("Failed to refresh token");

      // Force revalidation to use new token on next request
      revalidatePath("/");

      // Reattempt to get user data after refresh
      const tokenCookie = request.cookies.get("jwt");
      const token = tokenCookie?.value;
      if (token) {
        return verifyToken(token); //  try again to decode and return user info
      }
  } catch (refreshError) {
      console.error("Failed to refresh token:", refreshError);
      return null;
  }
  }
}