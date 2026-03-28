"use client";

import { type ReactNode } from "react";
import { useCopy } from "@/lib/use-copy";

export interface CopyableRowProps {
  /** Text to copy to clipboard on click */
  text: string;
  /** Row content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

/**
 * Makes its children clickable-to-copy. Shows a subtle hover highlight
 * and a copy/check icon transition on click.
 */
export function CopyableRow({
  text,
  children,
  className = "",
  style,
}: CopyableRowProps) {
  const [copied, copy] = useCopy();

  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className={`group/copy -mx-1.5 flex w-[calc(100%+12px)] cursor-pointer items-start gap-1 rounded-md px-1.5 py-0.5 text-left transition-colors hover:bg-foreground/5 ${className}`}
      style={style}
    >
      {children}
      <span className="relative ml-auto h-3 w-3 shrink-0 self-center opacity-0 transition-opacity group-hover/copy:opacity-100">
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="absolute inset-0 text-muted-foreground transition-all duration-200"
          style={{ opacity: copied ? 0 : 1, transform: copied ? "scale(0.5)" : "scale(1)" }}
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="absolute inset-0 text-success transition-all duration-300"
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
    </button>
  );
}
