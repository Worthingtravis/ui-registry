"use client";

import type { ComponentType } from "react";
import { ToolCallBlock, type ToolCallBlockProps } from "@/registry/tool-call-block";
import { ToolCallBlockInline } from "@/registry/tool-call-block-inline";
import { ALL_FIXTURES } from "@/fixtures/tool-call-block.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = Omit<ToolCallBlockProps, "delay">;

const propsMeta: PropMeta[] = [
  { name: "toolName", type: "string", required: true, description: "Name of the tool being called" },
  { name: "args", type: "Record<string, string | number | boolean | string[]>", required: true, description: "Key-value argument pairs" },
  { name: "result", type: "string", required: true, description: "Result text shown at the bottom" },
  { name: "delay", type: "number", required: true, description: "Fade-in delay in ms" },
];

export const config: PreviewLabConfig<Fixture> = {
  title: "Tool Call Block",
  description: "MCP tool call display with name, arguments, and result. Shows the familiar Claude Code tool call pattern.",
  tags: ["terminal", "mcp", "ai"],
  fixtures: ALL_FIXTURES,
  render: (fixture, Variant) => {
    const Comp = Variant
      ? (props: Fixture) => <Variant {...props} />
      : (props: Fixture) => <ToolCallBlock {...props} delay={0} />;
    return (
      <div className="rounded-lg bg-term-bg p-4 font-mono text-[13px]">
        <Comp {...fixture} />
      </div>
    );
  },
  variants: [
    { name: "Block", component: ((props: Fixture) => <ToolCallBlock {...props} delay={0} />) as ComponentType<Fixture>, description: "Full block with indented args and result." },
    { name: "Inline", component: ((props: Fixture) => <ToolCallBlockInline {...props} delay={0} />) as ComponentType<Fixture>, description: "Compact single-line display." },
  ],
  propsMeta,
};
