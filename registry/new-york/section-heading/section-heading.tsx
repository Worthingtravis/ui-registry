"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** HTML heading level (h1–h6). */
export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface SectionHeadingProps {
  /** Anchor ID for the heading (auto-slugified). */
  id: string;
  /** Heading content. */
  children: React.ReactNode;
  /** HTML heading level. */
  as?: HeadingLevel;
  /** Scroll margin offset in pixels (matches sticky header height). */
  scrollMargin?: number;
  /** Additional class names. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Convert an ID string to a URL-safe slug. */
function toSlug(id: string): string {
  return id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Section heading with auto-generated anchor link. Click the heading to
 * copy the section URL to clipboard and update the URL hash. The anchor
 * symbol (#) appears on hover, positioned on whichever side has more space.
 *
 * @example
 * ```tsx
 * <SectionHeading id="installation">
 *   Installation
 * </SectionHeading>
 *
 * <SectionHeading id="api-reference" as="h3" scrollMargin={80}>
 *   API Reference
 * </SectionHeading>
 * ```
 */
export function SectionHeading({
  id,
  children,
  as: Tag = "h2",
  scrollMargin = 96,
  className,
}: SectionHeadingProps) {
  const slug = toSlug(id);
  const ref = useRef<HTMLHeadingElement>(null);
  const [anchorSide, setAnchorSide] = useState<"left" | "right">("left");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const spaceRight = window.innerWidth - rect.right;
      setAnchorSide(spaceRight > rect.left ? "right" : "left");
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const copyLink = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}#${slug}`;
    await navigator.clipboard.writeText(url);
    window.history.replaceState(null, "", `#${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [slug]);

  return (
    <Tag
      ref={ref}
      id={slug}
      className={cn("group relative cursor-pointer", className)}
      style={{ scrollMarginTop: scrollMargin }}
      onClick={copyLink}
    >
      <span
        className={cn(
          "absolute top-1/2 -translate-y-1/2 transition-colors select-none",
          copied
            ? "text-primary"
            : "text-muted-foreground/0 group-hover:text-muted-foreground/40",
          anchorSide === "right" ? "-right-6" : "-left-6",
        )}
        aria-hidden="true"
      >
        {copied ? "\u2713" : "#"}
      </span>
      {children}
    </Tag>
  );
}
