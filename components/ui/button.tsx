"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border text-sm font-medium transition-all duration-[var(--motion-fast)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[color:var(--ring-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-brand-500)] text-[var(--text-inverse)] shadow-[var(--shadow-subtle)] hover:bg-[var(--color-brand-600)] active:scale-[0.98]",
        primary:
          "border-transparent bg-[var(--color-brand-500)] text-[var(--text-inverse)] shadow-[var(--shadow-subtle)] hover:bg-[var(--color-brand-600)] active:scale-[0.98]",
        secondary:
          "border-transparent bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:bg-[var(--color-neutral-100)] active:scale-[0.98]",
        ghost:
          "border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]",
        tertiary:
          "border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]",
        outline:
          "border-[color:var(--border-default)] bg-[rgba(255,255,255,0.94)] text-[var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]",
        teal:
          "border-transparent bg-[var(--status-ai-solid)] text-[var(--text-inverse)] shadow-[var(--shadow-subtle)] hover:bg-[var(--color-ai-600)] active:scale-[0.98]",
        ai:
          "border-transparent bg-[var(--status-ai-solid)] text-[var(--text-inverse)] shadow-[var(--shadow-subtle)] hover:bg-[var(--color-ai-600)] active:scale-[0.98]",
        success:
          "border-transparent bg-[var(--status-success-solid)] text-[var(--text-inverse)] shadow-[var(--shadow-subtle)] hover:bg-[var(--color-success-600)] active:scale-[0.98]",
        warning:
          "border-transparent bg-[var(--status-warning-solid)] text-[var(--text-inverse)] shadow-[var(--shadow-subtle)] hover:bg-[var(--color-warning-600)] active:scale-[0.98]",
        destructive:
          "border-transparent bg-[var(--status-critical-solid)] text-[var(--text-inverse)] shadow-[var(--shadow-subtle)] hover:bg-[var(--color-danger-600)] active:scale-[0.98]",
        danger:
          "border-transparent bg-[var(--status-critical-solid)] text-[var(--text-inverse)] shadow-[var(--shadow-subtle)] hover:bg-[var(--color-danger-600)] active:scale-[0.98]",
        link: "h-auto border-transparent bg-transparent p-0 text-[var(--color-brand-600)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        md: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
