import type { ScrollPromptProps } from "@/registry/new-york/scroll-prompt/scroll-prompt";

export type ScrollPromptFixture = ScrollPromptProps;

const BASE: ScrollPromptFixture = {
  targetId: "scroll-demo-target",
  label: "Scroll to explore",
};

const fx = (overrides: Partial<ScrollPromptProps>): ScrollPromptProps => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, ScrollPromptProps> = {
  "Default": BASE,
  "Custom label": fx({ label: "See more below", targetId: "scroll-demo-target" }),
};
