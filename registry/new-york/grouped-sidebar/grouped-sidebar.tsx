"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single navigation item. */
export interface SidebarItem {
  /** Unique key for the item. */
  id: string;
  /** Display label. */
  label: string;
  /** Navigation URL. */
  href: string;
}

/** A group of navigation items under a shared heading. */
export interface SidebarGroup {
  /** Group heading text. */
  title: string;
  /** Items within this group. */
  items: SidebarItem[];
}

export interface GroupedSidebarProps {
  /** Ordered array of navigation groups. */
  groups: SidebarGroup[];
  /** The currently active item ID (controls highlight state). */
  activeId?: string;
  /** Called when a navigation item is clicked. */
  onNavigate?: (item: SidebarItem) => void;
  /**
   * Render function for each navigation item.
   * Use this to render framework-specific links (e.g. Next.js `<Link>`).
   * When omitted, renders a plain `<a>` tag.
   */
  renderLink?: (item: SidebarItem, isActive: boolean) => React.ReactNode;
  /** Width of the sidebar in pixels. */
  width?: number;
  /** Breakpoint below which the sidebar becomes a slide-over. Use "none" to always show inline. */
  mobileBreakpoint?: "sm" | "md" | "lg" | "xl" | "none";
  /** Offset from the top for sticky positioning (e.g. header height like "3.5rem"). */
  stickyTop?: string;
  /** Additional class names for the outer wrapper. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Breakpoint mapping
// ---------------------------------------------------------------------------

const BREAKPOINTS = {
  sm: { hide: "sm:hidden", show: "hidden sm:block", showPanel: "sm:hidden" },
  md: { hide: "md:hidden", show: "hidden md:block", showPanel: "md:hidden" },
  lg: { hide: "lg:hidden", show: "hidden lg:block", showPanel: "lg:hidden" },
  xl: { hide: "xl:hidden", show: "hidden xl:block", showPanel: "xl:hidden" },
  none: { hide: "hidden", show: "block", showPanel: "hidden" },
} as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Grouped sidebar navigation with responsive slide-over for mobile.
 *
 * Renders navigation items organized under group headings. On desktop,
 * displays as a sticky sidebar. Below the breakpoint, collapses into a
 * hamburger menu with a slide-over panel.
 *
 * Use `renderLink` to integrate with your routing framework (Next.js, etc.)
 * or rely on the default `<a>` tags for plain HTML navigation.
 *
 * @example
 * ```tsx
 * <GroupedSidebar
 *   groups={[
 *     { title: "Getting Started", items: [{ id: "intro", label: "Introduction", href: "/" }] },
 *     { title: "Components", items: [
 *       { id: "button", label: "Button", href: "/button" },
 *       { id: "input", label: "Input", href: "/input" },
 *     ]},
 *   ]}
 *   activeId="button"
 * />
 * ```
 */
export function GroupedSidebar({
  groups,
  activeId,
  onNavigate,
  renderLink,
  width = 220,
  mobileBreakpoint = "lg",
  stickyTop = "3.5rem",
  className,
}: GroupedSidebarProps) {
  const [open, setOpen] = useState(false);
  const bp = BREAKPOINTS[mobileBreakpoint];

  // Close on outside interaction
  const close = useCallback(() => setOpen(false), []);

  // Prevent body scroll when mobile panel is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleItemClick = (item: SidebarItem) => {
    onNavigate?.(item);
    setOpen(false);
  };

  // Shared nav content renderer
  const renderNav = (itemPaddingY: string) => (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.title}>
          <h4 className="mb-2 text-sm font-semibold">{group.title}</h4>
          <nav className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive = item.id === activeId;

              if (renderLink) {
                return (
                  <div key={item.id} onClick={() => handleItemClick(item)}>
                    {renderLink(item, isActive)}
                  </div>
                );
              }

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "text-sm rounded-md px-2 transition-colors",
                    itemPaddingY,
                    isActive
                      ? "text-foreground font-medium bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "shrink-0 border-r border-border/40",
          bp.show,
          className,
        )}
        style={{ width }}
      >
        <div
          className="overflow-y-auto py-8 px-4"
          style={{
            position: "sticky",
            top: stickyTop,
            height: `calc(100vh - ${stickyTop})`,
          }}
        >
          {renderNav("py-1")}
        </div>
      </aside>

      {/* Mobile hamburger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "mr-3 -ml-1 inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-muted hover:text-foreground text-muted-foreground",
          bp.hide,
          mobileBreakpoint === "none" && "hidden",
        )}
        aria-label="Toggle navigation"
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm",
            bp.showPanel,
          )}
          onClick={close}
        />
      )}

      {/* Mobile slide-over panel */}
      <div
        className={cn(
          "fixed left-0 z-50 border-r border-border/40 bg-background transition-transform duration-200 ease-in-out",
          bp.showPanel,
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          top: stickyTop,
          height: `calc(100vh - ${stickyTop})`,
          width: width + 40,
        }}
      >
        <div className="overflow-y-auto h-full py-6 px-4">
          {renderNav("py-1.5")}
        </div>
      </div>
    </>
  );
}
