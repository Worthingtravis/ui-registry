"use client";

import { useState } from "react";
import { WelcomeBanner } from "@/registry/new-york/welcome-banner/welcome-banner";
import type { WelcomeStep } from "@/registry/new-york/welcome-banner/welcome-banner";
import {
  ALL_FIXTURES,
  type WelcomeBannerFixture,
} from "@/fixtures/welcome-banner.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = WelcomeBannerFixture;

const propsMeta: PropMeta[] = [
  { name: "greeting", type: "string", required: true, description: "Greeting line (e.g. 'Welcome, Alice')" },
  { name: "tagline", type: "string", required: true, description: "Short tagline shown below the greeting" },
  { name: "steps", type: "WelcomeStep[]", required: true, description: "Ordered array of step cards with title, description, ctaLabel, ctaHref, and done" },
  { name: "dismissed", type: "boolean", required: false, defaultValue: "false", description: "Whether the banner has been dismissed" },
  { name: "onDismiss", type: "() => void", required: false, description: "Called when dismiss button is clicked" },
  { name: "renderLink", type: "(href, children) => ReactNode", required: false, description: "Custom link renderer for framework routing" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

const USAGE = `import { WelcomeBanner } from "@/registry/new-york/welcome-banner/welcome-banner"
import type { WelcomeStep } from "@/registry/new-york/welcome-banner/welcome-banner"

const steps: WelcomeStep[] = [
  { title: "Set up your profile", description: "Add your name and avatar.", ctaLabel: "Edit profile", ctaHref: "/profile", done: false },
  { title: "Connect an account", description: "Link a social account.", ctaLabel: "Connect", ctaHref: "/accounts", done: false },
  { title: "Invite your team", description: "Share an invite link.", ctaLabel: "Send invites", ctaHref: "/team", done: false },
]

<WelcomeBanner
  greeting="Welcome, Alice"
  tagline="Get started by completing a few quick steps."
  steps={steps}
  onDismiss={() => localStorage.setItem("welcome", "dismissed")}
/>

{/* With Next.js Link */}
<WelcomeBanner
  greeting="Welcome, Alice"
  tagline="Get started below."
  steps={steps}
  renderLink={(href, children) => <Link href={href}>{children}</Link>}
/>`;

function InteractiveDemo({ fixture }: { fixture: Fixture }) {
  const [steps, setSteps] = useState<WelcomeStep[]>(fixture.steps);
  const [dismissed, setDismissed] = useState(fixture.dismissed ?? false);

  const toggleStep = (index: number) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, done: !s.done } : s)),
    );
  };

  return (
    <div className="w-full space-y-3">
      <WelcomeBanner
        {...fixture}
        steps={steps}
        dismissed={dismissed}
        onDismiss={() => setDismissed(true)}
      />
      {dismissed && (
        <button
          type="button"
          onClick={() => setDismissed(false)}
          className="text-xs px-3 py-1 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          Show again
        </button>
      )}
      {!dismissed && steps.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {steps.map((step, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleStep(i)}
              className="text-[10px] px-2 py-0.5 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              {step.done ? "Undo" : "Complete"} step {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const config: PreviewLabConfig<Fixture> = {
  title: "Welcome Banner",
  description:
    "First-time welcome banner with greeting, tagline, progress bar, and step cards. Tracks completion and supports dismiss.",
  tags: ["onboarding", "welcome", "banner", "progress", "steps"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => <InteractiveDemo fixture={fixture} />,
  propsMeta,
};
