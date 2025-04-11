import pool from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest,{params}:{params:{id:string}}){
    const note_id = params.id;

    try{
        const result = await pool.query(
            `
                SELECT 
                    n.note_id AS id,
                    n.folder_id AS "folderId",
                    n.title,
                    n.content,
                    n.isfavorite AS "isFavorite",
                    n.isarchived AS "isArchived",
                    n.createdat AS "createdAt",
                    n.updatedat AS "upatedAt",
                    n.deletedat AS "deletedAt",
                    json_build_object(
                        'id', f.folder_id,
                        'name', f.name,
                        'createdAt', f.createdat,
                        'updatedAt', f.updatedat,
                        'deletedAt', f.deletedat
                    ) AS folder
                FROM notes n
                JOIN folders f
                ON n.folder_id = f.folder_id
                WHERE n.note_id = $1
            `,
            [note_id]
        )
        return NextResponse.json(
            {note: result.rows[0]},
            {status:200}
        )
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {message:"Internal Server Error"},
            {status:500}
        )
    }
    
}

export async function DELETE(request:NextRequest,{params}:{params:{id:string}}) {
    const note_id = params.id;

    try{
        await pool.query(
            `
                UPDATE notes
                SET deletedat = CURRENT_TIMESTAMP
                WHERE note_id = $1
            `,
            [note_id]
        )

        return NextResponse.json(
            {message: "Note Deleted Successfully"},
            {status:201}
        )

    }catch(error){
        console.error(error);
        return NextResponse.json(
            {error:"Internal Server Error"},
            {status : 500}
        )
    }
}

export async function PATCH(request:NextRequest,{params}:{params:{id:string}}) {
    const note_id = params.id;
    const {folderId,title,content,isFavorite,isArchived} = await request.json();

    if(!folderId || !title || !content || isFavorite === undefined || isArchived === undefined){
        return NextResponse.json(
            {error:"Invalid Request Body"},
            {status:400}
        )
    }

    try{
        await pool.query(
            `
                UPDATE notes
                SET 
                    folder_id = $1,
                    title = $2,
                    content = $3,
                    isfavorite = $4,
                    isarchived = $5,
                    updatedat = CURRENT_TIMESTAMP
                WHERE note_id = $6
            `,
            [folderId,title,content,isFavorite,isArchived,note_id]
        )

        return NextResponse.json(
            {message:"Note Updated Successfully"},
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