import { useState, useEffect, useRef, useCallback } from "react";
import { ToolCallBlock } from "./tool-call-block";

// ---------------------------------------------------------------------------
// Types — exported so consumers can define their own scenarios
// ---------------------------------------------------------------------------
export type DemoEntry =
  | { kind: "input"; text: string; prompt: ">"; typingMs: number; pauseAfter: number }
  | { kind: "tool-call"; toolName: string; args: Record<string, unknown>; result: string; pauseAfter: number }
  | { kind: "claude"; text: string; pauseAfter: number }
  | { kind: "output"; text: string; color: "green" | "zinc" | "purple"; pauseAfter: number };

export type DemoScenario = {
  id: string;
  title: string;
  category: string;
  entries: DemoEntry[];
};

// ---------------------------------------------------------------------------
// Timing
// ---------------------------------------------------------------------------
type TimedEntry = DemoEntry & { startMs: number };

function computeTimings(entries: DemoEntry[]): TimedEntry[] {
  let cursor = 0;
  return entries.map((entry) => {
    const startMs = cursor;
    if (entry.kind === "input") {
      cursor += entry.typingMs + entry.pauseAfter;
    } else {
      cursor += entry.pauseAfter;
    }
    return { ...entry, startMs };
  });
}

const colorClass: Record<string, string> = {
  green: "text-green-400",
  zinc: "text-zinc-400",
  purple: "text-[#9147ff]",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function MiniTerminalDemo({
  scenario,
  play,
}: {
  scenario: DemoScenario;
  play: boolean;
}) {
  const [sessionKey, setSessionKey] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [done, setDone] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timed = computeTimings(scenario.entries);

  // Total duration = last entry's startMs + its fade-in (300ms)
  const totalMs = timed.length > 0 ? timed[timed.length - 1].startMs + 300 : 0;

  // Trigger replay when `play` goes from false to true
  const prevPlay = useRef(false);
  useEffect(() => {
    if (play && !prevPlay.current) {
      setSessionKey((k) => k + 1);
      setHasPlayed(true);
      setDone(false);
    }
    prevPlay.current = play;
  }, [play]);

  // Mark done after all animations complete
  useEffect(() => {
    if (!hasPlayed) return;
    const timer = setTimeout(() => setDone(true), totalMs + 200);
    return () => clearTimeout(timer);
  }, [hasPlayed, sessionKey, totalMs]);

  const shouldAnimate = hasPlayed;

  // The primary prompt text — first input entry
  const promptText = scenario.entries.find((e) => e.kind === "input")?.text ?? "";

  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(promptText);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = promptText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [promptText]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group/card flex w-[340px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 text-left transition-colors hover:border-zinc-600 lg:w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-zinc-700/60 bg-zinc-800 px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500/80" />
          <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
          <span className="h-2 w-2 rounded-full bg-green-500/80" />
        </div>
        <span className="text-[11px] font-medium text-zinc-400">
          {scenario.title}
        </span>
        <span className="rounded-full bg-zinc-700/50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
          {scenario.category}
        </span>
        {/* Copy indicator */}
        <span className="relative ml-auto h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover/card:opacity-100">
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute inset-0 text-zinc-500 transition-all duration-200"
            style={{ opacity: copied ? 0 : 1, transform: copied ? "scale(0.5)" : "scale(1)" }}
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute inset-0 text-green-400 transition-all duration-300"
            style={{
              opacity: copied ? 1 : 0,
              transform: copied ? "scale(1)" : "scale(0.5)",
              strokeDasharray: 24,
              strokeDashoffset: copied ? 0 : 24,
              transitionProperty: "opacity, transform, stroke-dashoffset",
            }}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      </div>

      {/* Body — always rendered for stable height; entries fade in on play */}
      <div className="p-3 font-mono text-[12px] leading-relaxed" key={sessionKey}>
        <div className="space-y-1.5">
          {timed.map((entry, i) => {
            const isInput = entry.kind === "input";
            const dimmed = done && !isInput && !hovered;

            let entryStyle: React.CSSProperties;
            if (done) {
              entryStyle = {
                opacity: dimmed ? 0.4 : 1,
                transition: "opacity 400ms ease-out",
              };
            } else if (shouldAnimate) {
              entryStyle = { opacity: 0, animation: `fade-in 300ms ${entry.startMs}ms forwards` };
            } else {
              entryStyle = { opacity: 0 };
            }

            switch (entry.kind) {
              case "input":
                return (
                  <div
                    key={i}
                    className="flex items-start gap-1 min-w-0 text-zinc-100"
                    style={entryStyle}
                  >
                    <span className="shrink-0 select-none text-green-400">
                      {entry.prompt ?? ">"}{" "}
                    </span>
                    <span className="flex-1" style={{ wordBreak: "break-word" }}>
                      {entry.text}
                    </span>
                  </div>
                );

              case "output":
                return (
                  <div
                    key={i}
                    className={colorClass[entry.color ?? "zinc"] ?? "text-zinc-400"}
                    style={entryStyle}
                  >
                    {entry.text}
                  </div>
                );

              case "tool-call":
                return (
                  <div key={i} style={entryStyle}>
                    <ToolCallBlock
                      toolName={entry.toolName}
                      args={entry.args}
                      result={entry.result}
                      delay={0}
                    />
                  </div>
                );

              case "claude":
                return (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-zinc-300"
                    style={entryStyle}
                  >
                    <span className="shrink-0 text-[#9147ff]/60">✦</span>
                    <span>{entry.text}</span>
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    </button>
  );
}
