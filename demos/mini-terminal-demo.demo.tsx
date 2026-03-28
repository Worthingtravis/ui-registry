"use client";

import { MiniTerminalDemo } from "@/registry/mini-terminal-demo";
import { ALL_FIXTURES, type MiniTerminalDemoFixture } from "@/fixtures/mini-terminal-demo.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "scenario", type: "DemoScenario", required: true, description: "The scenario data to render" },
  { name: "play", type: "boolean", required: true, description: "Whether to start/restart the animation" },
  { name: "playDelay", type: "number", required: false, defaultValue: "0", description: "Delay in ms before animation starts" },
  { name: "isPinned", type: "boolean", required: false, defaultValue: "false", description: "Whether this card is pinned" },
  { name: "onTogglePin", type: "() => void", required: false, description: "Callback to toggle pin state" },
];

export const config: PreviewLabConfig<MiniTerminalDemoFixture> = {
  title: "Mini Terminal Demo",
  description: "Compact animated terminal card with copy-to-clipboard, pin support, and stagger delay.",
  tags: ["terminal", "animation", "demo"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="max-w-lg">
      <MiniTerminalDemo
        scenario={fixture.scenario}
        play={fixture.play}
        playDelay={fixture.playDelay}
      />
    </div>
  ),
  propsMeta,
  fixtureCode: `import type { DemoScenario } from "@/registry/mini-terminal-demo";

export interface MiniTerminalDemoFixture {
  scenario: DemoScenario;
  play: boolean;
  playDelay?: number;
}

const BASE_SCENARIO: DemoScenario = {
  id: "install", title: "Install component", category: "setup",
  entries: [
    { kind: "input", text: "npx shadcn@latest add step-flow", prompt: ">", typingMs: 1000, pauseAfter: 400 },
    { kind: "output", text: "Installing step-flow...", color: "zinc", pauseAfter: 300 },
    { kind: "output", text: "Created registry/step-flow.tsx", color: "green", pauseAfter: 200 },
  ],
};

const BASE: MiniTerminalDemoFixture = { scenario: BASE_SCENARIO, play: true, playDelay: 0 };
const fx = (o: Partial<MiniTerminalDemoFixture>) => ({ ...BASE, ...o });

export const ALL_FIXTURES: Record<string, MiniTerminalDemoFixture> = {
  "Install flow": BASE,
  "Deploy flow": fx({ scenario: { id: "deploy", title: "Deploy", ... } }),
  "With tool call": fx({ scenario: { id: "tool-call", title: "MCP", ... } }),
};`,
  sourceCode: `export type DemoEntry =
  | { kind: "input"; text: string; prompt: ">"; typingMs: number; pauseAfter: number }
  | { kind: "tool-call"; toolName: string; args: Record<...>; result: string; pauseAfter: number }
  | { kind: "claude"; text: string; pauseAfter: number }
  | { kind: "output"; text: string; color: "green" | "zinc" | "purple"; pauseAfter: number };

export type DemoScenario = {
  id: string; title: string; category: string; entries: DemoEntry[];
};

export interface MiniTerminalDemoProps {
  scenario: DemoScenario;
  play: boolean;
  playDelay?: number;
  isPinned?: boolean;
  onTogglePin?: () => void;
}

export function MiniTerminalDemo({ scenario, play, playDelay, isPinned, onTogglePin }: MiniTerminalDemoProps) {
  // Animated terminal card with typing, tool calls, pin/copy support
  // Uses computeTimings() from lib/terminal.ts for staggered fade-ins
}`,
};
