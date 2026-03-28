import type { ReactNode } from "react";

export interface TerminalChromeProps {
  /** Window title shown next to traffic lights */
  title?: string;
  /** Terminal body content */
  children: ReactNode;
  /** Slot rendered on the right side of the title bar */
  rightSlot?: ReactNode;
}

export function TerminalChrome({
  title,
  children,
  rightSlot,
}: TerminalChromeProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-zinc-700/60 bg-zinc-800 px-3 py-1.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
          {title && (
            <span className="text-xs font-medium text-zinc-400">{title}</span>
          )}
        </div>
        {rightSlot}
      </div>
      {/* Body */}
      <div className="p-4 font-mono text-[13px] leading-relaxed">{children}</div>
    </div>
  );
}
