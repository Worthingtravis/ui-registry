"use client";

import { CollapsibleGroup } from "@/registry/new-york/collapsible-group/collapsible-group";
import {
  ALL_FIXTURES,
  type CollapsibleGroupFixture,
} from "@/fixtures/collapsible-group.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";
import { Settings } from "lucide-react";

type Fixture = CollapsibleGroupFixture;

const propsMeta: PropMeta[] = [
  { name: "label", type: "string", required: true, description: "Heading text for the section" },
  { name: "open", type: "boolean", required: true, description: "Whether the content is expanded" },
  { name: "onToggle", type: "() => void", required: true, description: "Called on header click to toggle" },
  { name: "children", type: "ReactNode", required: true, description: "Content revealed when open" },
  { name: "icon", type: "ReactNode", required: false, description: "Icon before the label" },
  { name: "active", type: "boolean", required: false, defaultValue: "false", description: "Active highlight state" },
  { name: "dimmed", type: "boolean", required: false, defaultValue: "false", description: "Dimmed/disabled state" },
  { name: "duration", type: "number", required: false, defaultValue: "200", description: "Animation duration in ms" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

const USAGE = `import { CollapsibleGroup } from "@/registry/new-york/collapsible-group/collapsible-group"

const [open, setOpen] = useState(false)

<CollapsibleGroup
  label="Advanced Settings"
  open={open}
  onToggle={() => setOpen(!open)}
>
  <div className="py-2 space-y-2">
    <p>Content here</p>
  </div>
</CollapsibleGroup>

{/* With icon and active state */}
<CollapsibleGroup
  label="Configuration"
  icon={<Settings className="size-3.5" />}
  open={open}
  active
  onToggle={() => setOpen(!open)}
>
  <div className="py-2">...</div>
</CollapsibleGroup>`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Collapsible Group",
  description:
    "Accordion-style collapsible section with smooth grid-row animation. Uses CSS grid-template-rows for height transitions without DOM measurement.",
  tags: ["accordion", "collapsible", "animation", "interactive"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <CollapsibleGroup
      {...fixture}
      icon={<Settings className="size-3.5" />}
      onToggle={() => {}}
    >
      <div className="py-2 pl-5 space-y-1.5">
        <p className="text-sm text-muted-foreground">This is the collapsible content area.</p>
        <p className="text-sm text-muted-foreground">It expands smoothly using grid-row animation.</p>
        <p className="text-xs text-muted-foreground/60">No JavaScript height measurement needed.</p>
      </div>
    </CollapsibleGroup>
  ),
  propsMeta,
};
