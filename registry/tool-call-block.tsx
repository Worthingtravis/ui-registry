"use client";

export interface ToolCallBlockProps {
  /** Name of the tool being called */
  toolName: string;
  /** Key-value argument pairs */
  args: Record<string, string | number | boolean | string[]>;
  /** Result text shown at the bottom */
  result: string;
  /** Fade-in delay in ms */
  delay: number;
}

export function ToolCallBlock({
  toolName,
  args,
  result,
  delay,
}: ToolCallBlockProps) {
  return (
    <div
      className="rounded-md border border-zinc-700 border-l-2 border-l-[#9147ff] bg-zinc-800/50 px-3 py-2"
      style={{
        opacity: 0,
        animation: `fade-in 300ms ${delay}ms forwards`,
      }}
    >
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-zinc-500">{"┌"}</span>
        <span className="font-semibold text-[#9147ff]">{toolName}</span>
      </div>
      <div className="ml-3 border-l border-zinc-700 pl-2">
        {Object.entries(args).map(([key, value]) => (
          <div key={key} className="text-xs text-zinc-400">
            <span className="text-zinc-500">{key}:</span>{" "}
            <span className="text-zinc-300">
              {typeof value === "string" ? `"${value}"` : JSON.stringify(value)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-zinc-500">{"└"}</span>
        <span className="text-green-400">{result}</span>
      </div>
    </div>
  );
}
