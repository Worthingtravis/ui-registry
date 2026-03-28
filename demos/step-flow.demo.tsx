"use client";

import type { ComponentType } from "react";
import { StepFlow, type StepFlowProps } from "@/registry/step-flow";
import { StepFlowVertical } from "@/registry/step-flow-vertical";
import { ALL_FIXTURES } from "@/fixtures/step-flow.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

type Fixture = Omit<StepFlowProps, "onStepChange" | "className">;

const propsMeta: PropMeta[] = [
  { name: "steps", type: "StepFlowStep[]", required: true, description: "Ordered array of steps to display" },
  { name: "icon", type: "ReactNode", required: false, description: "Icon rendered before the title" },
  { name: "title", type: "string", required: false, description: "Title text above step buttons" },
  { name: "initialStep", type: "number", required: false, defaultValue: "0", description: "Index of the initially active step" },
  { name: "onStepChange", type: "(index: number) => void", required: false, description: "Called when active step changes" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes for root container" },
];

export const config: PreviewLabConfig<Fixture> = {
  title: "Step Flow",
  description: "Interactive multi-step flow visualizer with clickable step buttons, arrow connectors, detail panel, and back/next navigation.",
  tags: ["interactive", "flow", "stepper", "wizard"],
  fixtures: ALL_FIXTURES,
  render: (fixture, Variant) => {
    const Comp = Variant ?? StepFlow;
    return (
      <Comp
        {...fixture}
        icon={fixture.title ? <ShoppingCart className="size-4" /> : undefined}
      />
    );
  },
  variants: [
    { name: "Horizontal", component: StepFlow as ComponentType<Fixture>, description: "Default horizontal step row with arrow connectors." },
    { name: "Vertical Timeline", component: StepFlowVertical as ComponentType<Fixture>, description: "Vertical timeline layout with dots and connecting lines." },
  ],
  propsMeta,
  sourceCode: `export interface StepFlowStep {
  label: string;
  description: string;
}

export interface StepFlowProps {
  steps: StepFlowStep[];
  icon?: ReactNode;
  title?: string;
  initialStep?: number;
  onStepChange?: (index: number) => void;
  className?: string;
}

export function StepFlow({ steps, icon, title, initialStep = 0, onStepChange, className }: StepFlowProps) {
  const [step, setStep] = useState(initialStep);
  const goTo = (i: number) => { setStep(i); onStepChange?.(i); };

  return (
    <div className={cn("space-y-6 p-4 rounded-2xl border border-border/40 bg-card/40", className)}>
      {/* Step buttons with ArrowRight connectors */}
      <div className="flex flex-wrap gap-1.5">
        {steps.map((s, i) => (
          <button key={s.label} onClick={() => goTo(i)}
            className={cn("p-3 rounded-xl border", i <= step ? "bg-primary/10" : "bg-muted/10")}>
            {s.label}
          </button>
        ))}
      </div>
      {/* Detail panel + Back/Next navigation */}
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
  "Checkout (5 steps)": fx({ steps: [...BASE.steps, { label: "Done", description: "..." }] }),
  "Onboarding (mid-step)": fx({ title: "Onboarding", initialStep: 2, steps: [...] }),
  "Minimal (no title)": { steps: [{ label: "Upload", ... }, ...] },
  "Many steps": fx({ title: "CI Pipeline", steps: [...7 steps...], initialStep: 3 }),
};`,
};
