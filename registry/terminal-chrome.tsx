import type { ReactNode } from "react";

export interface TerminalChromeProps {
  /** Window title shown next to traffic lights */
  title?: string;
  /** Terminal body content */
  children: ReactNode;
  /** Slot rendered before the traffic lights (e.g. pin button) */
  leftSlot?: ReactNode;
  /** Slot rendered on the right side of the title bar */
  rightSlot?: ReactNode;
  /** Additional class names for the outer container */
  className?: string;
}

export function TerminalChrome({
  title,
  children,
  leftSlot,
  rightSlot,
  className = "",
}: TerminalChromeProps) {
  return (
    <div className={`terminal overflow-hidden rounded-lg border border-[var(--term-border)] bg-[var(--term-bg)] ${className}`}>
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-[var(--term-border-muted)] bg-[var(--term-bg-header)] px-3 py-1.5">
        <div className="flex items-center gap-3">
          {leftSlot}
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--term-dot-red)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--term-dot-yellow)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--term-dot-green)]" />
          </div>
          {title && (
            <span className="text-xs font-medium text-[var(--term-text-muted)]">{title}</span>
          )}
        </div>
        {rightSlot}
      </div>
      {/* Body */}
      <div className="p-4 font-mono text-[13px] leading-relaxed text-[var(--term-text)]">{children}</div>
    </div>
  );
}
