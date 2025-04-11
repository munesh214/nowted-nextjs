import pool from "@/lib/database/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request:NextRequest, {params}:{params:{id:string}}){
    const {name:newName} = await request.json();
    const folder_id = params.id;

    try{
        await pool.query(
            `
                UPDATE folders
                SET 
                    name = $1,
                    updatedat = CURRENT_TIMESTAMP
                WHERE folder_id = $2
            `,
            [newName,folder_id]

        )

        return NextResponse.json(
            {message:"Folder Updated Successfully"},
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

export async function DELETE(request:NextRequest,{params}:{params:{id:string}}){
    const folder_id = params.id;

    try{
        const client = await pool.connect();

        await client.query(
            `
                UPDATE folders
                SET deletedat = CURRENT_TIMESTAMP
                WHERE folder_id = $1
            `,
            [folder_id]
        )

        await client.query(
            `
                UPDATE notes
                SET deletedat = CURRENT_TIMESTAMP
                WHERE folder_id = $1
            `,
            [folder_id]
        )

        client.release();
        return NextResponse.json(
            {message:"Folder Deleted Successfully!"},
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