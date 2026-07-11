import { NextResponse, type NextRequest } from "next/server";

import { supportedLocale } from "@/lib/i18n";

export function proxy(request: NextRequest) {
  const firstSegment = request.nextUrl.pathname.split("/")[1];
  const locale = supportedLocale(firstSegment);
  if (!locale) return NextResponse.next();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-teuteuteu-locale", locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js|offline.html).*)"],
};
