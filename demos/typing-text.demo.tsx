"use client";

import { TypingText, type TypingTextProps } from "@/registry/typing-text";
import { ALL_FIXTURES } from "@/fixtures/typing-text.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "text", type: "string", required: true, description: "The text string to type out" },
  { name: "delay", type: "number", required: true, description: "Delay in ms before typing starts" },
  { name: "duration", type: "number", required: true, description: "Duration in ms for typing animation" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

export const config: PreviewLabConfig<Omit<TypingTextProps, "className">> = {
  title: "Typing Text",
  description: "CSS-only typewriter animation with blinking cursor. Uses CSS keyframes — no JS animation loop.",
  tags: ["animation", "text", "typewriter"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="rounded-lg bg-zinc-900 p-6 font-mono text-[13px] text-zinc-300">
      <div className="flex items-start gap-2">
        <span className="text-green-400 shrink-0">$</span>
        <TypingText {...fixture} />
      </div>
    </div>
  ),
  propsMeta,
};
