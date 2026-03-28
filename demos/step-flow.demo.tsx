"use client";

import React from "react";
import { StepFlow, type StepFlowProps } from "@/registry/step-flow";
import { StepFlowVertical } from "@/registry/step-flow-vertical";
import { ALL_FIXTURES } from "@/fixtures/step-flow.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

const propsMeta: PropMeta[] = [
  { name: "steps", type: "StepFlowStep[]", required: true, description: "Ordered array of steps to display" },
  { name: "icon", type: "ReactNode", required: false, description: "Icon rendered before the title" },
  { name: "title", type: "string", required: false, description: "Title text above step buttons" },
  { name: "initialStep", type: "number", required: false, defaultValue: "0", description: "Index of the initially active step" },
  { name: "onStepChange", type: "(index: number) => void", required: false, description: "Called when active step changes" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes for root container" },
];

export const config: PreviewLabConfig<Omit<StepFlowProps, "onStepChange" | "className">> = {
  title: "Step Flow",
  description: "Interactive multi-step flow visualizer with clickable step buttons, arrow connectors, detail panel, and back/next navigation.",
  tags: ["interactive", "flow", "stepper", "wizard"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <StepFlow
      {...fixture}
      icon={fixture.title ? <ShoppingCart className="size-4" /> : undefined}
    />
  ),
  variants: [
    { name: "Horizontal", component: StepFlow as React.ComponentType<Omit<StepFlowProps, "onStepChange" | "className">>, description: "Default horizontal step row with arrow connectors." },
    { name: "Vertical Timeline", component: StepFlowVertical as React.ComponentType<Omit<StepFlowProps, "onStepChange" | "className">>, description: "Vertical timeline layout with dots and connecting lines." },
  ],
  propsMeta,
  sourceCode: `import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface StepFlowStep {
  label: string;
  description: string;
}

export interface StepFlowProps {
  steps: StepFlowStep[];
  icon?: React.ReactNode;
  title?: string;
  initialStep?: number;
  onStepChange?: (index: number) => void;
  className?: string;
}

export function StepFlow({ steps, icon, title, initialStep = 0, onStepChange, className }: StepFlowProps) {
  const [step, setStep] = useState(initialStep);
  const goTo = (i: number) => { setStep(i); onStepChange?.(i); };

  return (
    <div className={cn("space-y-6 p-4 sm:p-6 rounded-2xl border border-border/40 bg-card/40", className)}>
      <div className="flex flex-wrap gap-1.5">
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            <button onClick={() => goTo(i)} className={cn("p-3 rounded-xl border", i <= step ? "bg-primary/10" : "bg-muted/10")}>
              <span className="text-[10px] font-semibold uppercase">{s.label}</span>
            </button>
            {i < steps.length - 1 && <ArrowRight className="size-3 self-center" />}
          </React.Fragment>
        ))}
      </div>
      <div className="p-4 rounded-xl bg-muted/10 border border-border/20">
        <p className="text-sm font-bold">{steps[step]!.label}</p>
        <p className="text-xs text-muted-foreground">{steps[step]!.description}</p>
      </div>
    </div>
  );
}`,
  fixtureCode: `import type { StepFlowProps } from "@/registry/step-flow";
type Fixture = Omit<StepFlowProps, "onStepChange" | "className">;

const BASE: Fixture = {
  title: "Checkout Flow",
  steps: [
    { label: "Cart", description: "Review items in your shopping cart." },
    { label: "Shipping", description: "Enter your delivery address." },
    { label: "Payment", description: "Add a payment method." },
    { label: "Confirm", description: "Review your order and place it." },
  ],
  initialStep: 0,
};

const fx = (overrides: Partial<Fixture>): Fixture => ({ ...BASE, ...overrides });

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Checkout (5 steps)": fx({ steps: [...BASE.steps, { label: "Done", description: "Order placed!" }] }),
  "Onboarding (mid-step)": fx({ title: "Onboarding", initialStep: 2, steps: [...] }),
  "Minimal (no title)": { steps: [{ label: "Upload", ... }, { label: "Process", ... }] },
};`,
};
