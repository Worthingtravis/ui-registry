"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single step in the flow. */
export interface StepFlowStep {
  /** Short label displayed on the step button (e.g. "Request", "Sign"). */
  label: string;
  /** Longer description shown in the detail panel when the step is active. */
  description: string;
}

export interface StepFlowProps {
  /** Ordered array of steps to display. */
  steps: StepFlowStep[];
  /** Optional icon rendered before the title. */
  icon?: React.ReactNode;
  /** Title text displayed above the step buttons. */
  title?: string;
  /** Index of the initially active step. Defaults to 0. */
  initialStep?: number;
  /** Called when the active step changes. */
  onStepChange?: (index: number) => void;
  /** Additional class names for the root container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Interactive multi-step flow visualizer.
 *
 * Shows a row of clickable step buttons with arrow connectors between them.
 * The active step and all preceding steps are highlighted. A detail panel
 * below shows the label and description for the current step. Back/Next
 * buttons allow sequential navigation.
 *
 * @example
 * ```tsx
 * <StepFlow
 *   title="Checkout Flow"
 *   steps={[
 *     { label: "Cart", description: "Review your items" },
 *     { label: "Shipping", description: "Enter delivery address" },
 *     { label: "Payment", description: "Add payment method" },
 *     { label: "Confirm", description: "Place your order" },
 *   ]}
 * />
 * ```
 */
export function StepFlow({
  steps,
  icon,
  title,
  initialStep = 0,
  onStepChange,
  className,
}: StepFlowProps) {
  const [step, setStep] = useState(initialStep);

  const goTo = (index: number) => {
    setStep(index);
    onStepChange?.(index);
  };

  if (steps.length === 0) return null;

  return (
    <div className={cn("space-y-6 p-4 sm:p-6 rounded-2xl border border-border/40 bg-card/40", className)}>
      {/* Header */}
      {(icon || title) && (
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          {title && (
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {title}
            </span>
          )}
        </div>
      )}

      {/* Step buttons */}
      <div className="flex flex-wrap gap-1.5">
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            <button
              onClick={() => goTo(i)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all min-w-[56px] flex-1",
                i <= step
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "bg-muted/10 border-border/20 text-muted-foreground/40",
              )}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                {s.label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <ArrowRight
                className={cn(
                  "size-3 shrink-0 self-center",
                  i < step ? "text-primary" : "text-muted-foreground/20",
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Detail panel */}
      <div className="p-4 rounded-xl bg-muted/10 border border-border/20">
        <p className="text-sm font-bold">{steps[step]!.label}</p>
        <p className="text-xs text-muted-foreground">{steps[step]!.description}</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl text-[10px] font-semibold uppercase tracking-wider"
          onClick={() => goTo(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        <Button
          size="sm"
          className="rounded-xl text-[10px] font-semibold uppercase tracking-wider"
          onClick={() => goTo(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
