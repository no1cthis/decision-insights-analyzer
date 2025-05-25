"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";
import { supabaseBrowserClient } from "../../api/supabase/supabase-browser-client";

const SignOutButton: FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    supabaseBrowserClient.auth.getUser().then(({ data: { user } }) => {
      if (mounted) setAuthenticated(!!user);
    });
    const { data: listener } = supabaseBrowserClient.auth.onAuthStateChange((_event, session) => {
      if (mounted) setAuthenticated(!!session?.user);
    });
    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = useCallback(async () => {
    await supabaseBrowserClient.auth.signOut();
    router.push("/auth/login");
  }, [router]);

  if (!authenticated) return null;
  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};

export default SignOutButton; 