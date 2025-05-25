"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabaseBrowserClient } from "../../../api/supabase/supabase-browser-client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    supabaseBrowserClient.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace("/");
      } else {
        router.replace("/auth/login");
      }
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="text-lg">Signing you in...</span>
    </div>
  );
} 