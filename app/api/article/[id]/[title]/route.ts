import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { checkAuth } from "@/app/_lib/checkAuth";



export async function GET(request: NextRequest, context: { params: Promise<{ id: string, title: string }> }) {
    try {
        const authUser = await checkAuth(request);

        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, title } = await context.params; // 👈 Await here

        const singleArticle = await prisma.article.findUnique({
            where: {
                id,
                title
            },
            include: {
                company: {
                    select: { id: true, name: true, logo: true, status: true },
                },
                writer: {
                    select: { id: true, firstName: true, lastName: true, status: true },
                },
                editor: {
                    select: { id: true, firstName: true, lastName: true, status: true },
                },
            },
        });

        return NextResponse.json(singleArticle, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching article with include:", error.message);
        return NextResponse.json(
            { error: "Failed to retrieve article" },
            { status: 500 }
        );
    }
}


export async function PUT(request: NextRequest, context: { params: Promise<{ id: string, title: string }> }) {
    try {
        const authUser = await checkAuth(request);

        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, title } = await context.params; // 👈 Await here

      const body = await request.json();
  
      const { image, newtitle, link, date, content, status, writerId, editorId, companyId } = body;
  
      // Validate payload
      if (!image || !newtitle || !link || !date || !content || !status || !writerId || !editorId || !companyId) {
        return NextResponse.json(
          { error: "Missing required fields: image, title, link, date, content, status, writerId, editorId, companyId" },
          { status: 400 }
        );
      }
  
      const updatedArticle = await prisma.article.update({
        where: { id, title },
        data: {
          image,
          title: newtitle,
          link,
          content,
          status,
          date,
          writerId,
          editorId,
          companyId,
        },
      });
  
      return NextResponse.json(updatedArticle, { status: 200 });
    } catch (error) {
      console.error("Error updating article:", error);
      return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
    }
  }