"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single step in the onboarding checklist. */
export interface ChecklistStep {
  /** Display label for the step. */
  label: string;
  /** Whether the step has been completed. */
  complete: boolean;
  /** Navigation URL for the step (renders as a link when not locked). */
  href?: string;
  /** Locked steps are dimmed and not clickable. */
  locked?: boolean;
}

export interface OnboardingChecklistProps {
  /** Ordered array of steps to display. */
  steps: ChecklistStep[];
  /** Title shown above the checklist. */
  title?: string;
  /** Message shown when all steps are complete or the checklist is dismissed. */
  completeMessage?: string;
  /** Whether the checklist has been dismissed by the user. */
  dismissed?: boolean;
  /** Called when the user clicks the dismiss button. */
  onDismiss?: () => void;
  /**
   * Render function for step links. Use this for framework-specific routing
   * (e.g. Next.js `<Link>`). When omitted, renders a plain `<a>` tag.
   */
  renderLink?: (step: ChecklistStep, children: React.ReactNode) => React.ReactNode;
  /** Whether to show the dismiss button. */
  showDismiss?: boolean;
  /** Additional class names for the root container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Linear onboarding checklist with numbered steps, completion indicators,
 * step locking, and a dismissible success state. Steps can link to setup
 * pages or be locked until prerequisites are met.
 *
 * @example
 * ```tsx
 * <OnboardingChecklist
 *   title="Getting Started"
 *   steps={[
 *     { label: "Create an account", complete: true, href: "/signup" },
 *     { label: "Set up your profile", complete: false, href: "/profile" },
 *     { label: "Invite your team", complete: false, locked: true },
 *   ]}
 *   onDismiss={() => setDismissed(true)}
 * />
 * ```
 */
export function OnboardingChecklist({
  steps,
  title = "Getting Started",
  completeMessage = "You're all set!",
  dismissed = false,
  onDismiss,
  renderLink,
  showDismiss = true,
  className,
}: OnboardingChecklistProps) {
  const allComplete = steps.every((s) => s.complete);

  if (dismissed || allComplete) {
    return (
      <div
        className={cn(
          "rounded-lg border border-success/30 bg-success/5 p-4",
          className,
        )}
      >
        <p className="text-sm text-success font-medium">{completeMessage}</p>
      </div>
    );
  }

  const completedCount = steps.filter((s) => s.complete).length;

  return (
    <div className={cn("rounded-lg border border-border p-5 space-y-4", className)}>
      {/* Header with progress */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${(completedCount / steps.length) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <ol className="space-y-3">
        {steps.map((step, i) => (
          <li
            key={i}
            className={cn(
              "flex items-center gap-3",
              step.locked && "opacity-50",
            )}
          >
            {step.complete ? (
              <span className="flex items-center justify-center size-6 rounded-full bg-success/10 text-success shrink-0">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            ) : (
              <span className="flex items-center justify-center size-6 rounded-full border border-border text-muted-foreground text-sm shrink-0">
                {i + 1}
              </span>
            )}
            {step.href && !step.locked ? (
              renderLink ? (
                renderLink(step, <span className="text-sm hover:underline text-foreground">{step.label}</span>)
              ) : (
                <a href={step.href} className="text-sm hover:underline text-foreground">
                  {step.label}
                </a>
              )
            ) : (
              <span className={cn("text-sm", step.complete ? "text-muted-foreground line-through" : "text-muted-foreground")}>
                {step.label}
              </span>
            )}
          </li>
        ))}
      </ol>

      {showDismiss && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
