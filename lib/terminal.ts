// ---------------------------------------------------------------------------
// Shared terminal utilities — used by terminal-demo and mini-terminal-demo
// ---------------------------------------------------------------------------

/** Compute cumulative start times from sequential entry timings. */
export function computeTimings<T extends { kind: string; pauseAfter: number }>(
  entries: T[],
): Array<T & { startMs: number }> {
  let cursor = 0;
  return entries.map((entry) => {
    const startMs = cursor;
    if ("typingMs" in entry && typeof entry.typingMs === "number") {
      cursor += entry.typingMs + entry.pauseAfter;
    } else if ("durationMs" in entry && typeof entry.durationMs === "number") {
      cursor += entry.durationMs + entry.pauseAfter;
    } else {
      cursor += entry.pauseAfter;
    }
    return { ...entry, startMs };
  });
}

/** Shared color class map for terminal output lines. */
export const TERMINAL_COLORS: Record<string, string> = {
  green: "text-term-success",
  zinc: "text-term-text-muted",
  purple: "text-term-accent",
};
