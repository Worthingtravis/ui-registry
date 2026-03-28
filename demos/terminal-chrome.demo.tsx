"use client";

import { TerminalChrome } from "@/registry/terminal-chrome";
import { ALL_FIXTURES, type TerminalChromeFixture } from "@/fixtures/terminal-chrome.fixtures";
import { TERMINAL_COLORS } from "@/lib/terminal";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

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
          <span className="text-[10px] font-mono text-term-success px-2 py-0.5 rounded bg-term-success/10">
            running
          </span>
        ) : undefined
      }
    >
      {fixture.bodyLines.length === 0 ? (
        <p className="text-term-text-muted">
          $ <span className="border-r border-term-text-muted animate-pulse">&nbsp;</span>
        </p>
      ) : (
        <div className="space-y-1 text-term-text">
          {fixture.bodyLines.map((line, i) => (
            <p key={i} className={line.color ? TERMINAL_COLORS[line.color] : "text-term-text"}>
              {line.text}
            </p>
          ))}
        </div>
      )}
    </TerminalChrome>
  ),
  propsMeta,
};
