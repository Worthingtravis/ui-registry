import type { CollapsibleGroupProps } from "@/registry/new-york/collapsible-group/collapsible-group";

export type CollapsibleGroupFixture = Omit<CollapsibleGroupProps, "className" | "onToggle" | "children">;
type Fixture = CollapsibleGroupFixture;

const BASE: Fixture = {
  label: "Advanced Settings",
  open: true,
  active: false,
  dimmed: false,
  duration: 200,
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Open": BASE,

  "Closed": fx({
    label: "Click to expand",
    open: false,
  }),

  "Active": fx({
    label: "Currently Selected",
    active: true,
  }),

  "Dimmed": fx({
    label: "Disabled Section",
    dimmed: true,
  }),

  "Closed + Active": fx({
    label: "Active but collapsed",
    open: false,
    active: true,
  }),

  "Slow Animation": fx({
    label: "Slow expand (500ms)",
    duration: 500,
  }),
};
