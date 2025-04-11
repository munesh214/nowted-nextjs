import pool from "@/lib/database/db";
import { decodeJwt } from "jose";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest) {
    const {folderId,title,content,isFavorite,isArchived } = await request.json();
    const token = request.cookies.get("accessToken")?.value;

    if(!folderId || !title || !content || isFavorite === undefined || isArchived === undefined){
        return NextResponse.json(
            {error:"Invalid Request Body"},
            {status:400}
        )
    }

    try{
        const {user_id} = decodeJwt(token!);
        const {rows} = await pool.query(
            `
            INSERT INTO notes (title,content,isFavorite,isarchived,folder_id,user_id)
            VALUES ($1,$2,$3,$4,$5,$6)  
            RETURNING note_id AS id
            `,
            [title,content,isFavorite,isArchived,folderId,user_id]
        )

        return NextResponse.json(
            {id:rows[0].id},
            {status:200}
        )

    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error:"Internal Server Error"},
            {status:500}
        )
    }
}
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = request.cookies.get("accessToken")?.value;
    const folderId = searchParams.get("folderId");
    const page = parseInt(searchParams.get("page") || '1');
    const limit = parseInt(searchParams.get("limit") || '10');
    const search = searchParams.get("search") || '';
    const { user_id } = decodeJwt(token!) as { user_id: string };
    const offset = (page - 1) * limit;

    const archived = searchParams.get("archived");
    const favorite = searchParams.get("favorite");
    const deleted = searchParams.get("deleted");

    try {
        const client = await pool.connect();

        let query = `
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
            JOIN folders f ON n.folder_id = f.folder_id
            WHERE n.user_id = $1
        `;

        const values: (string | boolean | number)[] = [user_id];
        let paramIndex = 2;

            if (folderId) {
                query += ` AND n.folder_id = $${paramIndex}`;
                values.push(folderId);
                paramIndex++;
            } 
            if (deleted) {
                query += ` AND n.deletedat IS ` + (deleted === 'true' ? 'NOT NULL' : 'NULL');
            } 
            // else {
            //     query += ` AND n.deletedat IS NULL`;
            // }

            if (archived) {
                query += ` AND n.isarchived = ` + `${archived === 'true'}`;
            }

            if (favorite) {
                query += ` AND n.isfavorite = ` + `${favorite === 'true'}`;
            }

            if (search) {
                query += ` AND (n.title ILIKE $${paramIndex} OR n.content ILIKE $${paramIndex})`;
                values.push(`%${search}%`);
                paramIndex++;
            }
        

        query += ` ORDER BY n.updatedat DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        values.push(limit, offset);

        const result = await client.query(query, values);
        client.release();

        return NextResponse.json({ notes: result.rows }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
