import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Template mode: no auth. Allow all routes. Add your API/auth later.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
