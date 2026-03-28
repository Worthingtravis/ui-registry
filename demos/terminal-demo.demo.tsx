"use client";

import { TerminalDemo, type TerminalDemoProps } from "@/registry/terminal-demo";
import { ALL_FIXTURES } from "@/fixtures/terminal-demo.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "mcpEndpoint", type: "string", required: false, defaultValue: '"https://your-app.vercel.app/api/mcp"', description: "MCP endpoint URL used in the default script" },
  { name: "script", type: "TerminalEntry[]", required: false, description: "Custom script entries (overrides default)" },
];

export const config: PreviewLabConfig<TerminalDemoProps> = {
  title: "Terminal Demo",
  description: "Full animated terminal session with typing, tool calls, thinking indicators, memory blocks, and copyable rows.",
  tags: ["terminal", "animation", "demo", "ai"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="max-w-2xl">
      <TerminalDemo {...fixture} />
    </div>
  ),
  propsMeta,
  fixtureCode: `import type { TerminalDemoProps } from "@/registry/terminal-demo";

const BASE: TerminalDemoProps = {
  mcpEndpoint: "https://your-app.vercel.app/api/mcp",
};

const fx = (o: Partial<TerminalDemoProps>) => ({ ...BASE, ...o });

export const ALL_FIXTURES: Record<string, TerminalDemoProps> = {
  "Default script": BASE,
  "Custom endpoint": fx({ mcpEndpoint: "https://twitch-mcp.example.com/api/mcp" }),
};`,
  sourceCode: `export type TerminalEntry =
  | { kind: "input"; text: string; prompt?: string; typingMs: number; pauseAfter: number }
  | { kind: "output"; text: string; color?: "green" | "zinc" | "purple"; pauseAfter: number }
  | { kind: "tool-call"; toolName: string; args: Record<...>; result: string; pauseAfter: number }
  | { kind: "phase"; label: string; pauseAfter: number }
  | { kind: "thinking"; text: string; durationMs: number; pauseAfter: number }
  | { kind: "claude"; text: string; pauseAfter: number }
  | { kind: "ask"; question: string; options: string[]; pauseAfter: number }
  | { kind: "memory"; text: string; pauseAfter: number };

export interface TerminalDemoProps {
  mcpEndpoint?: string;
  script?: TerminalEntry[];
}

export function TerminalDemo({ mcpEndpoint, script }: TerminalDemoProps) {
  // Full animated terminal with TerminalChrome wrapper, TypingText,
  // ToolCallBlock, CopyableRow, thinking dots, memory blocks.
  // Uses computeTimings() and TERMINAL_COLORS from lib/terminal.ts
}`,
};
