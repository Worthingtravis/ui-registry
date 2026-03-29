import type { ScrollPromptProps } from "@/registry/new-york/scroll-prompt/scroll-prompt";

export type ScrollPromptFixture = ScrollPromptProps;

export const ALL_FIXTURES: Record<string, ScrollPromptFixture> = {
  "Scroll to explore": {
    targetId: "scroll-demo-target",
    label: "Scroll to explore",
  },
  "Jump to features": {
    targetId: "scroll-demo-target",
    label: "Jump to features",
  },
};
