"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, kebabToTitle } from "@/lib/utils";
import { groupedRegistry } from "@/lib/registry";
import { GroupedSidebar } from "@/registry/new-york/grouped-sidebar/grouped-sidebar";
import type { SidebarGroup } from "@/registry/new-york/grouped-sidebar/grouped-sidebar";

function buildGroups(pathname: string): { groups: SidebarGroup[]; activeId: string | undefined } {
  const registryGroups = groupedRegistry();

  const groups: SidebarGroup[] = [
    {
      title: "Getting Started",
      items: [{ id: "__intro__", label: "Introduction", href: "/" }],
    },
    ...registryGroups.map(({ category, entries }) => ({
      title: category,
      items: entries.map((e) => ({
        id: e.name,
        label: kebabToTitle(e.name),
        href: `/preview/${e.name}`,
      })),
    })),
  ];

  let activeId: string | undefined;
  if (pathname === "/") {
    activeId = "__intro__";
  } else {
    const match = pathname.match(/\/preview\/(.+)/);
    if (match) activeId = match[1];
  }

  return { groups, activeId };
}

export function SidebarNav() {
  const pathname = usePathname();
  const { groups, activeId } = buildGroups(pathname);

  return (
    <GroupedSidebar
      groups={groups}
      activeId={activeId}
      mobileBreakpoint="lg"
      renderLink={(item, isActive) => (
        <Link
          href={item.href}
          className={cn(
            "block text-sm rounded-md px-2 py-1 transition-colors",
            isActive
              ? "text-foreground font-medium bg-muted"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )}
        >
          {item.label}
        </Link>
      )}
    />
  );
}
