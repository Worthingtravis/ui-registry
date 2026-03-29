"use client";

import { ScrollPrompt } from "@/registry/new-york/scroll-prompt/scroll-prompt";
import { ALL_FIXTURES, type ScrollPromptFixture } from "@/fixtures/scroll-prompt.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "targetId", type: "string", required: true, description: "DOM id of the element to observe" },
  { name: "label", type: "string", required: true, description: "Label text shown above the arrow" },
];

export const config: PreviewLabConfig<ScrollPromptFixture> = {
  title: "Scroll Prompt",
  description: "Animated scroll-down prompt that appears when a target section is out of view.",
  tags: ["animation", "scroll", "navigation"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="space-y-6">
      {/* The prompt — visible because target is far below viewport */}
      <div className="sticky top-4 z-10 flex justify-center">
        <ScrollPrompt {...fixture} />
      </div>

      {/* Spacer content to push target off-screen */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-md border border-border/20 bg-muted/10 p-4">
            <div className="h-2 w-3/4 rounded bg-muted/30" />
            <div className="mt-2 h-2 w-1/2 rounded bg-muted/20" />
          </div>
        ))}
      </div>

      {/* Target — scroll here to dismiss the prompt */}
      <div id={fixture.targetId} className="rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
        <p className="text-sm font-medium text-primary/80">
          Target section — prompt disappears when this is in view
        </p>
      </div>
    </div>
  ),
  propsMeta,
};
