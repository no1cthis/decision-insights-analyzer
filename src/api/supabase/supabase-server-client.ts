import { createServerClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';

/**
 * Creates a Supabase server client for API routes or middleware.
 *
 * Usage in API route:
 *   const supabase = createSupabaseServerClient(req, res);
 *
 * Usage in middleware:
 *   const supabase = createSupabaseServerClient(req, res);
 */
export function createSupabaseServerClient(req: NextRequest, res?: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => {
          if (res) {
            cookies.forEach(({ name, value, options }) => {
              res.cookies.set(name, value, options);
            });
          }
        },
      },
    }
  );
}