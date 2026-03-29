"use client";

import { ComponentGrid } from "@/registry/new-york/component-grid/component-grid";
import {
  ALL_FIXTURES,
  type ComponentGridFixture,
} from "@/fixtures/component-grid.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = ComponentGridFixture;

const propsMeta: PropMeta[] = [
  { name: "items", type: "ComponentGridItem[]", required: true, description: "Array of components to display with id, title, description, href, and optional preview ReactNode" },
  { name: "columns", type: "2 | 3 | 4", required: false, defaultValue: "3", description: "Number of columns at sm+ breakpoint" },
  { name: "previewScale", type: "number", required: false, defaultValue: "0.6", description: "Scale factor for preview content" },
  { name: "previewMinHeight", type: "number", required: false, defaultValue: "120", description: "Minimum height for preview area in pixels" },
  { name: "previewMaxHeight", type: "number", required: false, defaultValue: "200", description: "Maximum height for preview area in pixels" },
  { name: "renderLink", type: "(item, children) => ReactNode", required: false, description: "Custom link wrapper for framework-specific routing" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

const USAGE = `import { ComponentGrid } from "@/registry/new-york/component-grid/component-grid"
import type { ComponentGridItem } from "@/registry/new-york/component-grid/component-grid"

const items: ComponentGridItem[] = [
  {
    id: "button",
    title: "Button",
    description: "Interactive button",
    href: "/components/button",
    preview: <Button>Click me</Button>,
  },
  {
    id: "input",
    title: "Input",
    description: "Text input field",
    href: "/components/input",
    preview: <Input placeholder="Type..." />,
  },
]

{/* Basic grid */}
<ComponentGrid items={items} columns={3} />

{/* With Next.js Link */}
<ComponentGrid
  items={items}
  renderLink={(item, children) => (
    <Link href={item.href} className="group relative flex flex-col h-full hover:bg-muted/30">
      {children}
    </Link>
  )}
/>`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Component Grid",
  description:
    "Tic-tac-toe grid of component cards with scaled live preview thumbnails. Shared borders between cells for a clean documentation-style layout.",
  tags: ["navigation", "layout", "grid", "preview", "documentation"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => <ComponentGrid {...fixture} />,
  propsMeta,
};
