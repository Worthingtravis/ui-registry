import type { OnboardingChecklistProps } from "@/registry/new-york/onboarding-checklist/onboarding-checklist";

export type OnboardingChecklistFixture = Omit<OnboardingChecklistProps, "className" | "onDismiss" | "renderLink">;
type Fixture = OnboardingChecklistFixture;

const BASE: Fixture = {
  title: "Getting Started",
  steps: [
    { label: "Create an account", complete: true, href: "#" },
    { label: "Set up your profile", complete: false, href: "#" },
    { label: "Connect your workspace", complete: false, href: "#" },
    { label: "Invite your team", complete: false, locked: true },
  ],
  showDismiss: true,
  dismissed: false,
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "In Progress (1/4)": BASE,

  "Halfway (2/4)": fx({
    steps: [
      { label: "Create an account", complete: true, href: "#" },
      { label: "Set up your profile", complete: true, href: "#" },
      { label: "Connect your workspace", complete: false, href: "#" },
      { label: "Invite your team", complete: false },
    ],
  }),

  "Almost Done (3/4)": fx({
    steps: [
      { label: "Create an account", complete: true, href: "#" },
      { label: "Set up your profile", complete: true, href: "#" },
      { label: "Connect your workspace", complete: true, href: "#" },
      { label: "Invite your team", complete: false, href: "#" },
    ],
  }),

  "All Complete": fx({
    steps: [
      { label: "Create an account", complete: true },
      { label: "Set up your profile", complete: true },
      { label: "Connect your workspace", complete: true },
      { label: "Invite your team", complete: true },
    ],
    completeMessage: "Setup complete! You're ready to go.",
  }),

  "Dismissed": fx({
    dismissed: true,
  }),

  "No Dismiss Button": fx({
    showDismiss: false,
  }),

  "Many Steps": fx({
    title: "Project Setup",
    steps: [
      { label: "Install dependencies", complete: true },
      { label: "Configure environment", complete: true, href: "#" },
      { label: "Set up database", complete: false, href: "#" },
      { label: "Create API keys", complete: false, href: "#" },
      { label: "Deploy to staging", complete: false, locked: true },
      { label: "Run smoke tests", complete: false, locked: true },
      { label: "Go live", complete: false, locked: true },
    ],
  }),
};
