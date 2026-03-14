"use client";

import { useForm } from "react-hook-form";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@repo/ui";
import { toast } from "sonner";
import { API_URL } from "@/lib/constants";

type FormValues = {
  target: string;
};

export default function ForgotPasswordPage() {
  const form = useForm<FormValues>({
    defaultValues: { target: "" }
  });

  async function onSubmit(values: FormValues) {
    try {
      const response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(Array.isArray(payload.message) ? payload.message.join(", ") : payload.message);
      toast.success("OTP sent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send OTP");
    }
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Input {...form.register("target")} placeholder="Email or phone number" />
          <Button className="w-full" type="submit">Send reset OTP</Button>
        </form>
      </CardContent>
    </Card>
  );
}
