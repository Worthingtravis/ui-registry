"use client";

import type { ComponentType } from "react";
import { StepFlow } from "@/registry/new-york/step-flow/step-flow";
import { StepFlowVertical } from "@/registry/new-york/step-flow-vertical/step-flow-vertical";
import { ALL_FIXTURES, type StepFlowFixture } from "@/fixtures/step-flow.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

type Fixture = StepFlowFixture;

const propsMeta: PropMeta[] = [
  { name: "steps", type: "StepFlowStep[]", required: true, description: "Ordered array of steps to display" },
  { name: "icon", type: "ReactNode", required: false, description: "Icon rendered before the title" },
  { name: "title", type: "string", required: false, description: "Title text above step buttons" },
  { name: "initialStep", type: "number", required: false, defaultValue: "0", description: "Index of the initially active step" },
  { name: "onStepChange", type: "(index: number) => void", required: false, description: "Called when active step changes" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes for root container" },
];

const USAGE = `import { StepFlow } from "@/registry/new-york/step-flow/step-flow"

<StepFlow
  title="Checkout"
  steps={[
    { label: "Cart", description: "Review items" },
    { label: "Shipping", description: "Enter address" },
    { label: "Payment", description: "Add payment" },
    { label: "Confirm", description: "Place order" },
  ]}
/>`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Step Flow",
  description: "Interactive multi-step flow visualizer with clickable step buttons, arrow connectors, detail panel, and back/next navigation.",
  tags: ["interactive", "flow", "stepper", "wizard"],
  usageCode: USAGE,
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
};
