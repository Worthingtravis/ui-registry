import type { FeaturePillProps } from "@/registry/new-york/feature-pill/feature-pill";

export type FeaturePillFixture = Omit<FeaturePillProps, "className" | "renderLink">;
type Fixture = FeaturePillFixture;

const BASE: Fixture = {
  label: "Feature",
  variant: "default",
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Default": BASE,
  "Primary": fx({ label: "New", variant: "primary" }),
  "Success": fx({ label: "Stable", variant: "success" }),
  "Destructive": fx({ label: "Deprecated", variant: "destructive" }),
  "Outline": fx({ label: "Beta", variant: "outline" }),
  "With Link": fx({ label: "Documentation", href: "#" }),
  "Primary Link": fx({ label: "Get Started", variant: "primary", href: "#" }),
};
