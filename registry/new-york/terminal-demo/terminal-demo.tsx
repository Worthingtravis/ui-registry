"use client";

import { useState } from "react";
import { TerminalChrome } from "@/registry/new-york/terminal-chrome/terminal-chrome";
import { TypingText } from "@/registry/new-york/typing-text/typing-text";
import { ToolCallBlock } from "@/registry/new-york/tool-call-block/tool-call-block";
import { CopyableRow } from "@/registry/new-york/copyable-row/copyable-row";
import { computeTimings, TERMINAL_COLORS } from "@/registry/new-york/terminal-lib/terminal";

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------
export type TerminalEntry =
  | { kind: "input"; text: string; prompt?: string; typingMs: number; pauseAfter: number }
  | { kind: "output"; text: string; color?: "green" | "zinc" | "purple"; pauseAfter: number }
  | { kind: "tool-call"; toolName: string; args: Record<string, string | number | boolean | string[]>; result: string; pauseAfter: number }
  | { kind: "phase"; label: string; pauseAfter: number }
  | { kind: "thinking"; text: string; durationMs: number; pauseAfter: number }
  | { kind: "claude"; text: string; pauseAfter: number }
  | { kind: "ask"; question: string; options: string[]; pauseAfter: number }
  | { kind: "memory"; text: string; pauseAfter: number };

// ---------------------------------------------------------------------------
// Demo script
// ---------------------------------------------------------------------------
export function buildScript(mcpEndpoint: string): TerminalEntry[] {
  return [
  // Setup
  { kind: "phase", label: "Setup", pauseAfter: 300 },
  { kind: "input", text: `claude mcp add --transport http laughingwhales ${mcpEndpoint}`, prompt: "$", typingMs: 1200, pauseAfter: 400 },
  { kind: "output", text: "✓ Added laughingwhales (143 tools)", color: "green", pauseAfter: 600 },
  { kind: "input", text: "/mcp", prompt: "$", typingMs: 400, pauseAfter: 400 },
  { kind: "output", text: "✓ Connected as @your_channel", color: "green", pauseAfter: 600 },

  // Use it
  { kind: "phase", label: "Stream", pauseAfter: 300 },
  { kind: "input", text: "add a poll, what game should I play? Elden Ring, Minecraft, and always include Viewer's Choice", prompt: ">", typingMs: 1400, pauseAfter: 200 },
  {
    kind: "tool-call",
    toolName: "create_poll",
    args: {
      title: "What game should I play next?",
      choices: ["Elden Ring", "Minecraft", "Viewer's Choice"],
      duration: 60,
    },
    result: "✓ Poll created — 60s, 3 choices",
    pauseAfter: 400,
  },
  { kind: "memory", text: "Game poll prefs: Elden Ring, Minecraft, always Viewer's Choice.", pauseAfter: 0 },
];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface TerminalDemoProps {
  /** MCP endpoint URL used in the default script */
  mcpEndpoint?: string;
  /** Terminal entries to animate (overrides default) */
  entries?: TerminalEntry[];
}

export function TerminalDemo({
  mcpEndpoint = "https://laughingwhales.com/api/mcp",
  entries,
}: TerminalDemoProps) {
  const [sessionKey, setSessionKey] = useState(0);
  const timed = computeTimings(entries ?? buildScript(mcpEndpoint));

  return (
    <TerminalChrome
      title="Claude Code"
      rightSlot={
        <button
          type="button"
          onClick={() => setSessionKey((k) => k + 1)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-term-text-muted transition hover:bg-term-bg-muted hover:text-term-text"
        >
          <ReplayIcon />
          Replay
        </button>
      }
    >
      <div key={sessionKey} className="space-y-1.5">
        {timed.map((entry, i) => {
          switch (entry.kind) {
            case "phase":
              return (
                <PhaseLabel key={i} label={entry.label} startMs={entry.startMs} first={i === 0} />
              );

            case "input":
              return (
                <CopyableRow
                  key={i}
                  text={entry.text}
                  className="items-center text-term-text-bright"
                  style={{
                    opacity: 0,
                    animation: `fade-in 100ms ${entry.startMs}ms forwards`,
                  }}
                >
                  <span className="shrink-0 select-none text-term-success">
                    {entry.prompt ?? "$"}{" "}
                  </span>
                  <TypingText
                    text={entry.text}
                    delay={entry.startMs}
                    duration={entry.typingMs}
                    className="text-term-text-bright"
                  />
                </CopyableRow>
              );

            case "output":
              return (
                <div
                  key={i}
                  className={TERMINAL_COLORS[entry.color ?? "zinc"] ?? "text-term-text-muted"}
                  style={{
                    opacity: 0,
                    animation: `fade-in 300ms ${entry.startMs}ms forwards`,
                  }}
                >
                  {entry.text}
                </div>
              );

            case "tool-call":
              return (
                <ToolCallBlock
                  key={i}
                  toolName={entry.toolName}
                  args={entry.args}
                  result={entry.result}
                  delay={entry.startMs}
                />
              );

            case "thinking":
              return (
                <ThinkingBlock
                  key={i}
                  text={entry.text}
                  startMs={entry.startMs}
                  durationMs={entry.durationMs}
                />
              );

            case "claude":
              return (
                <div
                  key={i}
                  className="flex items-start gap-2 text-term-text"
                  style={{
                    opacity: 0,
                    animation: `fade-in 300ms ${entry.startMs}ms forwards`,
                  }}
                >
                  <span className="shrink-0 text-term-accent-muted">✦</span>
                  <span>{entry.text}</span>
                </div>
              );

            case "ask":
              return (
                <AskBlock
                  key={i}
                  options={entry.options}
                  startMs={entry.startMs}
                />
              );

            case "memory":
              return (
                <MemoryBlock
                  key={i}
                  text={entry.text}
                  startMs={entry.startMs}
                />
              );

            default:
              return null;
          }
        })}
      </div>
    </TerminalChrome>
  );
}

// ---------------------------------------------------------------------------
// Phase label — full-width divider that breaks out of body padding
// ---------------------------------------------------------------------------
function PhaseLabel({
  label,
  startMs,
  first,
}: {
  label: string;
  startMs: number;
  first: boolean;
}) {
  return (
    <div
      className={`-mx-4 flex items-center gap-2.5 border-b border-term-border-muted bg-term-bg-header/80 px-4 py-1.5 ${first ? "-mt-4" : "mt-2 border-t"}`}
      style={{
        opacity: 0,
        animation: `fade-in 300ms ${startMs}ms forwards`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-term-accent" />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-term-text-muted">
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ask block — Claude presents options
// ---------------------------------------------------------------------------
function AskBlock({
  options,
  startMs,
}: {
  options: string[];
  startMs: number;
}) {
  return (
    <div
      className="flex flex-col gap-1 pl-1"
      style={{
        opacity: 0,
        animation: `fade-in 300ms ${startMs}ms forwards`,
      }}
    >
      {options.map((opt, j) => (
        <div key={j} className="flex items-start gap-2 text-xs">
          <span className="mt-px shrink-0 rounded border border-term-text-muted bg-term-bg-muted px-1.5 py-0.5 font-mono text-term-text">
            {j + 1}
          </span>
          <span className="text-term-text">{opt}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Memory block — core memory saved
// ---------------------------------------------------------------------------
function MemoryBlock({
  text,
  startMs,
}: {
  text: string;
  startMs: number;
}) {
  return (
    <div
      className="flex items-start gap-2 rounded-md border border-term-warning/30 bg-term-warning/5 px-3 py-2"
      style={{
        opacity: 0,
        animation: `fade-in 300ms ${startMs}ms forwards`,
      }}
    >
      <span className="shrink-0 text-sm">🧠</span>
      <div className="min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-term-warning-muted">
          Core memory saved
        </span>
        <p className="text-xs text-term-warning">{text}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Thinking block — animated dots in orange
// ---------------------------------------------------------------------------
function ThinkingBlock({
  text,
  startMs,
  durationMs,
}: {
  text: string;
  startMs: number;
  durationMs: number;
}) {
  return (
    <div
      className="flex items-center gap-2 py-0.5"
      style={{
        opacity: 0,
        animation: [
          `fade-in 200ms ${startMs}ms forwards`,
          `thinking-hide 0ms ${startMs + durationMs}ms forwards`,
        ].join(", "),
      }}
    >
      <span className="flex gap-0.5">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="inline-block h-1 w-1 rounded-full bg-term-warning"
            style={{
              animation: `thinking-dot 1.2s ease-in-out ${dot * 200}ms infinite`,
            }}
          />
        ))}
      </span>
      <span className="text-xs italic text-term-warning-muted">{text}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Replay icon
// ---------------------------------------------------------------------------
function ReplayIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}
