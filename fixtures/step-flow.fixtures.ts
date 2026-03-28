import type { StepFlowProps } from "@/registry/step-flow";

type Fixture = Omit<StepFlowProps, "onStepChange" | "className">;

const BASE: Fixture = {
  title: "Checkout Flow",
  steps: [
    { label: "Cart", description: "Review items in your shopping cart." },
    { label: "Shipping", description: "Enter your delivery address and select a shipping method." },
    { label: "Payment", description: "Add a payment method and review the total." },
    { label: "Confirm", description: "Review your order and place it." },
  ],
  initialStep: 0,
};

const fx = (overrides: Partial<Fixture>): Fixture => ({ ...BASE, ...overrides });

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Checkout (5 steps)": fx({
    steps: [
      ...BASE.steps,
      { label: "Done", description: "Your order has been placed successfully!" },
    ],
  }),
  "Onboarding (mid-step)": fx({
    title: "Onboarding",
    initialStep: 2,
    steps: [
      { label: "Sign Up", description: "Create your account with email or OAuth." },
      { label: "Profile", description: "Set your display name and avatar." },
      { label: "Connect", description: "Link your external accounts for integrations." },
      { label: "Go", description: "You're all set — start exploring!" },
    ],
  }),
  "Minimal (no title)": {
    steps: [
      { label: "Upload", description: "Select files from your device." },
      { label: "Process", description: "Files are being analyzed." },
      { label: "Complete", description: "Processing finished." },
    ],
  },
  "Two steps": fx({
    title: "Toggle",
    steps: [
      { label: "Off", description: "Feature is disabled." },
      { label: "On", description: "Feature is enabled." },
    ],
  }),
  "Many steps": fx({
    title: "CI Pipeline",
    steps: [
      { label: "Lint", description: "Run ESLint and Prettier checks." },
      { label: "Types", description: "TypeScript compilation." },
      { label: "Unit", description: "Run unit test suite." },
      { label: "E2E", description: "End-to-end browser tests." },
      { label: "Build", description: "Production build." },
      { label: "Deploy", description: "Ship to staging." },
      { label: "Verify", description: "Smoke tests on staging." },
    ],
    initialStep: 3,
  }),
};
