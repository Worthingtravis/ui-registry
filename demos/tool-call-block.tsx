"use client";

import { TerminalChrome } from "@/registry/terminal-chrome";
import { ToolCallBlock } from "@/registry/tool-call-block";

export default function ToolCallBlockDemo() {
  return (
    <TerminalChrome title="tool-call-block">
      <div className="space-y-3 text-zinc-300">
        <ToolCallBlock
          toolName="search_docs"
          args={{ query: "button variants", limit: 5 }}
          result="Found 3 matching components"
          delay={0}
        />
        <ToolCallBlock
          toolName="read_file"
          args={{ path: "registry/step-flow.tsx" }}
          result="148 lines read"
          delay={300}
        />
      </div>
    </TerminalChrome>
  );
}
