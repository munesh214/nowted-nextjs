import { NextRequest, NextResponse, } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/database/db";

export async function POST(request: NextRequest) {
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
        return NextResponse.json(
            { error: "Provide All Fields!" },
            { status: 400 }
        );
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUserResult = await pool.query(
            'SELECT user_id FROM users WHERE email = $1',
            [email]
        );

        if (existingUserResult.rows.length > 0) {
            return NextResponse.json(
                { error: "Email Already Exists" },
                { status: 409 }
            )
        }

        await pool.query(
            `
            INSERT INTO users (name,email,password) 
            VALUES ($1,$2,$3)
            `,
            [name, email, hashedPassword]
        )

        return NextResponse.json(
            { message: "User Created Successfully" },
            { status: 201 }
        )
    } catch (error) {
        console.error("Signup Error : ", error);
        return NextResponse.json(
            { error: 'Failed to Create Account' },
            { status: 500 }
        )
    }
}