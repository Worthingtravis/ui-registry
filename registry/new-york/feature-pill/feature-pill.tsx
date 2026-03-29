import React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Visual variant for the pill. */
export type FeaturePillVariant = "default" | "primary" | "success" | "destructive" | "outline";

export interface FeaturePillProps {
  /** Text label displayed inside the pill. */
  label: string;
  /** Navigation URL. When provided, the pill becomes clickable. */
  href?: string;
  /** Visual variant. */
  variant?: FeaturePillVariant;
  /** Render function for the link wrapper (e.g. Next.js Link). */
  renderLink?: (props: { href: string; className: string; children: React.ReactNode }) => React.ReactNode;
  /** Additional class names. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Variant styles
// ---------------------------------------------------------------------------

const VARIANT_CLASSES: Record<FeaturePillVariant, string> = {
  default:
    "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-primary",
  primary:
    "border-primary/30 bg-primary/10 text-primary hover:border-primary/50 hover:bg-primary/15",
  success:
    "border-success/30 bg-success/10 text-success hover:border-success/50 hover:bg-success/15",
  destructive:
    "border-destructive/30 bg-destructive/10 text-destructive hover:border-destructive/50 hover:bg-destructive/15",
  outline:
    "border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Small rounded pill badge for feature labels, tags, or categories.
 * Supports static display and clickable link variants.
 *
 * @example
 * ```tsx
 * <FeaturePill label="New" variant="primary" />
 * <FeaturePill label="Docs" href="/docs" />
 * <FeaturePill label="Beta" variant="success" />
 * ```
 */
export function FeaturePill({
  label,
  href,
  variant = "default",
  renderLink,
  className,
}: FeaturePillProps) {
  const classes = cn(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors",
    VARIANT_CLASSES[variant],
    href && "cursor-pointer",
    className,
  );

  if (href && renderLink) {
    return <>{renderLink({ href, className: classes, children: label })}</>;
  }

  if (href) {
    return (
      <span role="link" tabIndex={0} className={classes}>
        {label}
      </span>
    );
  }

  return <span className={classes}>{label}</span>;
}
