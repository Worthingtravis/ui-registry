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
      <div className="rounded-lg bg-zinc-900 p-4 font-mono text-[13px]">
        <Comp {...fixture} />
      </div>
    );
  },
  variants: [
    { name: "Block", component: ((props: Fixture) => <ToolCallBlock {...props} delay={0} />) as ComponentType<Fixture>, description: "Full block with indented args and result." },
    { name: "Inline", component: ((props: Fixture) => <ToolCallBlockInline {...props} delay={0} />) as ComponentType<Fixture>, description: "Compact single-line display." },
  ],
  propsMeta,
  sourceCode: `export interface ToolCallBlockProps {
  toolName: string;
  args: Record<string, string | number | boolean | string[]>;
  result: string;
  delay: number;
}

export function ToolCallBlock({ toolName, args, result, delay }: ToolCallBlockProps) {
  return (
    <div className="rounded-md border border-zinc-700 border-l-2 border-l-[#9147ff] bg-zinc-800/50 px-3 py-2"
      style={{ opacity: 0, animation: \`fade-in 300ms \${delay}ms forwards\` }}>
      <div className="text-xs">
        <span className="text-zinc-500">\u250C</span>
        <span className="font-semibold text-[#9147ff]">{toolName}</span>
      </div>
      <div className="ml-3 border-l border-zinc-700 pl-2">
        {Object.entries(args).map(([key, value]) => (
          <div key={key} className="text-xs">
            <span className="text-zinc-500">{key}:</span> {JSON.stringify(value)}
          </div>
        ))}
      </div>
      <div className="text-xs">
        <span className="text-zinc-500">\u2514</span>
        <span className="text-green-400">{result}</span>
      </div>
    </div>
  );
}`,
};
