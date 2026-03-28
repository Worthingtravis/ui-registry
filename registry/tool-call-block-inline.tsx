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

  return (
    <div
      className="flex items-center gap-2 rounded-md border border-zinc-700 border-l-2 border-l-[#9147ff] bg-zinc-800/50 px-3 py-1.5 text-xs font-mono"
      style={{
        opacity: 0,
        animation: `fade-in 300ms ${delay}ms forwards`,
      }}
    >
      <span className="font-semibold text-[#9147ff]">{toolName}</span>
      <span className="text-zinc-500 truncate max-w-[200px]">{argStr}</span>
      <span className="text-zinc-600 mx-1">&rarr;</span>
      <span className="text-green-400 truncate">{result}</span>
    </div>
  );
}
