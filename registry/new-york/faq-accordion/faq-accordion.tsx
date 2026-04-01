import React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreatorFaqData = {
  id: string;
  question: string;
  answer: string;
};

export interface FaqAccordionProps {
  /** Array of FAQ items */
  items: CreatorFaqData[];
  /** Whether the viewer is the owner of this profile */
  isOwner: boolean;
  /** Additional CSS classes for the root container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * FAQ list using native HTML `<details>` / `<summary>` for progressive
 * enhancement. Each item animates open/closed using CSS grid-row trick.
 *
 * @example
 * ```tsx
 * <FaqAccordion
 *   items={[{ id: "1", question: "What do you stream?", answer: "Dead by Daylight!" }]}
 *   isOwner={false}
 * />
 * ```
 */
export function FaqAccordion({ items, isOwner, className }: FaqAccordionProps) {
  if (items.length === 0) {
    return (
      <div className={cn("rounded-lg border border-dashed border-border p-8 text-center", className)}>
        <p className="text-sm text-muted-foreground">
          {isOwner ? "Add FAQ items to answer your community's common questions." : "No FAQ items added yet."}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("@container", className)}>
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border/60">
        {items.map((item) => (
          <details
            key={item.id}
            className="group bg-card/50 backdrop-blur-sm transition-colors duration-150 open:bg-card"
          >
            <summary
              className={cn(
                "flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4",
                "text-sm font-semibold text-foreground transition-colors",
                "hover:text-foreground/80 [&::-webkit-details-marker]:hidden",
              )}
            >
              <span className="leading-relaxed">{item.question}</span>
              {/* Animated chevron */}
              <svg
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </summary>
            <div className="px-5 pb-5 pt-2">
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
