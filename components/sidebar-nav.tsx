"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, kebabToTitle } from "@/lib/utils";
import { REGISTRY } from "@/lib/registry";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-[220px] shrink-0 border-r border-border/40">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 px-4">
        <div className="space-y-6">
          {/* Getting Started */}
          <div>
            <h4 className="mb-2 text-sm font-semibold">Getting Started</h4>
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                className={cn(
                  "text-sm rounded-md px-2 py-1 transition-colors",
                  pathname === "/"
                    ? "text-foreground font-medium bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                Introduction
              </Link>
            </nav>
          </div>

          {/* Components */}
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
                      "text-sm rounded-md px-2 py-1 transition-colors",
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
        </div>
      </div>
    </aside>
  );
}
