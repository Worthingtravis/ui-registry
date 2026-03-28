"use client";

import { ToolCallBlock, type ToolCallBlockProps } from "@/registry/tool-call-block";
import { ALL_FIXTURES } from "@/fixtures/tool-call-block.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "toolName", type: "string", required: true, description: "Name of the tool being called" },
  { name: "args", type: "Record<string, string | number | boolean | string[]>", required: true, description: "Key-value argument pairs" },
  { name: "result", type: "string", required: true, description: "Result text shown at the bottom" },
  { name: "delay", type: "number", required: true, description: "Fade-in delay in ms" },
];

export const config: PreviewLabConfig<Omit<ToolCallBlockProps, "delay">> = {
  title: "Tool Call Block",
  description: "MCP tool call display with name, arguments, and result. Shows the familiar Claude Code tool call pattern.",
  tags: ["terminal", "mcp", "ai"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="rounded-lg bg-zinc-900 p-4 font-mono text-[13px]">
      <ToolCallBlock {...fixture} delay={0} />
    </div>
  ),
  propsMeta,
};
