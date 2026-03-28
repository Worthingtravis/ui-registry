"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { StepFlowProps } from "@/registry/new-york/step-flow/step-flow";

/**
 * Vertical variant of StepFlow — same props, vertical timeline layout.
 */
export function StepFlowVertical({
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

      <div className="space-y-0">
        {steps.map((s, i) => (
          <button
            key={s.label}
            onClick={() => goTo(i)}
            className="flex items-start gap-3 w-full text-left group"
          >
            {/* Timeline dot + line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-3 w-3 rounded-full border-2 shrink-0 transition-colors mt-0.5",
                  i <= step
                    ? "bg-primary border-primary"
                    : "bg-transparent border-muted-foreground/30",
                )}
              />
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-10 transition-colors",
                    i < step ? "bg-primary/40" : "bg-muted-foreground/10",
                  )}
                />
              )}
            </div>
            {/* Content */}
            <div className="pb-4 -mt-0.5">
              <p
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider transition-colors",
                  i <= step ? "text-primary" : "text-muted-foreground/40",
                )}
              >
                {s.label}
              </p>
              {i === step && (
                <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>

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
