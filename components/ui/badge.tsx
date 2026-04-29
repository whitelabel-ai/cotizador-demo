import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors",
  {
    variants: {
      variant: {
        default: "border-[color:var(--status-info-border)] bg-[var(--status-info-surface)] text-[var(--status-info-text)]",
        brand: "border-[color:var(--status-info-border)] bg-[var(--status-info-surface)] text-[var(--status-info-text)]",
        secondary: "border-[color:var(--border-default)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]",
        neutral: "border-[color:var(--border-default)] bg-[var(--bg-subtle)] text-[var(--text-secondary)]",
        teal: "border-[color:var(--status-ai-border)] bg-[var(--status-ai-surface)] text-[var(--status-ai-text)]",
        ai: "border-[color:var(--status-ai-border)] bg-[var(--status-ai-surface)] text-[var(--status-ai-text)]",
        success: "border-[color:var(--status-success-border)] bg-[var(--status-success-surface)] text-[var(--status-success-text)]",
        warning: "border-[color:var(--status-warning-border)] bg-[var(--status-warning-surface)] text-[var(--status-warning-text)]",
        destructive: "border-[color:var(--status-critical-border)] bg-[var(--status-critical-surface)] text-[var(--status-critical-text)]",
        danger: "border-[color:var(--status-critical-border)] bg-[var(--status-critical-surface)] text-[var(--status-critical-text)]",
        violet: "border-[color:var(--status-review-border)] bg-[var(--status-review-surface)] text-[var(--status-review-text)]",
        review: "border-[color:var(--status-review-border)] bg-[var(--status-review-surface)] text-[var(--status-review-text)]",
        outline: "border-[color:var(--border-default)] bg-transparent text-[var(--text-muted)]",
      },
    },
    defaultVariants: { variant: "brand" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
