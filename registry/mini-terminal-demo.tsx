"use client";

import { useState, useEffect, useRef } from "react";
import { TerminalChrome } from "./terminal-chrome";
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
// Pin icons (11x11)
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

  const totalMs = timed.length > 0 ? timed[timed.length - 1].startMs + 300 : 0;

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

  useEffect(() => {
    if (!hasPlayed) return;
    const timer = setTimeout(() => setDone(true), totalMs + 200);
    return () => clearTimeout(timer);
  }, [hasPlayed, sessionKey, totalMs]);

  const shouldAnimate = hasPlayed;
  const promptText = scenario.entries.find((e) => e.kind === "input")?.text ?? "";
  const [copied, copy] = useCopy();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      copy(promptText);
    }
  };

  // Pin button for leftSlot
  const pinButton = onTogglePin ? (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
      className={`group/pin flex h-4 w-4 shrink-0 items-center justify-center transition-opacity ${
        isPinned ? "opacity-100" : "opacity-0 group-hover/card:opacity-100"
      }`}
      aria-label={isPinned ? "Unpin scenario" : "Pin scenario"}
    >
      {isPinned ? (
        <>
          <span className="text-term-accent group-hover/pin:hidden"><PinFilledIcon /></span>
          <span className="hidden text-term-text-muted group-hover/pin:block"><UnpinIcon /></span>
        </>
      ) : (
        <span className="text-term-text-muted hover:text-term-text"><PinOutlineIcon /></span>
      )}
    </button>
  ) : undefined;

  // Category badge + copy indicator for rightSlot
  const rightContent = (
    <div className="flex items-center gap-2">
      <span className="rounded-full bg-term-bg-muted px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-term-text-muted">
        {scenario.category}
      </span>
      <span className="relative h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover/card:opacity-100">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="absolute inset-0 text-term-text-muted transition-all duration-200"
          style={{ opacity: copied ? 0 : 1, transform: copied ? "scale(0.5)" : "scale(1)" }}>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="absolute inset-0 text-term-success transition-all duration-300"
          style={{
            opacity: copied ? 1 : 0, transform: copied ? "scale(1)" : "scale(0.5)",
            strokeDasharray: 24, strokeDashoffset: copied ? 0 : 24,
            transitionProperty: "opacity, transform, stroke-dashoffset",
          }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </div>
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => copy(promptText)}
      onKeyDown={handleKeyDown}
      className="group/card w-[340px] shrink-0 cursor-pointer text-left transition-colors lg:w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <TerminalChrome
        title={scenario.title}
        leftSlot={pinButton}
        rightSlot={rightContent}
      >
        <div key={sessionKey} className="space-y-1.5 text-[12px]">
          {timed.map((entry, i) => {
            const isInput = entry.kind === "input";
            const dimmed = done && !isInput && !hovered;

            let entryStyle: React.CSSProperties;
            if (done) {
              entryStyle = { opacity: dimmed ? 0.4 : 1, transition: "opacity 400ms ease-out" };
            } else if (shouldAnimate) {
              entryStyle = { opacity: 0, animation: `fade-in 300ms ${entry.startMs}ms forwards` };
            } else {
              entryStyle = { opacity: 0 };
            }

            switch (entry.kind) {
              case "input":
                return (
                  <div key={i} className="flex items-start gap-1 min-w-0 text-term-text-bright" style={entryStyle}>
                    <span className="shrink-0 select-none text-term-success">{entry.prompt ?? ">"}{" "}</span>
                    <span className="flex-1" style={{ wordBreak: "break-word" }}>{entry.text}</span>
                  </div>
                );
              case "output":
                return (
                  <div key={i} className={TERMINAL_COLORS[entry.color ?? "zinc"] ?? "text-term-text-muted"} style={entryStyle}>
                    {entry.text}
                  </div>
                );
              case "tool-call":
                return (
                  <div key={i} style={entryStyle}>
                    <ToolCallBlock toolName={entry.toolName} args={entry.args} result={entry.result} delay={0} />
                  </div>
                );
              case "claude":
                return (
                  <div key={i} className="flex items-start gap-2 text-term-text" style={entryStyle}>
                    <span className="shrink-0 text-term-accent-muted">✦</span>
                    <span>{entry.text}</span>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </TerminalChrome>
    </div>
  );
}
