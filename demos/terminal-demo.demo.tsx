"use client";

import { TerminalDemo, type TerminalEntry } from "@/registry/new-york/terminal-demo/terminal-demo";
import { ALL_FIXTURES, type TerminalDemoFixture } from "@/fixtures/terminal-demo.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "mcpEndpoint", type: "string", required: false, defaultValue: '"https://your-app.vercel.app/api/mcp"', description: "MCP endpoint URL used in the default entries" },
  { name: "entries", type: "TerminalEntry[]", required: false, description: "Terminal entries to animate (overrides default)" },
];

/**
 * One entry per kind. The `fields` string shows the type signature —
 * what you pass when you pick this kind.
 */
const ENTRY_CATALOG: Array<{
  kind: string;
  fields: string;
  entry: TerminalEntry;
}> = [
  {
    kind: "input",
    fields: "text: string, prompt?: string, typingMs: number",
    entry: { kind: "input", text: "git status", prompt: "$", typingMs: 600, pauseAfter: 0 },
  },
  {
    kind: "output",
    fields: 'text: string, color?: "green" | "zinc" | "purple"',
    entry: { kind: "output", text: "3 files changed, 42 insertions(+)", color: "green", pauseAfter: 0 },
  },
  {
    kind: "tool-call",
    fields: "toolName: string, args: Record<string, ...>, result: string",
    entry: { kind: "tool-call", toolName: "read_file", args: { path: "src/auth.ts" }, result: "234 lines read", pauseAfter: 0 },
  },
  {
    kind: "phase",
    fields: "label: string",
    entry: { kind: "phase", label: "Setup", pauseAfter: 0 },
  },
  {
    kind: "thinking",
    fields: "text: string, durationMs: number",
    entry: { kind: "thinking", text: "Analyzing diff...", durationMs: 3000, pauseAfter: 0 },
  },
  {
    kind: "claude",
    fields: "text: string",
    entry: { kind: "claude", text: "The refresh token logic on line 42 doesn't handle clock skew.", pauseAfter: 0 },
  },
  {
    kind: "ask",
    fields: "question: string, options: string[]",
    entry: { kind: "ask", question: "How to proceed?", options: ["Apply fix", "Show diff first", "Skip"], pauseAfter: 0 },
  },
  {
    kind: "memory",
    fields: "text: string",
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
      <div className="max-w-2xl">
        <TerminalDemo entries={fixture.entries} />
      </div>

      {/* Type catalog */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold">TerminalEntry variants</h3>
          <p className="text-xs text-muted-foreground mt-1">
            <code className="text-primary">entries</code> is an array. Each item picks a <code className="text-primary">kind</code> — the kind determines which fields are available.
          </p>
        </div>
        <div className="grid gap-2">
          {ENTRY_CATALOG.map((item) => (
            <div key={item.kind} className="rounded-lg border border-border/40 overflow-hidden grid sm:grid-cols-[1fr_1fr]">
              {/* Type signature */}
              <div className="px-3 py-2.5 bg-muted/20 border-b sm:border-b-0 sm:border-r border-border/30 flex flex-col justify-center">
                <code className="text-xs font-mono">
                  <span className="text-primary font-semibold">kind: {item.kind}</span>
                </code>
                <code className="text-[11px] font-mono text-muted-foreground mt-0.5">
                  {item.fields}
                </code>
              </div>
              {/* Live render */}
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
