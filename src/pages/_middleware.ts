import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: 'onepiece' });

  console.log(req.nextUrl.pathname);

  if (!session && !req.nextUrl.pathname.startsWith('/api/trpc')) {
    return NextResponse.redirect(
      new URL(`/api/auth/signin?from=${req.nextUrl.pathname}`, req.url),
    );
  }

  return NextResponse.next();
}
