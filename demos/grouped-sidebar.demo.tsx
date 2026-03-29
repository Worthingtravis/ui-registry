"use client";

import { GroupedSidebar } from "@/registry/new-york/grouped-sidebar/grouped-sidebar";
import {
  ALL_FIXTURES,
  type GroupedSidebarFixture,
} from "@/fixtures/grouped-sidebar.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = GroupedSidebarFixture;

const propsMeta: PropMeta[] = [
  { name: "groups", type: "SidebarGroup[]", required: true, description: "Ordered array of navigation groups with title and items" },
  { name: "activeId", type: "string", required: false, description: "ID of the currently active item (controls highlight)" },
  { name: "onNavigate", type: "(item: SidebarItem) => void", required: false, description: "Called when a navigation item is clicked" },
  { name: "renderLink", type: "(item, isActive) => ReactNode", required: false, description: "Custom render function for links (e.g. Next.js Link)" },
  { name: "width", type: "number", required: false, defaultValue: "220", description: "Sidebar width in pixels" },
  { name: "mobileBreakpoint", type: '"sm" | "md" | "lg" | "xl" | "none"', required: false, defaultValue: '"lg"', description: "Breakpoint below which sidebar becomes a slide-over" },
  { name: "stickyTop", type: "string", required: false, defaultValue: '"3.5rem"', description: "Top offset for sticky positioning (e.g. header height)" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

const USAGE = `import { GroupedSidebar } from "@/registry/new-york/grouped-sidebar/grouped-sidebar"
import type { SidebarGroup } from "@/registry/new-york/grouped-sidebar/grouped-sidebar"

const groups: SidebarGroup[] = [
  {
    title: "Getting Started",
    items: [
      { id: "intro", label: "Introduction", href: "/" },
    ],
  },
  {
    title: "Components",
    items: [
      { id: "button", label: "Button", href: "/button" },
      { id: "input", label: "Input", href: "/input" },
    ],
  },
]

{/* Basic usage */}
<GroupedSidebar groups={groups} activeId="button" />

{/* With Next.js Link */}
<GroupedSidebar
  groups={groups}
  activeId={currentPath}
  renderLink={(item, isActive) => (
    <Link
      href={item.href}
      className={isActive ? "font-medium text-foreground bg-muted" : "text-muted-foreground"}
    >
      {item.label}
    </Link>
  )}
/>

{/* Custom width and breakpoint */}
<GroupedSidebar groups={groups} width={280} mobileBreakpoint="md" />`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Grouped Sidebar",
  description:
    "Grouped sidebar navigation with responsive slide-over for mobile. Renders items under group headings with active state highlighting.",
  tags: ["navigation", "sidebar", "responsive", "layout"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="flex h-[400px] border border-border/40 rounded-lg overflow-hidden">
      <GroupedSidebar {...fixture} />
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
        Main content area
      </div>
    </div>
  ),
  propsMeta,
};
