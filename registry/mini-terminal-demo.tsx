"use client";

import { useState, useEffect, useRef } from "react";
import { ToolCallBlock } from "./tool-call-block";
import { computeTimings, TERMINAL_COLORS } from "@/lib/terminal";
import { useCopy } from "@/lib/use-copy";

// ---------------------------------------------------------------------------
// Types — exported so consumers can define their own scenarios
// ---------------------------------------------------------------------------
export type DemoEntry =
  | { kind: "input"; text: string; prompt: ">"; typingMs: number; pauseAfter: number }
  | { kind: "tool-call"; toolName: string; args: Record<string, string | number | boolean | string[]>; result: string; pauseAfter: number }
  | { kind: "claude"; text: string; pauseAfter: number }
  | { kind: "output"; text: string; color: "green" | "zinc" | "purple"; pauseAfter: number };

export type DemoScenario = {
  id: string;
  title: string;
  category: string;
  streamCategory?: string;
  entries: DemoEntry[];
};

// ---------------------------------------------------------------------------
// Pin icons (11x11, matching existing icon style)
// ---------------------------------------------------------------------------
function PinOutlineIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 17v5" />
      <path d="M9 2h6l-1 7h4l-5 6H7l2-6H5l1-7z" />
    </svg>
  );
}

function PinFilledIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 17v5" />
      <path d="M9 2h6l-1 7h4l-5 6H7l2-6H5l1-7z" />
    </svg>
  );
}

function UnpinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface MiniTerminalDemoProps {
  /** The scenario data to render */
  scenario: DemoScenario;
  /** Whether to start/restart the animation */
  play: boolean;
  /** Delay in ms before animation starts */
  playDelay?: number;
  /** Whether this card is pinned */
  isPinned?: boolean;
  /** Callback to toggle pin state */
  onTogglePin?: () => void;
}

export function MiniTerminalDemo({
  scenario,
  play,
  playDelay = 0,
  isPinned = false,
  onTogglePin,
}: MiniTerminalDemoProps) {
  const [sessionKey, setSessionKey] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [done, setDone] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timed = computeTimings(scenario.entries);

  // Total duration = last entry's startMs + its fade-in (300ms)
  const totalMs = timed.length > 0 ? timed[timed.length - 1].startMs + 300 : 0;

  // Trigger replay when `play` goes from false to true, respecting playDelay
  const prevPlay = useRef(false);
  useEffect(() => {
    if (play && !prevPlay.current) {
      setSessionKey((k) => k + 1);
      setDone(false);
      if (playDelay > 0) {
        const timer = setTimeout(() => setHasPlayed(true), playDelay);
        prevPlay.current = play;
        return () => clearTimeout(timer);
      } else {
        setHasPlayed(true);
      }
    }
    prevPlay.current = play;
  }, [play, playDelay]);

  // Mark done after all animations complete
  useEffect(() => {
    if (!hasPlayed) return;
    const timer = setTimeout(() => setDone(true), totalMs + 200);
    return () => clearTimeout(timer);
  }, [hasPlayed, sessionKey, totalMs]);

  const shouldAnimate = hasPlayed;

  // The primary prompt text — first input entry
  const promptText = scenario.entries.find((e) => e.kind === "input")?.text ?? "";

  const [copied, copy] = useCopy();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      copy(promptText);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => copy(promptText)}
      onKeyDown={handleKeyDown}
      className="group/card flex w-[340px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 text-left transition-colors hover:border-zinc-600 lg:w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-zinc-700/60 bg-zinc-800 px-3 py-1.5">
        {/* Pin button — before traffic lights */}
        {onTogglePin && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className={`group/pin flex h-4 w-4 shrink-0 items-center justify-center transition-opacity ${
              isPinned
                ? "opacity-100"
                : "opacity-0 group-hover/card:opacity-100"
            }`}
            aria-label={isPinned ? "Unpin scenario" : "Pin scenario"}
          >
            {isPinned ? (
              <>
                <span className="text-[#9147ff] group-hover/pin:hidden">
                  <PinFilledIcon />
                </span>
                <span className="hidden text-zinc-400 group-hover/pin:block">
                  <UnpinIcon />
                </span>
              </>
            ) : (
              <span className="text-zinc-500 hover:text-zinc-300">
                <PinOutlineIcon />
              </span>
            )}
          </button>
        )}
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
                    className={TERMINAL_COLORS[entry.color ?? "zinc"] ?? "text-zinc-400"}
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
    </div>
  );
}
