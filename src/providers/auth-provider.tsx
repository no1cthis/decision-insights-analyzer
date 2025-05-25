"use client";

import { usePathname, useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect } from "react";
import { supabaseBrowserClient } from "../api/supabase/supabase-browser-client";



export const AuthProvider:FC<PropsWithChildren> = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();

  useEffect(() => {
    if(pathname.startsWith("/auth")){
        return;
    }
    let mounted = true;
    // Listen for auth state changes
    const { data: listener } = supabaseBrowserClient.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if(!session?.user){
        router.push("/auth/login");
      }
    });
    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [pathname, router]);

  return children;
}