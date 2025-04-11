import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Unauthorized - Access Token Missing" },
      { status: 401 }
    );
  }

  try {
    const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(accessToken, JWT_SECRET);
    
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.json(
      { error: "Unauthorized - Invalid or expired access token" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ['/api/notes/:path*','/api/folders/:path*'],
};