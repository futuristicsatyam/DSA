"use client";

import { useForm } from "react-hook-form";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@repo/ui";
import { toast } from "sonner";
import { API_URL } from "@/lib/constants";

type FormValues = {
  target: string;
  code: string;
  newPassword: string;
};

export default function ResetPasswordPage() {
  const form = useForm<FormValues>({
    defaultValues: { target: "", code: "", newPassword: "" }
  });

  async function onSubmit(values: FormValues) {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(Array.isArray(payload.message) ? payload.message.join(", ") : payload.message);
      toast.success("Password reset successful");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reset failed");
    }
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Input {...form.register("target")} placeholder="Email or phone number" />
          <Input {...form.register("code")} placeholder="OTP code" />
          <Input type="password" {...form.register("newPassword")} placeholder="New password" />
          <Button className="w-full" type="submit">Reset password</Button>
        </form>
      </CardContent>
    </Card>
  );
}
