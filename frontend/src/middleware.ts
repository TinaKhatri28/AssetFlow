import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = pathname === "/" || PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const token = request.cookies.get("assetflow_token")?.value;

  // Not logged in, trying to hit a protected route -> send to login
  if (!token && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in, trying to hit login/signup -> send to dashboard
  const isAuthPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (token && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};