"use client";

import React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single component entry in the grid. */
export interface ComponentGridItem {
  /** Unique identifier. */
  id: string;
  /** Display title. */
  title: string;
  /** Short description shown below the title. */
  description?: string;
  /** Navigation URL. */
  href: string;
  /** Live preview content (ReactNode). */
  preview?: React.ReactNode;
}

export interface ComponentGridProps {
  /** Array of components to display. */
  items: ComponentGridItem[];
  /** Number of columns at the sm breakpoint and above. */
  columns?: 2 | 3 | 4;
  /** Scale factor for the preview content (default 0.6). */
  previewScale?: number;
  /** Minimum height for the preview area in pixels. */
  previewMinHeight?: number;
  /** Maximum height for the preview area in pixels. */
  previewMaxHeight?: number;
  /**
   * Render function for the card wrapper.
   * Use this to render framework-specific links (e.g. Next.js `<Link>`).
   * Receives the item and children. When omitted, renders a plain `<a>` tag.
   */
  renderLink?: (item: ComponentGridItem, children: React.ReactNode) => React.ReactNode;
  /** Additional class names for the root container. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Column class mapping
// ---------------------------------------------------------------------------

const COL_CLASSES: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

const BORDER_CLASSES: Record<2 | 3 | 4, string> = {
  2: "sm:[&:nth-child(2n)]:border-r-0",
  3: "sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0",
  4: "sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 xl:[&:nth-child(3n)]:border-r xl:[&:nth-child(4n)]:border-r-0",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * A tic-tac-toe grid of component cards with live preview thumbnails.
 *
 * Each card shows a scaled-down preview of the component with its title
 * and description below. Cards share borders between cells for a clean
 * documentation-style layout.
 *
 * @example
 * ```tsx
 * <ComponentGrid
 *   items={[
 *     { id: "btn", title: "Button", description: "Click me", href: "/button", preview: <Button>Click</Button> },
 *     { id: "inp", title: "Input", description: "Type here", href: "/input", preview: <Input /> },
 *   ]}
 *   columns={3}
 * />
 * ```
 */
export function ComponentGrid({
  items,
  columns = 3,
  previewScale = 0.6,
  previewMinHeight = 120,
  previewMaxHeight = 200,
  renderLink,
  className,
}: ComponentGridProps) {
  const inverseScale = 1 / previewScale;

  return (
    <div
      className={cn(
        "grid grid-cols-1 divide-y divide-border/40",
        "sm:divide-y-0",
        COL_CLASSES[columns],
        "sm:border-t sm:border-border/40",
        className,
      )}
    >
      {items.map((item) => {
        const content = (
          <>
            {/* Title */}
            <div className="px-3 pt-3">
              <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>

            {/* Preview area */}
            <div
              className="flex-1 p-2 overflow-hidden pointer-events-none select-none"
              style={{ minHeight: previewMinHeight, maxHeight: previewMaxHeight }}
            >
              {item.preview ? (
                <div
                  style={{
                    transform: `scale(${previewScale})`,
                    transformOrigin: "top left",
                    width: `${inverseScale * 100}%`,
                  }}
                >
                  {item.preview}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[80px]">
                  <span className="text-xs text-muted-foreground/30 font-mono">
                    No preview
                  </span>
                </div>
              )}
            </div>

          </>
        );

        const cellClasses = cn(
          "sm:border-b sm:border-r sm:border-border/40",
          BORDER_CLASSES[columns],
        );

        if (renderLink) {
          return (
            <div key={item.id} className={cellClasses}>
              {renderLink(item, content)}
            </div>
          );
        }

        return (
          <div key={item.id} className={cellClasses}>
            <div className="group relative flex flex-col h-full overflow-hidden transition-colors hover:bg-muted/30">
              {content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
