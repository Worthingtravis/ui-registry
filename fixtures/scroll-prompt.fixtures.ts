import type { ScrollPromptProps } from "@/registry/new-york/scroll-prompt/scroll-prompt";

export type ScrollPromptFixture = ScrollPromptProps;

const BASE: ScrollPromptFixture = {
  targetId: "scroll-demo-target",
  label: "Scroll to explore",
};

const fx = (overrides: Partial<ScrollPromptFixture>): ScrollPromptFixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, ScrollPromptFixture> = {
  "Default": BASE,
  "See more": fx({ label: "See more below" }),
  "Jump to section": fx({ label: "Jump to features", targetId: "features-section" }),
  "Back to top": fx({ label: "Back to top", targetId: "page-top" }),
  "View results": fx({ label: "View results", targetId: "results-section" }),
};
