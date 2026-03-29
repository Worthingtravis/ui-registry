import type { InfoTipProps } from "@/registry/new-york/info-tip/info-tip";

export type InfoTipFixture = Omit<InfoTipProps, "className" | "children">;
type Fixture = InfoTipFixture;

const BASE: Fixture = {
  side: "top",
  maxWidth: 256,
  iconSize: 14,
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Top (Default)": BASE,
  "Bottom": fx({ side: "bottom" }),
  "Left": fx({ side: "left" }),
  "Right": fx({ side: "right" }),
  "Wide (400px)": fx({ maxWidth: 400 }),
  "Large Icon": fx({ iconSize: 20 }),
};
