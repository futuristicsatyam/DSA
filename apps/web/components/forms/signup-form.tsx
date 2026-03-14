"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@repo/ui";
import { toast } from "sonner";
import { API_URL } from "@/lib/constants";

const schema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phoneNumber: z.string().min(10),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/),
    confirmPassword: z.string().min(8)
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type FormValues = z.infer<typeof schema>;

export function SignupForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  async function onSubmit(values: FormValues) {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(Array.isArray(payload.message) ? payload.message.join(", ") : payload.message);

      toast.success("Account created successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed");
    }
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Full name</label>
            <Input {...form.register("fullName")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input {...form.register("email")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone number</label>
            <Input {...form.register("phoneNumber")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input type="password" {...form.register("password")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm password</label>
            <Input type="password" {...form.register("confirmPassword")} />
          </div>
          <div className="md:col-span-2">
            <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
