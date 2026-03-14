import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/bookmarks", "/profile", "/progress"];
const adminPaths = ["/admin"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("user_role")?.value;

  if (protectedPaths.some((path) => pathname.startsWith(path)) && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (adminPaths.some((path) => pathname.startsWith(path)) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/bookmarks/:path*", "/profile/:path*", "/progress/:path*", "/admin/:path*"]
};
