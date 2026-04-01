import type { WelcomeBannerProps } from "@/registry/new-york/welcome-banner/welcome-banner";

export type WelcomeBannerFixture = Omit<WelcomeBannerProps, "className" | "onDismiss" | "renderLink">;
type Fixture = WelcomeBannerFixture;

const BASE: Fixture = {
  greeting: "Welcome, Alice",
  tagline: "Get started by completing a few quick steps below.",
  steps: [
    {
      title: "Set up your profile",
      description: "Add your name and avatar so others can recognize you.",
      ctaLabel: "Edit profile",
      ctaHref: "/settings/profile",
      done: false,
    },
    {
      title: "Connect an account",
      description: "Link a social account to unlock additional features.",
      ctaLabel: "Connect",
      ctaHref: "/settings/accounts",
      done: false,
    },
    {
      title: "Invite your team",
      description: "Share an invite link with your teammates to get started together.",
      ctaLabel: "Send invites",
      ctaHref: "/settings/team",
      done: false,
    },
  ],
  dismissed: false,
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "All New": BASE,

  "One Complete": fx({
    steps: [
      { ...BASE.steps[0]!, done: true },
      { ...BASE.steps[1]!, done: false },
      { ...BASE.steps[2]!, done: false },
    ],
  }),

  "Two Complete": fx({
    steps: [
      { ...BASE.steps[0]!, done: true },
      { ...BASE.steps[1]!, done: true },
      { ...BASE.steps[2]!, done: false },
    ],
  }),

  "All Complete": fx({
    greeting: "Welcome back, Alice",
    tagline: "You're all set! All onboarding steps have been completed.",
    steps: [
      { ...BASE.steps[0]!, done: true },
      { ...BASE.steps[1]!, done: true },
      { ...BASE.steps[2]!, done: true },
    ],
  }),

  "No Steps": fx({
    greeting: "Welcome to Acme",
    tagline: "Loading your getting-started guide...",
    steps: [],
  }),

  "Long Greeting": fx({
    greeting: "Welcome, Bartholomew Maximillian Thunderwood III",
    tagline: "Your account is ready. Complete the steps below to get the most out of the platform.",
    steps: [
      {
        title: "Complete your extended profile setup",
        description:
          "Fill in your bio, upload a profile photo, and set your display preferences for the best experience.",
        ctaLabel: "Start profile setup",
        ctaHref: "/settings/profile",
        done: false,
      },
      { ...BASE.steps[1]!, done: false },
      { ...BASE.steps[2]!, done: false },
    ],
  }),

  Dismissed: fx({
    dismissed: true,
  }),
};
