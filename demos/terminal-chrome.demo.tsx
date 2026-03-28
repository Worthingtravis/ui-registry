"use client";

import { TerminalChrome } from "@/registry/terminal-chrome";
import { ALL_FIXTURES, type TerminalChromeFixture } from "@/fixtures/terminal-chrome.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const colorMap: Record<string, string> = {
  green: "text-green-400",
  zinc: "text-zinc-400",
  cyan: "text-cyan-400",
  muted: "text-zinc-500",
};

const propsMeta: PropMeta[] = [
  { name: "title", type: "string", required: false, description: "Window title shown next to traffic lights" },
  { name: "children", type: "ReactNode", required: true, description: "Terminal body content" },
  { name: "rightSlot", type: "ReactNode", required: false, description: "Slot on right side of title bar" },
];

export const config: PreviewLabConfig<TerminalChromeFixture> = {
  title: "Terminal Chrome",
  description: "macOS-style terminal window shell with traffic light buttons and optional title bar.",
  tags: ["terminal", "shell", "chrome"],
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <TerminalChrome
      title={fixture.title}
      rightSlot={
        fixture.hasRightSlot ? (
          <span className="text-[10px] font-mono text-green-400 px-2 py-0.5 rounded bg-green-400/10">
            running
          </span>
        ) : undefined
      }
    >
      {fixture.bodyLines.length === 0 ? (
        <p className="text-zinc-500">
          $ <span className="border-r border-zinc-400 animate-pulse">&nbsp;</span>
        </p>
      ) : (
        <div className="space-y-1 text-zinc-300">
          {fixture.bodyLines.map((line, i) => (
            <p key={i} className={line.color ? colorMap[line.color] : "text-zinc-300"}>
              {line.text}
            </p>
          ))}
        </div>
      )}
    </TerminalChrome>
  ),
  propsMeta,
  sourceCode: `export interface TerminalChromeProps {
  title?: string;
  children: ReactNode;
  rightSlot?: ReactNode;
}

export function TerminalChrome({ title, children, rightSlot }: TerminalChromeProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-700/60 bg-zinc-800 px-3 py-1.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
          {title && <span className="text-xs font-medium text-zinc-400">{title}</span>}
        </div>
        {rightSlot}
      </div>
      <div className="p-4 font-mono text-[13px] leading-relaxed">{children}</div>
    </div>
  );
}`,
};
