import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/client";

export async function GET(request: NextRequest) {
    const tokenCookie = request.cookies.get("refreshJwt");
  if (!tokenCookie) {
    return NextResponse.json({ message: "No refresh token provided" }, { status: 401 });
}
  const refreshToken = tokenCookie?.value;
  console.log("Logout Extracted Refresh Token:", refreshToken);

  try {
    // Delete refresh token using Prisma
    const deleteResult = await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    if (deleteResult.count === 0) {
      console.log("Token not found or already deleted.");
    } else {
      console.log("Refresh token deleted successfully.");
    }

    // Create response object
    const response = NextResponse.json(
      { message: "Successfully logged out" },
      { status: 200 }
    );

    // Clear the authentication token cookie
    response.cookies.set("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: new Date(0),
      });

    response.cookies.set("refreshJwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
