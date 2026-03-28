"use client";

import type { ComponentType } from "react";
import { TerminalChrome } from "@/registry/new-york/terminal-chrome/terminal-chrome";
import { ALL_FIXTURES, type TerminalChromeFixture } from "@/fixtures/terminal-chrome.fixtures";
import { TERMINAL_COLORS } from "@/registry/new-york/terminal-lib/terminal";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "title", type: "string", required: false, description: "Window title shown next to traffic lights" },
  { name: "children", type: "ReactNode", required: true, description: "Terminal body content" },
  { name: "leftSlot", type: "ReactNode", required: false, description: "Slot rendered before the traffic lights" },
  { name: "rightSlot", type: "ReactNode", required: false, description: "Slot on right side of title bar" },
  { name: "className", type: "string", required: false, description: "Additional class names for the outer container" },
];

function renderBody(fixture: TerminalChromeFixture) {
  if (fixture.bodyLines.length === 0) {
    return (
      <p className="text-term-text-muted">
        $ <span className="border-r border-term-text-muted animate-pulse">&nbsp;</span>
      </p>
    );
  }
  return (
    <div className="space-y-1 text-term-text">
      {fixture.bodyLines.map((line, i) => (
        <p key={i} className={line.color ? TERMINAL_COLORS[line.color] : "text-term-text"}>
          {line.text}
        </p>
      ))}
    </div>
  );
}

function rightSlot(fixture: TerminalChromeFixture) {
  if (!fixture.hasRightSlot) return undefined;
  return (
    <span className="text-[10px] font-mono text-term-success px-2 py-0.5 rounded bg-term-success/10">
      running
    </span>
  );
}

/** Minimal variant — no traffic lights, title-only header. */
function TerminalChromeMinimal(fixture: TerminalChromeFixture) {
  return (
    <div className="overflow-hidden rounded-lg border border-term-border bg-term-bg">
      {fixture.title && (
        <div className="flex items-center justify-between border-b border-term-border-muted bg-term-bg-header px-3 py-1.5">
          <span className="text-xs font-medium text-term-text-muted">{fixture.title}</span>
          {rightSlot(fixture)}
        </div>
      )}
      <div className="p-4 font-mono text-[13px] leading-relaxed text-term-text">
        {renderBody(fixture)}
      </div>
    </div>
  );
}

export const config: PreviewLabConfig<TerminalChromeFixture> = {
  title: "Terminal Chrome",
  description: "macOS-style terminal window shell with traffic light buttons and optional title bar.",
  tags: ["terminal", "shell", "chrome"],
  fixtures: ALL_FIXTURES,
  render: (fixture, Variant) => {
    if (Variant) return <Variant {...fixture} />;
    return (
      <TerminalChrome title={fixture.title} rightSlot={rightSlot(fixture)}>
        {renderBody(fixture)}
      </TerminalChrome>
    );
  },
  variants: [
    { name: "macOS", component: ((f: TerminalChromeFixture) => (
      <TerminalChrome title={f.title} rightSlot={rightSlot(f)}>
        {renderBody(f)}
      </TerminalChrome>
    )) as ComponentType<TerminalChromeFixture>, description: "Default macOS-style with traffic light buttons." },
    { name: "Minimal", component: TerminalChromeMinimal as ComponentType<TerminalChromeFixture>, description: "Clean header with title only, no traffic lights." },
  ],
  propsMeta,
};
