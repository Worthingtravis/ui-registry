"use client";

import { ScrollPrompt, type ScrollPromptProps } from "@/registry/scroll-prompt";
import { ALL_FIXTURES } from "@/fixtures/scroll-prompt.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "targetId", type: "string", required: true, description: "DOM id of the element to observe" },
  { name: "label", type: "string", required: true, description: "Label text shown above the arrow" },
];

export const config: PreviewLabConfig<ScrollPromptProps> = {
  title: "Scroll Prompt",
  description: "Animated scroll-down prompt that appears when a target section is out of view.",
  tags: ["animation", "scroll", "navigation"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="space-y-6">
      <div className="rounded-lg border border-border/40 bg-muted/40 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          The scroll prompt tracks whether a target element is in view.
          In a real page it appears when the target scrolls out of the viewport.
        </p>
      </div>
      <div className="flex justify-center">
        <ScrollPrompt {...fixture} />
      </div>
      <div id={fixture.targetId} className="rounded-lg border border-border/40 bg-muted/50 p-4 text-center">
        <p className="text-xs text-muted-foreground/70">Target section</p>
      </div>
    </div>
  ),
  propsMeta,
};
