import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes: Record<string, string[]> = {
    "/dashboard": ["Writer", "Editor"],
    "/dashboard/add-article": ["Writer", "Editor"],
    "/dashboard/add-user": ["Editor"],
    "/dashboard/add-company": ["Editor"],
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

            // ✅ Redirect authenticated users away from "/" to "/dashboard"
            if (pathname === "/") {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }

            // Restrict routes based on role
            if (protectedRoutes[pathname] && !protectedRoutes[pathname].includes(userRole)) {
                console.warn(`Unauthorized Access: ${userRole} cannot access ${pathname}`);
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }

            return NextResponse.next();
        } catch (error) {
            console.error("JWT Verification Error:", error);
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // 🚀 If no access token but refresh token exists, attempt to refresh
    if (!token && refreshToken) {
        console.log("Attempting to refresh token...");

        const refreshUrl = new URL("/api/middleware-refresh", req.url);
        refreshUrl.searchParams.set("redirect", pathname); // Store where user was going

        return NextResponse.redirect(refreshUrl);
    }


    // ✅ Allow unauthenticated users to access "/"
    if (pathname === "/") {
        return NextResponse.next();
    }

    // Redirect unauthenticated users trying to access protected routes
    if (protectedRoutes[pathname]) {
        console.warn(`Unauthenticated access attempt to ${pathname}`);
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/dashboard",
        "/dashboard/add-article",
        "/dashboard/add-user",
        "/dashboard/add-company",
    ],
};
