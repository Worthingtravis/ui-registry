"use client";

import { TerminalDemo } from "@/registry/terminal-demo";
import { ALL_FIXTURES, type TerminalDemoFixture } from "@/fixtures/terminal-demo.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "mcpEndpoint", type: "string", required: false, defaultValue: '"https://your-app.vercel.app/api/mcp"', description: "MCP endpoint URL used in the default script" },
  { name: "script", type: "TerminalEntry[]", required: false, description: "Custom script entries (overrides default)" },
];

export const config: PreviewLabConfig<TerminalDemoFixture> = {
  title: "Terminal Demo",
  description: "Full animated terminal session with typing, tool calls, thinking indicators, memory blocks, and copyable rows.",
  tags: ["terminal", "animation", "demo", "ai"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="max-w-2xl">
      <TerminalDemo script={fixture.script} />
    </div>
  ),
  propsMeta,
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
  mcpEndpoint?: string;  // URL for default script
  script?: TerminalEntry[];  // Custom script (overrides default)
}

// Renders inside <TerminalChrome> with replay button.
// Uses computeTimings() for staggered fade-in animations.
// Supports 8 entry kinds: input, output, tool-call, phase,
// thinking, claude, ask, and memory blocks.`,
  fixtureCode: `import type { TerminalEntry } from "@/registry/terminal-demo";

export interface TerminalDemoFixture {
  script: TerminalEntry[];
}

const MCP_SETUP_SCRIPT: TerminalEntry[] = [
  { kind: "phase", label: "Setup", pauseAfter: 300 },
  { kind: "input", text: "claude mcp add ...", prompt: "$", typingMs: 1200, pauseAfter: 400 },
  { kind: "output", text: "✓ Added twitch (143 tools)", color: "green", pauseAfter: 600 },
  { kind: "tool-call", toolName: "create_poll", args: { ... }, result: "✓ Poll created", pauseAfter: 400 },
  { kind: "memory", text: "Game poll prefs saved.", pauseAfter: 0 },
];

const CODE_REVIEW_SCRIPT: TerminalEntry[] = [
  { kind: "thinking", text: "Analyzing diff...", durationMs: 1200, pauseAfter: 200 },
  { kind: "tool-call", toolName: "read_file", args: { path: "src/auth/middleware.ts" }, ... },
  { kind: "claude", text: "Two suggestions:", pauseAfter: 200 },
  { kind: "ask", question: "Want me to fix these?", options: ["Yes", "Show diff", "Skip"] },
];

export const ALL_FIXTURES: Record<string, TerminalDemoFixture> = {
  "MCP Setup + Poll": { script: MCP_SETUP_SCRIPT },
  "Code Review": { script: CODE_REVIEW_SCRIPT },
  "Deploy Pipeline": { script: DEPLOY_SCRIPT },
  "Minimal Chat": { script: MINIMAL_SCRIPT },
};`,
};
