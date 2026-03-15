import * as React from "react";
import { cn } from "../lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-indigo-500 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
