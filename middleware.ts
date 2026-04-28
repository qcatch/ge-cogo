import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const expectedUser = process.env.POC_USERNAME ?? "genesis";
  const expectedPass = process.env.POC_PASSWORD;

  if (!expectedPass) return NextResponse.next();

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const [user, pass] = atob(auth.slice(6)).split(":");
    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Genesis TCE POC"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
