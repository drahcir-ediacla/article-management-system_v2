import { checkAuth } from "@/app/_lib/checkAuth";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const authUser = await checkAuth(request);

        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: authUser.userId },
            include: {
                articlesEdited: {
                    select: {
                        id: true, content: true, title: true
                    }
                },
                articlesWritten: {
                    select: {
                        id: true, content: true, title: true
                    }
                }
            }
        })

        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        console.error("Error authenticated user:", error.message);
        return NextResponse.json(
            { error: "Failed to retrieve authenticated user" },
            { status: 500 }
        );
    }
}