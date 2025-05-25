import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';


// Prefix public routes (e.g., for API or static folders)
const PUBLIC_PREFIXES = ['/api/auth']

function isProtectedRoute(pathname: string) {
  return !PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }


  const response = NextResponse.next({
    request: req,
  });
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
            // Ensure cookies are set securely in production
            response.cookies.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            });
          });
        },
      },
    }
  );

  // Always use getUser for secure auth validation
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/auth/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*', // Protect all API routes
  ],
}; 