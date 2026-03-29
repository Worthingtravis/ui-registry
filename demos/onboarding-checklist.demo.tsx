"use client";

import { useState } from "react";
import { OnboardingChecklist } from "@/registry/new-york/onboarding-checklist/onboarding-checklist";
import type { ChecklistStep } from "@/registry/new-york/onboarding-checklist/onboarding-checklist";
import {
  ALL_FIXTURES,
  type OnboardingChecklistFixture,
} from "@/fixtures/onboarding-checklist.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = OnboardingChecklistFixture;

const propsMeta: PropMeta[] = [
  { name: "steps", type: "ChecklistStep[]", required: true, description: "Ordered array of steps with label, complete, href, and locked" },
  { name: "title", type: "string", required: false, defaultValue: '"Getting Started"', description: "Title above the checklist" },
  { name: "completeMessage", type: "string", required: false, defaultValue: '"You\'re all set!"', description: "Message shown when all steps complete" },
  { name: "dismissed", type: "boolean", required: false, defaultValue: "false", description: "Whether the checklist is dismissed" },
  { name: "onDismiss", type: "() => void", required: false, description: "Called when dismiss is clicked" },
  { name: "renderLink", type: "(step, children) => ReactNode", required: false, description: "Custom link renderer for framework routing" },
  { name: "showDismiss", type: "boolean", required: false, defaultValue: "true", description: "Whether to show the dismiss button" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

const USAGE = `import { OnboardingChecklist } from "@/registry/new-york/onboarding-checklist/onboarding-checklist"
import type { ChecklistStep } from "@/registry/new-york/onboarding-checklist/onboarding-checklist"

const steps: ChecklistStep[] = [
  { label: "Create an account", complete: true, href: "/signup" },
  { label: "Set up your profile", complete: false, href: "/profile" },
  { label: "Invite your team", complete: false, locked: true },
]

<OnboardingChecklist
  title="Getting Started"
  steps={steps}
  onDismiss={() => localStorage.setItem("onboarding", "dismissed")}
/>

{/* With Next.js Link */}
<OnboardingChecklist
  steps={steps}
  renderLink={(step, children) => (
    <Link href={step.href!}>{children}</Link>
  )}
/>`;

function InteractiveDemo({ fixture }: { fixture: Fixture }) {
  const [steps, setSteps] = useState<ChecklistStep[]>(fixture.steps);
  const [dismissed, setDismissed] = useState(fixture.dismissed ?? false);

  const toggleStep = (index: number) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, complete: !s.complete } : s)),
    );
  };

  return (
    <div className="max-w-md mx-auto space-y-3">
      <OnboardingChecklist
        {...fixture}
        steps={steps}
        dismissed={dismissed}
        onDismiss={() => setDismissed(true)}
      />
      {!dismissed && !steps.every((s) => s.complete) && (
        <div className="flex flex-wrap gap-1.5">
          {steps.map((step, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleStep(i)}
              className="text-[10px] px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              {step.complete ? "Undo" : "Complete"} step {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const config: PreviewLabConfig<Fixture> = {
  title: "Onboarding Checklist",
  description:
    "Linear onboarding checklist with numbered steps, completion indicators, progress bar, step locking, and dismissible success state.",
  tags: ["onboarding", "checklist", "wizard", "progress", "interactive"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => <InteractiveDemo fixture={fixture} />,
  propsMeta,
};
