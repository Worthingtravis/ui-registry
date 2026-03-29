"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { TerminalDemo, type TerminalEntry } from "@/registry/new-york/terminal-demo/terminal-demo";
import { ToolCallBlock } from "@/registry/new-york/tool-call-block/tool-call-block";
import { TERMINAL_COLORS } from "@/registry/new-york/terminal-lib/terminal";
import { ALL_FIXTURES, type TerminalDemoFixture } from "@/fixtures/terminal-demo.fixtures";
import { useCopy } from "@/registry/new-york/use-copy/use-copy";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "mcpEndpoint", type: "string", required: false, defaultValue: '"https://laughingwhales.com/api/mcp"', description: "MCP endpoint URL used in the default entries" },
  { name: "entries", type: "TerminalEntry[]", required: false, description: "Terminal entries to animate (overrides default)" },
];

// ---------------------------------------------------------------------------
// Entry catalog
// ---------------------------------------------------------------------------

const ENTRY_CATALOG: Array<{
  kind: string;
  fields: string;
  entry: TerminalEntry;
}> = [
  {
    kind: "input",
    fields: "text, prompt?, typingMs",
    entry: { kind: "input", text: "git status", prompt: "$", typingMs: 600, pauseAfter: 0 },
  },
  {
    kind: "output",
    fields: 'text, color?',
    entry: { kind: "output", text: "3 files changed, 42 insertions(+)", color: "green", pauseAfter: 0 },
  },
  {
    kind: "tool-call",
    fields: "toolName, args, result",
    entry: { kind: "tool-call", toolName: "read_file", args: { path: "src/auth.ts" }, result: "234 lines read", pauseAfter: 0 },
  },
  {
    kind: "phase",
    fields: "label",
    entry: { kind: "phase", label: "Setup", pauseAfter: 0 },
  },
  {
    kind: "thinking",
    fields: "text, durationMs",
    entry: { kind: "thinking", text: "Analyzing diff...", durationMs: 3000, pauseAfter: 0 },
  },
  {
    kind: "claude",
    fields: "text",
    entry: { kind: "claude", text: "Token refresh on line 42 doesn't handle clock skew.", pauseAfter: 0 },
  },
  {
    kind: "ask",
    fields: "question, options[]",
    entry: { kind: "ask", question: "How to proceed?", options: ["Apply fix", "Show diff first", "Skip"], pauseAfter: 0 },
  },
  {
    kind: "memory",
    fields: "text",
    entry: { kind: "memory", text: "User prefers verbose error messages.", pauseAfter: 0 },
  },
];

// ---------------------------------------------------------------------------
// Bare entry renderer — no terminal chrome, just the content
// ---------------------------------------------------------------------------

function BareEntry({ entry }: { entry: TerminalEntry }) {
  switch (entry.kind) {
    case "input":
      return (
        <div className="flex items-start gap-1 text-term-text-bright">
          <span className="shrink-0 text-term-success">{entry.prompt ?? "$"} </span>
          <span>{entry.text}</span>
        </div>
      );
    case "output":
      return <div className={TERMINAL_COLORS[entry.color ?? "zinc"] ?? "text-term-text-muted"}>{entry.text}</div>;
    case "tool-call":
      return <ToolCallBlock toolName={entry.toolName} args={entry.args} result={entry.result} delay={0} />;
    case "phase":
      return (
        <div className="flex items-center gap-2 -mx-3 px-3 py-1 bg-term-bg-header/80 border-y border-term-border-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-term-accent" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-term-text-muted">{entry.label}</span>
        </div>
      );
    case "thinking":
      return (
        <div className="flex items-center gap-2">
          <span className="flex gap-0.5">
            {[0, 1, 2].map((d) => (
              <span key={d} className="inline-block h-1 w-1 rounded-full bg-term-warning" style={{ animation: `thinking-dot 1.2s ease-in-out ${d * 200}ms infinite` }} />
            ))}
          </span>
          <span className="text-xs italic text-term-warning-muted">{entry.text}</span>
        </div>
      );
    case "claude":
      return (
        <div className="flex items-start gap-2 text-term-text">
          <span className="shrink-0 text-term-accent-muted">✦</span>
          <span>{entry.text}</span>
        </div>
      );
    case "ask":
      return (
        <div className="flex flex-col gap-1">
          {entry.options.map((opt, j) => (
            <div key={j} className="flex items-start gap-2 text-xs">
              <span className="shrink-0 rounded border border-term-text-muted bg-term-bg-muted px-1.5 py-0.5 font-mono text-term-text">{j + 1}</span>
              <span className="text-term-text">{opt}</span>
            </div>
          ))}
        </div>
      );
    case "memory":
      return (
        <div className="flex items-start gap-2 rounded-md border border-term-warning/30 bg-term-warning/5 px-3 py-2">
          <span className="shrink-0 text-sm">🧠</span>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-term-warning-muted">Core memory saved</span>
            <p className="text-xs text-term-warning">{entry.text}</p>
          </div>
        </div>
      );
  }
}

// ---------------------------------------------------------------------------
// EntryCard
// ---------------------------------------------------------------------------

function EntryCard({ kind, fields, entry }: { kind: string; fields: string; entry: TerminalEntry }) {
  const [copied, copy] = useCopy();
  const json = JSON.stringify(entry, null, 2);

  return (
    <div className="rounded-lg border border-border/40 overflow-hidden grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      {/* Left: type + code */}
      <div className="bg-code-bg px-3 py-2.5 space-y-1.5 border-b lg:border-b-0 lg:border-r border-border/30">
        <div className="flex items-center justify-between gap-2">
          <code className="text-xs font-mono text-primary font-semibold">{kind}</code>
          <button
            onClick={() => copy(json)}
            className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            aria-label="Copy entry JSON"
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          </button>
        </div>
        <p className="text-[10px] font-mono text-muted-foreground">{fields}</p>
        <pre className="text-[10px] font-mono text-code-text/70 leading-snug whitespace-pre-wrap">{json}</pre>
      </div>
      {/* Right: live render */}
      <div className="bg-term-bg p-3 font-mono text-[13px] leading-relaxed text-term-text flex items-center">
        <BareEntry entry={entry} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const USAGE = `import { TerminalDemo, type TerminalEntry } from "@/registry/new-york/terminal-demo/terminal-demo"

const entries: TerminalEntry[] = [
  { kind: "phase", label: "Deploy", pauseAfter: 300 },
  { kind: "input", text: "git push origin main", prompt: "$", typingMs: 800, pauseAfter: 400 },
  { kind: "output", text: "✓ Deployed", color: "green", pauseAfter: 0 },
]

<TerminalDemo entries={entries} />`;

export const config: PreviewLabConfig<TerminalDemoFixture> = {
  title: "Terminal Demo",
  description: "Full animated terminal session with typing, tool calls, thinking indicators, memory blocks, and copyable rows.",
  tags: ["terminal", "animation", "demo", "ai"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="space-y-10">
      <div className="max-w-2xl">
        <TerminalDemo entries={fixture.entries} />
      </div>

      <div className="space-y-3">
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
    </div>
  ),
  propsMeta,
};
