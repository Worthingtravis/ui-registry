"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CollapsibleGroupProps {
  /** Heading text for the collapsible section. */
  label: string;
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
  /** Whether the group is in an "active" highlight state. */
  active?: boolean;
  /** Whether the group content is expanded. */
  open: boolean;
  /** Called when the header is clicked to toggle open/closed. */
  onToggle: () => void;
  /** Content revealed when the group is open. */
  children: React.ReactNode;
  /** Render the header and content in a dimmed state. */
  dimmed?: boolean;
  /** Duration of the expand/collapse animation in milliseconds. */
  duration?: number;
  /** Additional class names for the root container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Accordion-style collapsible section with smooth grid-row animation.
 *
 * Uses `grid-template-rows: 0fr → 1fr` for a clean height transition
 * without measuring DOM height. Supports active/dimmed states,
 * optional icon, and configurable animation duration.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <CollapsibleGroup
 *   label="Advanced Settings"
 *   open={open}
 *   onToggle={() => setOpen(!open)}
 * >
 *   <div className="py-2 space-y-2">
 *     <p>Hidden content here</p>
 *   </div>
 * </CollapsibleGroup>
 * ```
 */
export function CollapsibleGroup({
  label,
  icon,
  active = false,
  open,
  onToggle,
  children,
  dimmed = false,
  duration = 200,
  className,
}: CollapsibleGroupProps) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-1.5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors",
          dimmed
            ? "text-muted-foreground/50 hover:text-muted-foreground"
            : active
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
        )}
      >
        <ChevronRight
          className={cn(
            "size-3 shrink-0 transition-transform",
            open && "rotate-90",
            active && "text-primary",
          )}
          strokeWidth={3}
        />
        {icon && (
          <div
            className={cn(
              "shrink-0 transition-colors",
              active ? "text-primary" : "text-muted-foreground/60",
            )}
          >
            {icon}
          </div>
        )}
        <span className="truncate">{label}</span>
      </button>
      <div
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr] invisible",
        )}
        style={{ transitionDuration: `${duration}ms` }}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
