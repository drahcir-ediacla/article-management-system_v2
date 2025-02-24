import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/prisma/client";
import { generateAccessToken, generateRefreshToken } from "@/app/_lib/jwt";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userName, password } = await request.json();

    if (!userName || !password) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 400 });
    }

    // Find user in the database
    const user = await prisma.user.findUnique({
      where: { userName },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken({ userId: user.id, userName: user.userName, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, userName: user.userName, role: user.role });
    const expirationDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 day from now

    // Create a response object
    const response = NextResponse.json({ message: "Login successful", user, accessToken }, {status: 200} );

    try {
      // Check if a refresh token already exists for the user
      const existingToken = await prisma.refreshToken.findUnique({
        where: { userId: user.id },
      });

      if (existingToken) {
        // Update the existing refresh token
        await prisma.refreshToken.update({
          where: { id: existingToken.id },
          data: {
            token: refreshToken,
            expirationDate: expirationDate,
          },
        });
      } else {
        // Create a new refresh token entry
        await prisma.refreshToken.create({
          data: {
            userId: user.id,
            token: refreshToken,
            expirationDate: expirationDate,
          },
        });
      }

      // Set access token as httpOnly cookie
      response.cookies.set("jwt", accessToken, {
        httpOnly: true,
        secure: false, // Send cookie over HTTPS in production
        sameSite: "lax", // Restrict cookie sharing across sites
        maxAge: 30, // 30 seconds
        path: "/", // Cookie available across the entire app
      });

      // Set refresh token as httpOnly cookie
      response.cookies.set("refreshJwt", refreshToken, {
        httpOnly: true,
        secure: false, // Send cookie over HTTPS in production
        sameSite: "lax", // Restrict cookie sharing across sites
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        path: "/", // Cookie available across the entire app
      });

      return response;
    } catch (error) {
      console.error("Error during refresh token storage:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
