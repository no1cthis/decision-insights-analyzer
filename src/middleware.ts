import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Exact public routes
// const PUBLIC_ROUTES = new Set([
//     "/",
// ]);

// Prefix public routes (e.g., for API or static folders)
const PUBLIC_PREFIXES = ['/api/auth', "api/callback", '/public', '/auth', '/auth/callback'];

function isPublicRoute(pathname: string) {
//   if (PUBLIC_ROUTES.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const data = await supabase.auth.getUser();
  const user = data.data.user;

  if (!user) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Protect all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
}; 