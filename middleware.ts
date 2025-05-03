// middleware.ts
import { NextResponse } from 'next/server';

export const config = {
  matcher: '/__forms.html',
};

export function middleware(request) {
  // Rewrite so /__forms.html comes straight from public/
  return NextResponse.rewrite(
    new URL(request.nextUrl.pathname, request.url)
  );
}
