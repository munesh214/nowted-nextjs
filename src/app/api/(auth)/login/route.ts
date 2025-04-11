import pool from "@/lib/database/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from 'jose'

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

    if (!email || !password) {
        return NextResponse.json(
            { error: "Provide All Fields!" },
            { status: 400 }
        );
    }

    try {

        const result = await pool.query(
            `
                SELECT * FROM users
                WHERE email = $1
            `,
            [email]
        )


        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: "User not fount" },
                { status: 404 }
            )
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid Credentials" },
                { status: 401 }
            )
        }

        const token = await new SignJWT({ user_id: user.user_id, email: user.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(JWT_SECRET);


        const response = NextResponse.json(
            {message:"Login Succesfull!"},
            {status:200}
        )

        response.cookies.set('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'strict',
            maxAge: 1 * 60 * 60,
            path: '/',
        })


        return response;
        
    } catch (error) {
        console.error("Login Error : ", error);
        return NextResponse.json(
            {error:"Internal Server Error"},
            {status:500}
        )
    }
}