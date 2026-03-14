import Link from "next/link";
import { SignupForm } from "@/components/forms/signup-form";

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <SignupForm />
      <p className="text-center text-sm text-slate-500">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-indigo-600">
          Login
        </Link>
      </p>
    </div>
  );
}
