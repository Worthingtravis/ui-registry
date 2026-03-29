"use client";

import { TerminalDemo, type TerminalEntry } from "@/registry/new-york/terminal-demo/terminal-demo";
import { ALL_FIXTURES, type TerminalDemoFixture } from "@/fixtures/terminal-demo.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "mcpEndpoint", type: "string", required: false, defaultValue: '"https://your-app.vercel.app/api/mcp"', description: "MCP endpoint URL used in the default entries" },
  { name: "entries", type: "TerminalEntry[]", required: false, description: "Terminal entries to animate (overrides default)" },
];

/** One entry per kind so each renders in isolation */
const ENTRY_CATALOG: Array<{ kind: string; description: string; entry: TerminalEntry }> = [
  {
    kind: "input",
    description: "Typed command with typewriter animation",
    entry: { kind: "input", text: "git status", prompt: "$", typingMs: 600, pauseAfter: 0 },
  },
  {
    kind: "output",
    description: "Static colored text line",
    entry: { kind: "output", text: "3 files changed, 42 insertions(+)", color: "green", pauseAfter: 0 },
  },
  {
    kind: "tool-call",
    description: "MCP tool call with args and result",
    entry: { kind: "tool-call", toolName: "read_file", args: { path: "src/auth.ts" }, result: "234 lines read", pauseAfter: 0 },
  },
  {
    kind: "phase",
    description: "Full-width section divider",
    entry: { kind: "phase", label: "Setup", pauseAfter: 0 },
  },
  {
    kind: "thinking",
    description: "Animated dots that disappear after durationMs",
    entry: { kind: "thinking", text: "Analyzing diff...", durationMs: 3000, pauseAfter: 0 },
  },
  {
    kind: "claude",
    description: "AI response with sparkle icon",
    entry: { kind: "claude", text: "The refresh token logic on line 42 doesn't handle clock skew.", pauseAfter: 0 },
  },
  {
    kind: "ask",
    description: "Numbered option prompt",
    entry: { kind: "ask", question: "How to proceed?", options: ["Apply fix", "Show diff first", "Skip"], pauseAfter: 0 },
  },
  {
    kind: "memory",
    description: "Core memory saved indicator",
    entry: { kind: "memory", text: "User prefers verbose error messages.", pauseAfter: 0 },
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
        <TerminalDemo entries={fixture.entries} />
      </div>

      {/* Entry kind catalog — live rendered */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Entry types</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Each <code className="text-primary">entries</code> item has a <code className="text-primary">kind</code>. All share <code className="text-primary">pauseAfter</code> (ms before next entry).
          </p>
        </div>
        <div className="grid gap-3">
          {ENTRY_CATALOG.map((item) => (
            <div key={item.kind} className="rounded-lg border border-border/40 overflow-hidden">
              <div className="px-3 py-2 bg-muted/20 border-b border-border/30">
                <p className="text-[11px] text-muted-foreground mb-1.5">{item.description}</p>
                <pre className="text-[11px] font-mono text-code-text leading-relaxed whitespace-pre-wrap">{JSON.stringify(item.entry, null, 2)}</pre>
              </div>
              <div className="bg-term-bg">
                <TerminalDemo entries={[item.entry]} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  propsMeta,
};
