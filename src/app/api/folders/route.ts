import pool from "@/lib/database/db";
import { decodeJwt } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { name: folder_name } = await request.json();
    const accessToken = request.cookies.get("accessToken")?.value;
    const { user_id } = decodeJwt(accessToken!);


    if (!folder_name) {
        return NextResponse.json(
            { error: "Invalid Request body" },
            { status: 400 }
        )
    }

    try {
        await pool.query(
            `
                INSERT INTO folders (name,user_id) 
                VALUES ($1,$2)
                
            `,
            [folder_name, user_id]
        )

        return NextResponse.json(
            { message: "Folder Created Successfully!" },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error : ",error);
        return NextResponse.json(
            {error:"Internal Server Error"},
            {status:500}
        )
    }


}

export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const { user_id } = decodeJwt(accessToken!);

    try{

        const result = await pool.query(
            `
            SELECT 
                f.folder_id AS id,
                f.name,
                f.createdat AS "createdAt",
                f.updatedat AS "updatedAt",
                f.deletedat AS "deletedAt"
            FROM 
                users u
            JOIN 
                folders f
            ON u.user_id = f.user_id
            WHERE u.user_id = $1 AND deletedat IS NULL
            ORDER BY f.updatedat DESC
            `,
            [user_id]
        );
        
        return NextResponse.json(
            {folders: (result.rows.length === 0 ? [] : result.rows)},
            {status:200}
        );
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error:"Internal Server Error"},
            {status:500}
        )
    }
}