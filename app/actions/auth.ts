
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/prisma/client";
import { generateAccessToken, generateRefreshToken } from "@/app/_lib/jwt";
import { LoginFormSchema, FormState } from '@/app/_schemas/auth'

export async function login(state: FormState | undefined, formData: FormData) {
    try {
        // Validate form fields
        const validatedFields = LoginFormSchema.safeParse({
            userName: formData.get('userName'),
            password: formData.get('password'),
        });

        // If validation fails, return errors
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        // Extract values from formData
        const userName = validatedFields.data.userName;
        const password = validatedFields.data.password;

        // Find user in the database
        const user = await prisma.user.findUnique({
            where: { userName },
        });

        // Validate password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return { errors: { general: ["Invalid username or password"] } };
        }

        // Generate JWT tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            userName: user.userName,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({
            userId: user.id,
            userName: user.userName,
            role: user.role,
        });

        return { message: "Login successful", accessToken, refreshToken };
    } catch (error) {
        console.error("Error during authentication:", error);
        return { errors: { general: ["Internal server error"] } };
    }
}
