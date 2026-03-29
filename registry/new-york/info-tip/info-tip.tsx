"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Placement of the tooltip relative to the trigger. */
export type InfoTipSide = "top" | "bottom" | "left" | "right";

export interface InfoTipProps {
  /** Content shown in the tooltip/popover. */
  children: React.ReactNode;
  /** Preferred placement of the tooltip. */
  side?: InfoTipSide;
  /** Maximum width of the tooltip in pixels. */
  maxWidth?: number;
  /** Size of the info icon in pixels. */
  iconSize?: number;
  /** Additional class names for the trigger button. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Placement styles
// ---------------------------------------------------------------------------

const SIDE_CLASSES: Record<InfoTipSide, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Info icon that shows a tooltip on hover (desktop) and toggles on tap
 * (mobile). Self-contained — no external tooltip/popover library needed.
 *
 * @example
 * ```tsx
 * <InfoTip>
 *   This field is required for API authentication.
 * </InfoTip>
 *
 * <InfoTip side="right" maxWidth={300}>
 *   <p>Supports rich content like <strong>bold</strong> text.</p>
 * </InfoTip>
 * ```
 */
export function InfoTip({
  children,
  side = "top",
  maxWidth = 256,
  iconSize = 14,
  className,
}: InfoTipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click (mobile tap-to-toggle)
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open, handleClickOutside]);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={cn(
          "inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-full",
          className,
        )}
        aria-label="More info"
      >
        <Info style={{ width: iconSize, height: iconSize }} />
      </button>

      {open && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 rounded-lg border border-border bg-card px-3 py-2 text-xs text-card-foreground shadow-md",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            SIDE_CLASSES[side],
          )}
          style={{ maxWidth }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
