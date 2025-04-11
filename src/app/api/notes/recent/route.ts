import pool from "@/lib/database/db";
import { decodeJwt } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    const { user_id } = decodeJwt(token!);

    try {
        const result = await pool.query(
        `
            SELECT 
                n.note_id AS id,
                n.folder_id,
                n.title,
                n.isfavorite AS "isFavorite",
                n.isarchived AS "isArchived",
                n.createdat AS "createdAt",
                n.updatedat AS "updatedAt",
                n.deletedat AS "deletedAt",
                LEFT(n.content, 30) AS preview, 
                json_build_object(
                    'id', f.folder_id,
                    'name', f.name,
                    'createdAt', f.createdat,
                    'updatedAt', f.updatedat,
                    'deletedAt', f.deletedat
                ) AS folder
            FROM notes n
            JOIN 
                folders f 
            ON n.folder_id = f.folder_id
            WHERE n.user_id = $1
            ORDER BY n.updatedat DESC
            LIMIT 3
        `,
            [user_id]);


        return NextResponse.json(
            { recentNotes: result.rows },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
