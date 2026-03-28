"use client";

export interface ToolCallBlockProps {
  /** Name of the tool being called */
  toolName: string;
  /** Key-value argument pairs */
  args: Record<string, string | number | boolean | string[]>;
  /** Result text shown at the bottom */
  result: string;
  /** Fade-in delay in ms (0 = no animation) */
  delay: number;
}

export function ToolCallBlock({
  toolName,
  args,
  result,
  delay,
}: ToolCallBlockProps) {
  const animStyle: React.CSSProperties = delay > 0
    ? { opacity: 0, animation: `fade-in 300ms ${delay}ms forwards` }
    : {};

  return (
    <div
      className="rounded-md border border-term-border border-l-2 border-l-term-accent bg-term-bg-muted px-3 py-2"
      style={animStyle}
    >
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-term-text-muted">{"\u250C"}</span>
        <span className="font-semibold text-term-accent">{toolName}</span>
      </div>
      <div className="ml-3 border-l border-term-border pl-2">
        {Object.entries(args).map(([key, value]) => (
          <div key={key} className="text-xs text-term-text-muted">
            <span className="text-term-text-muted">{key}:</span>{" "}
            <span className="text-term-text">
              {typeof value === "string" ? `"${value}"` : JSON.stringify(value)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-term-text-muted">{"\u2514"}</span>
        <span className="text-term-success">{result}</span>
      </div>
    </div>
  );
}
