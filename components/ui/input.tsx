import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-[color:var(--border-default)] bg-[rgba(255,255,255,0.94)] px-3.5 py-2 text-sm text-[var(--text-primary)] shadow-[var(--shadow-subtle)] transition-colors placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[color:var(--ring-brand)] focus-visible:border-[color:var(--color-brand-500)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
