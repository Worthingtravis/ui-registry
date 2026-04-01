"use client";

import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single step in the welcome banner. */
export interface WelcomeStep {
  /** Short label rendered as the step title. */
  title: string;
  /** One-sentence explanation of the step. */
  description: string;
  /** CTA button label (e.g. "Add funds"). */
  ctaLabel: string;
  /** Navigation URL for the CTA. */
  ctaHref: string;
  /** Whether this step has been completed. */
  done: boolean;
  /** Optional icon rendered next to the step number. */
  icon?: ReactNode;
}

export interface WelcomeBannerProps {
  /** Greeting line (e.g. "Welcome, Alice"). */
  greeting: string;
  /** Short tagline shown below the greeting. */
  tagline: string;
  /** Ordered next-step cards. */
  steps: WelcomeStep[];
  /** Whether the banner has been dismissed. */
  dismissed?: boolean;
  /** Called when the dismiss button is clicked. */
  onDismiss?: () => void;
  /** Custom link renderer for framework routing (e.g. Next.js Link). Falls back to a `<span>`. */
  renderLink?: (href: string, children: ReactNode) => ReactNode;
  /** Additional CSS class names. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * First-time welcome banner with greeting, tagline, and step cards.
 *
 * Designed for onboarding flows — greets the user by name, surfaces next steps
 * with progress tracking, and provides a dismiss button. Pure presentation:
 * all strings and state come through props.
 */
export function WelcomeBanner({
  greeting,
  tagline,
  steps,
  dismissed = false,
  onDismiss,
  renderLink,
  className,
}: WelcomeBannerProps) {
  if (dismissed) return null;

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = steps.length > 0 && completedCount === steps.length;

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-primary/20 bg-primary/5 p-6",
        "animate-in fade-in slide-in-from-bottom-3 duration-500",
        className,
      )}
      role="complementary"
      aria-label="Getting started guide"
    >
      {/* Dismiss button */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss welcome guide"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <X className="size-4" />
        </button>
      )}

      {/* Greeting */}
      <div className="mb-5 pr-8">
        <h2 className="text-lg font-semibold tracking-tight">{greeting}</h2>
        <p className="text-sm text-muted-foreground mt-1">{tagline}</p>
      </div>

      {/* Progress indicator */}
      {steps.length > 0 && (
        <div className="mb-4 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            <span>Progress</span>
            <span className="tabular-nums">
              {completedCount}/{steps.length}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                allDone ? "bg-green-500" : "bg-primary",
              )}
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* All-done celebration */}
      {allDone && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
          <CheckCircle2 className="size-4 text-green-500 shrink-0" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            All steps complete!
          </span>
        </div>
      )}

      {/* Step cards */}
      {steps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {steps.map((step, i) => (
            <StepCard
              key={step.title}
              step={step}
              index={i}
              renderLink={renderLink}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// StepCard
// ---------------------------------------------------------------------------

interface StepCardProps {
  step: WelcomeStep;
  index: number;
  renderLink?: (href: string, children: ReactNode) => ReactNode;
}

function StepCard({ step, index, renderLink }: StepCardProps) {
  const linkContent = (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
      {step.ctaLabel} &rarr;
    </span>
  );

  return (
    <div
      className={cn(
        "relative flex flex-col gap-3 rounded-xl border p-4 transition-colors",
        step.done
          ? "border-green-500/20 bg-green-500/5 opacity-70"
          : "border-border/40 bg-card/40 hover:border-primary/30 hover:bg-primary/5",
      )}
    >
      {/* Step number + icon */}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-lg",
            step.done
              ? "bg-green-500/15 text-green-500"
              : "bg-muted text-muted-foreground",
          )}
        >
          {step.done ? (
            <CheckCircle2 className="size-4" />
          ) : (
            step.icon ?? (
              <span className="text-xs font-bold">{index + 1}</span>
            )
          )}
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/60">
          Step {index + 1}
        </span>
      </div>

      {/* Title + description */}
      <div className="flex-1">
        <p
          className={cn(
            "text-sm font-medium",
            step.done && "line-through text-muted-foreground",
          )}
        >
          {step.title}
        </p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          {step.description}
        </p>
      </div>

      {/* CTA */}
      {!step.done && (
        <div className="mt-auto">
          {renderLink ? (
            renderLink(step.ctaHref, linkContent)
          ) : (
            <span>{linkContent}</span>
          )}
        </div>
      )}
    </div>
  );
}
