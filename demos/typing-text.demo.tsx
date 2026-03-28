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
  sourceCode: `export interface TypingTextProps {
  text: string;
  delay: number;
  duration: number;
  className?: string;
}

export function TypingText({ text, delay, duration, className }: TypingTextProps) {
  const chars = text.length;
  const doneAt = delay + duration;

  return (
    <span className="scrollbar-none flex min-w-0 overflow-hidden"
      style={{ opacity: 0, animation: \`fade-in 0ms \${delay}ms forwards\` }}>
      <span className="inline-block whitespace-nowrap border-r-2 border-transparent"
        style={{
          width: 0,
          "--chars": \`calc(\${chars}ch + 2px)\`,
          animation: [
            \`typing \${duration}ms steps(\${chars}, end) \${delay}ms forwards\`,
            \`blink 600ms step-end \${delay}ms \${Math.ceil(duration / 600) + 2}\`,
            \`cursor-hide 0ms \${doneAt + 600}ms forwards\`,
          ].join(", "),
        }}>
        {text}
      </span>
    </span>
  );
}`,
  fixtureCode: `import type { TypingTextProps } from "@/registry/typing-text";
type Fixture = Omit<TypingTextProps, "className">;

const BASE: Fixture = { text: "npx shadcn@latest add step-flow", delay: 300, duration: 1200 };
const fx = (overrides: Partial<Fixture>): Fixture => ({ ...BASE, ...overrides });

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Install command": BASE,
  "Short text": fx({ text: "pnpm dev", delay: 200, duration: 400 }),
  "Hello world": fx({ text: "Hello, World!", delay: 200, duration: 600 }),
  "Long command": fx({ text: "curl -sL https://...", delay: 100, duration: 2000 }),
  "Fast typing": fx({ text: "npm run build", delay: 0, duration: 200 }),
};`,
};
