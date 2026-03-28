import type { ScrollPromptProps } from "@/registry/scroll-prompt";

const BASE: ScrollPromptProps = {
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
