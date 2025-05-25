"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabaseBrowserClient } from "../../../api/supabase/supabase-browser-client";

interface ResetPasswordFormValues {
  email: string;
}

export default function ResetPasswordPage() {
  const form = useForm<ResetPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(values: ResetPasswordFormValues) {
    setError(null);
    setSuccess(false);
    setLoading(true);
    const { email } = values;
    const { error } = await supabaseBrowserClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      form.reset();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Reset your password</CardTitle>
        </CardHeader>
        <CardContent>
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
              {error && <ErrorMessage error={error} />}
              {success && <div className="text-sm text-green-600 text-center">Check your email for a password reset link.</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send reset email"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link href="/auth/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 