import { createServerClient } from '@supabase/ssr';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import type { NextResponse } from 'next/server';

export function createSupabaseServerClient(cookieStore: ReadonlyRequestCookies | RequestCookies, res?: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
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