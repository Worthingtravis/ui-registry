"use client";

import type { ToolCallBlockProps } from "./tool-call-block";

/**
 * Inline variant of ToolCallBlock — single-line compact display.
 * Same props, condensed presentation.
 */
export function ToolCallBlockInline({
  toolName,
  args,
  result,
  delay,
}: ToolCallBlockProps) {
  const argStr = Object.entries(args)
    .map(([k, v]) => `${k}=${typeof v === "string" ? `"${v}"` : JSON.stringify(v)}`)
    .join(" ");

  const animStyle: React.CSSProperties = delay > 0
    ? { opacity: 0, animation: `fade-in 300ms ${delay}ms forwards` }
    : {};

  return (
    <div
      className="terminal flex items-center gap-2 rounded-md border border-[var(--term-border)] border-l-2 border-l-[var(--term-accent)] bg-[var(--term-bg-muted)] px-3 py-1.5 text-xs font-mono"
      style={animStyle}
    >
      <span className="font-semibold text-[var(--term-accent)]">{toolName}</span>
      <span className="text-[var(--term-text-muted)] truncate max-w-[200px]">{argStr}</span>
      <span className="text-[var(--term-text-muted)] mx-1">&rarr;</span>
      <span className="text-[var(--term-success)] truncate">{result}</span>
    </div>
  );
}
