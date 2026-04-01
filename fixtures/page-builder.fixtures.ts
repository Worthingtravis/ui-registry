/**
 * Generic fixtures for the page-builder demo.
 *
 * Uses simple placeholder section components so the demo has no external
 * dependencies. Real apps replace these with their own SectionRegistry.
 */
import React from "react";
import type { PageLayout, SectionRegistry } from "@/registry/new-york/page-builder-lib/types";

// ---------------------------------------------------------------------------
// Placeholder section components
// ---------------------------------------------------------------------------
// These are defined as plain functions returning JSX-compatible objects.
// In a real app you'd import your own section components here.

function makePlaceholder(label: string, color: string) {
  // Return a function component that renders a colored placeholder box
  const Component = () => null;
  Component.displayName = label;
  // We'll render these via the demo component which has access to React
  return { label, color, Component };
}

export const PLACEHOLDER_SECTIONS = {
  header: makePlaceholder("Header", "bg-blue-500/10 border-blue-500/20"),
  "content-a": makePlaceholder("Content A", "bg-green-500/10 border-green-500/20"),
  "content-b": makePlaceholder("Content B", "bg-purple-500/10 border-purple-500/20"),
  sidebar: makePlaceholder("Sidebar", "bg-orange-500/10 border-orange-500/20"),
  footer: makePlaceholder("Footer", "bg-rose-500/10 border-rose-500/20"),
  hero: makePlaceholder("Hero", "bg-cyan-500/10 border-cyan-500/20"),
  "stats-bar": makePlaceholder("Stats Bar", "bg-yellow-500/10 border-yellow-500/20"),
  feed: makePlaceholder("Feed", "bg-indigo-500/10 border-indigo-500/20"),
} as const;

// ---------------------------------------------------------------------------
// Default layout
// ---------------------------------------------------------------------------

export const DEFAULT_DEMO_LAYOUT: PageLayout = {
  schemaVersion: 1,
  pageKey: "demo",
  sections: [
    { sectionKey: "hero",       variant: "default", visible: true,  column: "full" },
    { sectionKey: "stats-bar",  variant: "default", visible: true,  column: "full" },
    { sectionKey: "content-a",  variant: "default", visible: true,  column: "left",  split: "2-1" },
    { sectionKey: "sidebar",    variant: "compact",  visible: true,  column: "right", split: "2-1" },
    { sectionKey: "content-b",  variant: "default", visible: true,  column: "left",  split: "1-1" },
    { sectionKey: "feed",       variant: "default", visible: true,  column: "right", split: "1-1" },
    { sectionKey: "footer",     variant: "default", visible: true,  column: "full" },
  ],
};

// ---------------------------------------------------------------------------
// Section registry (generic, no real data dependencies)
// ---------------------------------------------------------------------------

/**
 * Build a generic section registry using React component factories.
 * Call this from the demo component where React is available.
 */
export function buildDemoRegistry(
  PlaceholderCard: (props: { label: string; color: string; description?: string }) => React.ReactElement | null,
): SectionRegistry {
  function section(
    key: string,
    label: string,
    color: string,
    column: "left" | "right" | "full",
    opts?: {
      allowedColumns?: ("left" | "right" | "full")[];
      alwaysVisible?: boolean;
      sizeHint?: "sm" | "md" | "lg";
    },
  ) {
    const variants = {
      default: (props: Record<string, unknown>) =>
        PlaceholderCard({
          label,
          color,
          description: String(props["description"] ?? "Default layout"),
        }),
      compact: (props: Record<string, unknown>) =>
        PlaceholderCard({
          label,
          color,
          description: String(props["description"] ?? "Compact layout"),
        }),
    };

    return {
      key,
      label,
      column,
      allowedColumns: opts?.allowedColumns,
      alwaysVisible: opts?.alwaysVisible,
      variants,
      defaultVariant: "default",
      variantMeta: {
        default: { label: "Default", sizeHint: (opts?.sizeHint ?? "md") as "sm" | "md" | "lg" },
        compact: { label: "Compact", sizeHint: "sm" as const },
      },
    };
  }

  return {
    "hero": section("hero", "Hero", "bg-cyan-500/10 border-cyan-500/20", "full", {
      allowedColumns: ["full"],
      alwaysVisible: true,
      sizeHint: "md",
    }),
    "stats-bar": section("stats-bar", "Stats Bar", "bg-yellow-500/10 border-yellow-500/20", "full", {
      allowedColumns: ["full"],
      sizeHint: "sm",
    }),
    "content-a": section("content-a", "Content A", "bg-green-500/10 border-green-500/20", "left", {
      sizeHint: "lg",
    }),
    "content-b": section("content-b", "Content B", "bg-purple-500/10 border-purple-500/20", "left", {
      sizeHint: "md",
    }),
    "sidebar": section("sidebar", "Sidebar", "bg-orange-500/10 border-orange-500/20", "right", {
      sizeHint: "md",
    }),
    "feed": section("feed", "Feed", "bg-indigo-500/10 border-indigo-500/20", "right", {
      sizeHint: "lg",
    }),
    "footer": section("footer", "Footer", "bg-rose-500/10 border-rose-500/20", "full", {
      allowedColumns: ["full"],
      sizeHint: "sm",
    }),
  };
}

// ---------------------------------------------------------------------------
// Preview fixtures (generic, for fixture picker in edit mode)
// ---------------------------------------------------------------------------

export const DEMO_PREVIEW_FIXTURES: Record<
  string,
  Record<string, Record<string, unknown>>
> = {
  "content-a": {
    "Long Content": { description: "Article with many paragraphs" },
    "Short Content": { description: "Brief one-liner" },
    "Empty State": { description: "No content yet" },
  },
  "feed": {
    "Active Feed (10 items)": { description: "10 feed items" },
    "Empty Feed": { description: "No items yet" },
    "Error State": { description: "Failed to load" },
  },
  "sidebar": {
    "Full Sidebar": { description: "All widgets visible" },
    "Minimal Sidebar": { description: "Only essential items" },
  },
};
