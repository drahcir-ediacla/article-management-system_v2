import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/prisma/client";


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, userName, password, status, role } = body;

        if (!firstName || !lastName || !userName || !password || !status || !role) {
            return NextResponse.json(
                { error: "Missing required fields: firstName, lastName, userName, password, status, role" },
                { status: 400 }
            );
        }

        // Check if the username already exists
        const existingUser = await prisma.user.findUnique({
            where: { userName }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Username already exists" },
                { status: 400 }
            );
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user using Prisma
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                userName,
                password: hashedPassword,
                status,
                role
            },
            select: { id: true, userName: true } // Exclude sensitive data
        });

        return NextResponse.json(newUser, { status: 201 });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ error: "Failed to create new user" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
