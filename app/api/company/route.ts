import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { checkAuth } from "@/app/_lib/checkAuth";


export async function GET(request: NextRequest) {
  try {
    // const authUser = await checkAuth(request);

    // if (!authUser) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    const company = await prisma.company.findMany({
      include: {
        article: true,
      }
    })

    return NextResponse.json(company, { status: 200 })
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {

    const body = await request.json();

    const { logo, name, status } = body;
    console.log("Received request body:", body);

    // Validate payload
    if (!logo || !name || !status) {
      return NextResponse.json(
        { error: "Missing required fields: logo, name, status" },
        { status: 400 }
      );
    }

    const newCompany = await prisma.company.create({
      data: {
        logo,
        name,
        status,
      },
    });

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json({ error: "Failed to create new company" }, { status: 500 });
  }
}