"use client";

import { TerminalDemo } from "@/registry/new-york/terminal-demo/terminal-demo";
import { ALL_FIXTURES, type TerminalDemoFixture } from "@/fixtures/terminal-demo.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "mcpEndpoint", type: "string", required: false, defaultValue: '"https://your-app.vercel.app/api/mcp"', description: "MCP endpoint URL used in the default script" },
  { name: "script", type: "TerminalEntry[]", required: false, description: "Custom script entries (overrides default)" },
];

const ENTRY_KINDS = [
  { kind: "input", fields: "text, prompt?, typingMs, pauseAfter", description: "User-typed command with typewriter animation" },
  { kind: "output", fields: "text, color?, pauseAfter", description: "Static text line (green, zinc, purple)" },
  { kind: "tool-call", fields: "toolName, args, result, pauseAfter", description: "MCP tool call with args and result" },
  { kind: "phase", fields: "label, pauseAfter", description: "Full-width section divider" },
  { kind: "thinking", fields: "text, durationMs, pauseAfter", description: "Animated dots that disappear after duration" },
  { kind: "claude", fields: "text, pauseAfter", description: "Claude response with sparkle icon" },
  { kind: "ask", fields: "question, options[], pauseAfter", description: "Numbered option list" },
  { kind: "memory", fields: "text, pauseAfter", description: "Core memory saved block" },
];

export const config: PreviewLabConfig<TerminalDemoFixture> = {
  title: "Terminal Demo",
  description: "Full animated terminal session with typing, tool calls, thinking indicators, memory blocks, and copyable rows.",
  tags: ["terminal", "animation", "demo", "ai"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <TerminalDemo script={fixture.script} />
      </div>

      {/* TerminalEntry type reference */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">TerminalEntry types</h3>
        <p className="text-xs text-muted-foreground">
          Each entry in the <code className="text-primary">script</code> array has a <code className="text-primary">kind</code> field that determines how it renders. All entries share <code className="text-primary">pauseAfter: number</code> (ms delay before next entry).
        </p>
        <div className="rounded-lg border border-border bg-code-bg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/20 text-left">
                <th className="px-3 py-2 font-medium text-muted-foreground">kind</th>
                <th className="px-3 py-2 font-medium text-muted-foreground">Fields</th>
                <th className="px-3 py-2 font-medium text-muted-foreground">Renders</th>
              </tr>
            </thead>
            <tbody>
              {ENTRY_KINDS.map((e) => (
                <tr key={e.kind} className="border-b border-border/10">
                  <td className="px-3 py-2 font-mono text-primary">{`"${e.kind}"`}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{e.fields}</td>
                  <td className="px-3 py-2 text-muted-foreground">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ),
  propsMeta,
};
