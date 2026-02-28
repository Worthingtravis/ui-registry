"use client";

import { useState } from "react";
import { TerminalChrome } from "./terminal-chrome";
import { TypingText } from "./typing-text";
import { ToolCallBlock } from "./tool-call-block";
import { CopyableRow } from "./copyable-row";

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------
export type TerminalEntry =
  | { kind: "input"; text: string; prompt?: string; typingMs: number; pauseAfter: number }
  | { kind: "output"; text: string; color?: "green" | "zinc" | "purple"; pauseAfter: number }
  | { kind: "tool-call"; toolName: string; args: Record<string, unknown>; result: string; pauseAfter: number }
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
  { kind: "input", text: `claude mcp add --transport http twitch ${mcpEndpoint}`, prompt: "$", typingMs: 1200, pauseAfter: 400 },
  { kind: "output", text: "✓ Added twitch (143 tools)", color: "green", pauseAfter: 600 },
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
// Compute cumulative start times
// ---------------------------------------------------------------------------
type TimedEntry = TerminalEntry & { startMs: number };

function computeTimings(entries: TerminalEntry[]): TimedEntry[] {
  let cursor = 0;
  return entries.map((entry) => {
    const startMs = cursor;
    if (entry.kind === "input") {
      cursor += entry.typingMs + entry.pauseAfter;
    } else if (entry.kind === "thinking") {
      cursor += entry.durationMs + entry.pauseAfter;
    } else {
      cursor += entry.pauseAfter;
    }
    return { ...entry, startMs };
  });
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------
const colorClass: Record<string, string> = {
  green: "text-green-400",
  zinc: "text-zinc-400",
  purple: "text-[#9147ff]",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function TerminalDemo({
  mcpEndpoint = "https://your-app.vercel.app/api/mcp",
  script,
}: {
  mcpEndpoint?: string;
  script?: TerminalEntry[];
}) {
  const [sessionKey, setSessionKey] = useState(0);
  const timed = computeTimings(script ?? buildScript(mcpEndpoint));

  return (
    <TerminalChrome
      title="Claude Code"
      rightSlot={
        <button
          type="button"
          onClick={() => setSessionKey((k) => k + 1)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-zinc-400 transition hover:bg-white/10 hover:text-zinc-200"
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
                  className="items-center text-zinc-100"
                  style={{
                    opacity: 0,
                    animation: `fade-in 100ms ${entry.startMs}ms forwards`,
                  }}
                >
                  <span className="shrink-0 select-none text-green-400">
                    {entry.prompt ?? "$"}{" "}
                  </span>
                  <TypingText
                    text={entry.text}
                    delay={entry.startMs}
                    duration={entry.typingMs}
                    className="text-zinc-100"
                  />
                </CopyableRow>
              );

            case "output":
              return (
                <div
                  key={i}
                  className={colorClass[entry.color ?? "zinc"] ?? "text-zinc-400"}
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
                  className="flex items-start gap-2 text-zinc-300"
                  style={{
                    opacity: 0,
                    animation: `fade-in 300ms ${entry.startMs}ms forwards`,
                  }}
                >
                  <span className="shrink-0 text-[#9147ff]/60">✦</span>
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
      className={`-mx-4 flex items-center gap-2.5 border-b border-zinc-700/60 bg-zinc-800/80 px-4 py-1.5 ${first ? "-mt-4" : "mt-2 border-t"}`}
      style={{
        opacity: 0,
        animation: `fade-in 300ms ${startMs}ms forwards`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#9147ff]" />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
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
          <span className="mt-px shrink-0 rounded border border-zinc-500 bg-zinc-700/20 px-1.5 py-0.5 font-mono text-zinc-300">
            {j + 1}
          </span>
          <span className="text-zinc-300">{opt}</span>
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
      className="flex items-start gap-2 rounded-md border border-orange-500/30 bg-orange-500/5 px-3 py-2"
      style={{
        opacity: 0,
        animation: `fade-in 300ms ${startMs}ms forwards`,
      }}
    >
      <span className="shrink-0 text-sm">🧠</span>
      <div className="min-w-0">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-400/70">
          Core memory saved
        </span>
        <p className="text-xs text-orange-300/90">{text}</p>
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
            className="inline-block h-1 w-1 rounded-full bg-orange-400"
            style={{
              animation: `thinking-dot 1.2s ease-in-out ${dot * 200}ms infinite`,
            }}
          />
        ))}
      </span>
      <span className="text-xs italic text-orange-400/80">{text}</span>
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
