"use client";

import { TerminalDemo, type TerminalEntry } from "@/registry/new-york/terminal-demo/terminal-demo";
import { ALL_FIXTURES, type TerminalDemoFixture } from "@/fixtures/terminal-demo.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "mcpEndpoint", type: "string", required: false, defaultValue: '"https://your-app.vercel.app/api/mcp"', description: "MCP endpoint URL used in the default script" },
  { name: "script", type: "TerminalEntry[]", required: false, description: "Custom script entries (overrides default)" },
];

/** One mini-script per entry kind so each renders in isolation */
const ENTRY_CATALOG: Array<{ kind: string; description: string; script: TerminalEntry[] }> = [
  {
    kind: "input",
    description: "Typed command with typewriter animation",
    script: [{ kind: "input", text: "git status", prompt: "$", typingMs: 600, pauseAfter: 0 }],
  },
  {
    kind: "output",
    description: "Static colored text line",
    script: [
      { kind: "output", text: "3 files changed, 42 insertions(+)", color: "green", pauseAfter: 0 },
    ],
  },
  {
    kind: "tool-call",
    description: "MCP tool call with args and result",
    script: [
      { kind: "tool-call", toolName: "read_file", args: { path: "src/auth.ts" }, result: "234 lines read", pauseAfter: 0 },
    ],
  },
  {
    kind: "phase",
    description: "Full-width section divider",
    script: [{ kind: "phase", label: "Setup", pauseAfter: 0 }],
  },
  {
    kind: "thinking",
    description: "Animated dots that disappear after durationMs",
    script: [{ kind: "thinking", text: "Analyzing diff...", durationMs: 3000, pauseAfter: 0 }],
  },
  {
    kind: "claude",
    description: "AI response with sparkle icon",
    script: [{ kind: "claude", text: "The refresh token logic on line 42 doesn't handle clock skew.", pauseAfter: 0 }],
  },
  {
    kind: "ask",
    description: "Numbered option prompt",
    script: [{ kind: "ask", question: "How to proceed?", options: ["Apply fix", "Show diff first", "Skip"], pauseAfter: 0 }],
  },
  {
    kind: "memory",
    description: "Core memory saved indicator",
    script: [{ kind: "memory", text: "User prefers verbose error messages.", pauseAfter: 0 }],
  },
];

export const config: PreviewLabConfig<TerminalDemoFixture> = {
  title: "Terminal Demo",
  description: "Full animated terminal session with typing, tool calls, thinking indicators, memory blocks, and copyable rows.",
  tags: ["terminal", "animation", "demo", "ai"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="space-y-10">
      {/* Live demo */}
      <div className="max-w-2xl">
        <TerminalDemo script={fixture.script} />
      </div>

      {/* Entry kind catalog — live rendered */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Entry types</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Each <code className="text-primary">script</code> entry has a <code className="text-primary">kind</code>. All share <code className="text-primary">pauseAfter</code> (ms before next entry).
          </p>
        </div>
        <div className="grid gap-3">
          {ENTRY_CATALOG.map((entry) => (
            <div key={entry.kind} className="rounded-lg border border-border/40 overflow-hidden">
              <div className="flex items-baseline gap-2 px-3 py-2 bg-muted/20 border-b border-border/30">
                <code className="text-xs font-mono font-semibold text-primary">{`"${entry.kind}"`}</code>
                <span className="text-[11px] text-muted-foreground">{entry.description}</span>
              </div>
              <div className="bg-term-bg">
                <TerminalDemo script={entry.script} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  propsMeta,
};
