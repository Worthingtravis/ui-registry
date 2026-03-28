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
};
