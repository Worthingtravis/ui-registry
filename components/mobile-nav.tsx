"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, kebabToTitle } from "@/lib/utils";
import { REGISTRY } from "@/lib/registry";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger — visible below lg */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="lg:hidden mr-3 -ml-1 inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-accent hover:text-accent-foreground text-muted-foreground"
        aria-label="Toggle navigation"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-over panel */}
      <div
        className={cn(
          "fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] w-[260px] border-r border-border/40 bg-background transition-transform duration-200 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="overflow-y-auto h-full py-6 px-4">
          <div className="space-y-6">
            <div>
              <h4 className="mb-2 text-sm font-semibold">Getting Started</h4>
              <nav className="flex flex-col gap-1">
                <Link
                  href="/"
                  className={cn(
                    "text-sm rounded-md px-2 py-1.5 transition-colors",
                    pathname === "/"
                      ? "text-foreground font-medium bg-muted"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  Introduction
                </Link>
              </nav>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">Components</h4>
              <nav className="flex flex-col gap-0.5">
                {REGISTRY.map((entry) => {
                  const isActive = pathname === `/preview/${entry.name}`;
                  return (
                    <Link
                      key={entry.name}
                      href={`/preview/${entry.name}`}
                      className={cn(
                        "text-sm rounded-md px-2 py-1.5 transition-colors",
                        isActive
                          ? "text-foreground font-medium bg-muted"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      {kebabToTitle(entry.name)}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">Links</h4>
              <nav className="flex flex-col gap-0.5">
                <a
                  href="https://github.com/Worthingtravis/ui-registry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm rounded-md px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  GitHub
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
