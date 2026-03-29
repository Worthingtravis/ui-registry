"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { TerminalDemo, type TerminalEntry } from "@/registry/new-york/terminal-demo/terminal-demo";
import { ALL_FIXTURES, type TerminalDemoFixture } from "@/fixtures/terminal-demo.fixtures";
import { useCopy } from "@/registry/new-york/use-copy/use-copy";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "mcpEndpoint", type: "string", required: false, defaultValue: '"https://your-app.vercel.app/api/mcp"', description: "MCP endpoint URL used in the default entries" },
  { name: "entries", type: "TerminalEntry[]", required: false, description: "Terminal entries to animate (overrides default)" },
];

// ---------------------------------------------------------------------------
// Entry catalog data
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// EntryCard — type signature + copy button + live render
// ---------------------------------------------------------------------------

function EntryCard({ kind, fields, entry }: { kind: string; fields: string; entry: TerminalEntry }) {
  const [copied, copy] = useCopy();
  const json = JSON.stringify(entry, null, 2);

  return (
    <div className="rounded-lg border border-border/40 overflow-hidden">
      {/* Type + copy */}
      <div className="flex items-start justify-between gap-2 px-3 py-2 bg-muted/20 border-b border-border/30">
        <div className="min-w-0">
          <code className="text-xs font-mono">
            <span className="text-primary font-semibold">kind: {kind}</span>
          </code>
          <code className="block text-[11px] font-mono text-muted-foreground mt-0.5">
            {fields}
          </code>
        </div>
        <button
          onClick={() => copy(json)}
          className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label="Copy entry JSON"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        </button>
      </div>
      {/* Live render */}
      <div className="bg-term-bg">
        <TerminalDemo entries={[entry]} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export const config: PreviewLabConfig<TerminalDemoFixture> = {
  title: "Terminal Demo",
  description: "Full animated terminal session with typing, tool calls, thinking indicators, memory blocks, and copyable rows.",
  tags: ["terminal", "animation", "demo", "ai"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="space-y-10">
      {/* Desktop: examples right, catalog left. Mobile: stacked */}
      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        {/* Entry type catalog */}
        <div className="space-y-3 order-2 lg:order-1">
          <div>
            <h3 className="text-sm font-semibold">TerminalEntry variants</h3>
            <p className="text-xs text-muted-foreground mt-1">
              <code className="text-primary">entries</code> is an array. Each item picks a <code className="text-primary">kind</code>.
            </p>
          </div>
          <div className="grid gap-2">
            {ENTRY_CATALOG.map((item) => (
              <EntryCard key={item.kind} {...item} />
            ))}
          </div>
        </div>

        {/* Live example */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-4 lg:self-start">
          <TerminalDemo entries={fixture.entries} />
        </div>
      </div>
    </div>
  ),
  propsMeta,
};
