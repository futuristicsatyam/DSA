"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@repo/ui";
import { toast } from "sonner";
import { API_URL } from "@/lib/constants";

const schema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  });

  async function onSubmit(values: FormValues) {
  try {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(
        Array.isArray(payload.message) ? payload.message.join(", ") : payload.message
      );
    }

    toast.success("Logged in successfully");
    window.location.href = "/dashboard";
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Login failed");
  }
}

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Login to continue</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email or phone</label>
            <Input {...form.register("identifier")} placeholder="you@example.com" />
            {form.formState.errors.identifier && <p className="text-sm text-red-500">{form.formState.errors.identifier.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input {...form.register("password")} type="password" placeholder="••••••••" />
            {form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
          </div>
          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
