import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define roles for protected routes
const protectedRoutes: Record<string, string[]> = {
  "/dashboard": ["Writer", "Editor"],
  "/add-article": ["Writer", "Editor"],
  "/add-user": ["Editor"],
  "/add-company": ["Editor"],
  "/edit-article/[id]/[articleTitle]": ["Editor"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("jwt")?.value;
  const refreshToken = req.cookies.get("refreshJwt")?.value;

  console.log("Requested Path:", pathname);

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const userRole = (payload as { role: string }).role;

      console.log("Authenticated User Role:", userRole);

      // Redirect authenticated users away from "/" to "/dashboard"
      if (pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // Match pathname with protectedRoutes (including dynamic)
      const matched = Object.entries(protectedRoutes).find(([route, roles]) => {
        if (route.includes("[")) {
          // Convert route pattern to regex for dynamic match
          const regex = new RegExp("^" + route.replace(/\[.*?\]/g, "[^/]+") + "$");
          return regex.test(pathname);
        }
        return route === pathname;
      });

      // Restrict access based on matched role
      if (matched) {
        const [, allowedRoles] = matched;
        if (!allowedRoles.includes(userRole)) {
          console.warn(`Unauthorized Access: ${userRole} cannot access ${pathname}`);
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
      }

      return NextResponse.next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // If no token but refreshToken exists, try to refresh
  if (!token && refreshToken) {
    console.log("Attempting to refresh token...");
    const refreshUrl = new URL("/api/middleware-refresh", req.url);
    refreshUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(refreshUrl);
  }

  // Allow unauthenticated access to root
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Redirect unauthenticated users accessing protected routes
  const isProtectedPath = Object.keys(protectedRoutes).some((route) => {
    if (route.includes("[")) {
      const regex = new RegExp("^" + route.replace(/\[.*?\]/g, "[^/]+") + "$");
      return regex.test(pathname);
    }
    return route === pathname;
  });

  if (isProtectedPath) {
    console.warn(`Unauthenticated access attempt to ${pathname}`);
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Match dynamic routes as well
export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/add-article",
    "/add-user",
    "/add-company",
    "/edit-article/:id/:articleTitle", // Dynamic route matcher
  ],
};
