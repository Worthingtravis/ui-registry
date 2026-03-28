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
