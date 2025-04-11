import pool from "@/lib/database/db";
// import { Folder } from "@mui/icons-material";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest,{params}:{params:{id:string}}){
    const note_id = params.id;
    try{
        const client = await pool.connect();
        const result = await client.query(
            `
                UPDATE notes
                SET deletedat = NULL
                WHERE note_id = $1
                RETURNING folder_id
            `,
            [note_id]
        )
        const folder_id = result.rows[0].folder_id;

        await client.query(
            `
                UPDATE folders
                SET deletedat = NULL
                WHERE folder_id = $1
            `,
            [folder_id]
        )

        client.release();

        return NextResponse.json(
            {message:"Note Restore Successfully"},
            {status:201}
        )

    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error:"Internal Server Error"},
            {status:500}
        )
    }
}