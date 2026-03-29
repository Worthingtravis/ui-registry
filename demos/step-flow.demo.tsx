"use client";

import { StepFlow } from "@/registry/new-york/step-flow/step-flow";
import { ALL_FIXTURES, type StepFlowFixture } from "@/fixtures/step-flow.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

type Fixture = StepFlowFixture;

const propsMeta: PropMeta[] = [
  { name: "steps", type: "StepFlowStep[]", required: true, description: "Ordered array of steps to display" },
  { name: "layout", type: '"horizontal" | "vertical"', required: false, defaultValue: '"horizontal"', description: "Layout direction" },
  { name: "icon", type: "ReactNode", required: false, description: "Icon rendered before the title" },
  { name: "title", type: "string", required: false, description: "Title text above step buttons" },
  { name: "initialStep", type: "number", required: false, defaultValue: "0", description: "Index of the initially active step" },
  { name: "onStepChange", type: "(index: number) => void", required: false, description: "Called when active step changes" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes for root container" },
];

const USAGE = `import { StepFlow } from "@/registry/new-york/step-flow/step-flow"

<StepFlow
  title="Checkout"
  layout="horizontal"
  steps={[
    { label: "Cart", description: "Review items" },
    { label: "Shipping", description: "Enter address" },
    { label: "Payment", description: "Add payment" },
    { label: "Confirm", description: "Place order" },
  ]}
/>

{/* Or vertical timeline */}
<StepFlow layout="vertical" steps={[...]} />`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Step Flow",
  description: "Interactive multi-step flow visualizer with clickable step buttons, arrow connectors, detail panel, and back/next navigation.",
  tags: ["interactive", "flow", "stepper", "wizard"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture, Variant) => {
    if (Variant) return <Variant {...fixture} icon={fixture.title ? <ShoppingCart className="size-4" /> : undefined} />;
    return (
      <StepFlow
        {...fixture}
        icon={fixture.title ? <ShoppingCart className="size-4" /> : undefined}
      />
    );
  },
  variants: [
    {
      name: "Horizontal",
      component: ((props: Fixture) => <StepFlow {...props} layout="horizontal" />) as React.ComponentType<Fixture>,
      description: "Default step row with arrow connectors.",
    },
    {
      name: "Vertical",
      component: ((props: Fixture) => <StepFlow {...props} layout="vertical" />) as React.ComponentType<Fixture>,
      description: "Timeline layout with dots and connecting lines.",
    },
  ],
  propsMeta,
};
