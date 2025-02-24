import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { checkAuth } from "@/app/_lib/checkAuth";

export async function GET(request: NextRequest) {
  try {

    const authUser = await checkAuth(request); // Get authenticated user
    console.log('authUser:', authUser)

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch articles with conditional inclusion
    const articles = await prisma.article.findMany({
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


    return NextResponse.json(articles, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching articles with include:", error.message);
    return NextResponse.json(
      { error: "Failed to retrieve articles" },
      { status: 500 }
    );
  }
}



export async function POST(request: NextRequest) {
  try {

    const body = await request.json();

    const { image, title, link, content, status, writerId, companyId } = body;
    console.log("Received request body:", body);

    // Validate payload
    if (!image || !title || !link || !content || !status || !writerId || !companyId) {
      return NextResponse.json(
        { error: "Missing required fields: image, title, link, date, content, status, writerId, companyId" },
        { status: 400 }
      );
    }

    const newArticle = await prisma.article.create({
      data: {
        image,
        title,
        link,
        content,
        status,
        writerId,
        editorId: null,
        companyId,
      },
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json({ error: "Failed to create new article" }, { status: 500 });
  }
}


export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { id, image, title, link, date, content, status, writerId, editorId, companyId } = body;

    // Validate payload
    if (!id || !image || !title || !link || !date || !content || !status || !writerId || !editorId || !companyId) {
      return NextResponse.json(
        { error: "Missing required fields: id, image, title, link, date, content, status, writerId, editorId, companyId" },
        { status: 400 }
      );
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        image,
        title,
        link,
        content,
        status,
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
