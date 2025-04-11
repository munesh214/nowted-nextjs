import { NextRequest, NextResponse} from "next/server";

export async function POST(request:NextRequest) {
    const cookies = request.cookies.get("accessToken");

    if(!cookies){
        return NextResponse.json(
            {error:"Already Logged Out!"},
            {status:400}
        )
    }

    const response = NextResponse.json(
        {message:"Logout Successfully!"},
        {status:200}
    )

    response.cookies.delete("accessToken");

    return response;
}