import type { SectionHeadingProps } from "@/registry/new-york/section-heading/section-heading";

export type SectionHeadingFixture = Omit<SectionHeadingProps, "className" | "children">;
type Fixture = SectionHeadingFixture;

const BASE: Fixture = {
  id: "getting-started",
  as: "h2",
  scrollMargin: 96,
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "H2 (Default)": BASE,

  "H1 Large": fx({
    id: "introduction",
    as: "h1",
  }),

  "H3 Small": fx({
    id: "api-reference",
    as: "h3",
  }),

  "Custom Scroll Margin": fx({
    id: "configuration",
    scrollMargin: 64,
  }),

  "Long Title": fx({
    id: "frequently-asked-questions-and-troubleshooting-guide",
  }),
};
