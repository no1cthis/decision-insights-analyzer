"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { supabaseBrowserClient } from "../../../api/supabase/supabase-browser-client";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    setLoading(true);
    const { email, password } = values;
    const data = await supabaseBrowserClient.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (data.error) {
      setError(data.error.message);
    } else {
      router.push("/");
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    const data = await supabaseBrowserClient.auth.signInWithOAuth({ provider: "google", options: { redirectTo: "http://localhost:3000/auth/callback" } });
    if (data.error) setError(data.error.message);
    setGoogleLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            className="w-full mb-4 flex items-center justify-center gap-2"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            <FcGoogle size={20} />
            {googleLoading ? "Signing in with Google..." : "Sign in with Google"}
          </Button>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <div />
                <Link href="/auth/reset-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              {error && <ErrorMessage error={error} />}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-center text-sm text-muted-foreground">
            Not a member?{' '}
            <Link href="/auth/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 