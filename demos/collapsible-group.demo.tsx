"use client";

import { useState } from "react";
import { CollapsibleGroup } from "@/registry/new-york/collapsible-group/collapsible-group";
import {
  ALL_FIXTURES,
  type CollapsibleGroupFixture,
} from "@/fixtures/collapsible-group.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";
import { Settings, Palette, Zap } from "lucide-react";

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

function InteractiveDemo({ fixture }: { fixture: Fixture }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    settings: fixture.open,
    appearance: false,
    performance: false,
  });

  const toggle = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="w-full max-w-sm space-y-1">
      <CollapsibleGroup
        {...fixture}
        label="Settings"
        icon={<Settings className="size-3.5" />}
        open={openSections.settings ?? false}
        onToggle={() => toggle("settings")}
        active={openSections.settings}
      >
        <div className="py-2 pl-5 space-y-1">
          <p className="text-sm text-muted-foreground">Notifications: On</p>
          <p className="text-sm text-muted-foreground">Language: English</p>
          <p className="text-sm text-muted-foreground">Timezone: UTC-5</p>
        </div>
      </CollapsibleGroup>

      <CollapsibleGroup
        label="Appearance"
        icon={<Palette className="size-3.5" />}
        open={openSections.appearance ?? false}
        onToggle={() => toggle("appearance")}
        active={openSections.appearance}
        dimmed={fixture.dimmed}
        duration={fixture.duration}
      >
        <div className="py-2 pl-5 space-y-1">
          <p className="text-sm text-muted-foreground">Theme: Dark</p>
          <p className="text-sm text-muted-foreground">Font size: 14px</p>
          <p className="text-sm text-muted-foreground">Compact mode: Off</p>
        </div>
      </CollapsibleGroup>

      <CollapsibleGroup
        label="Performance"
        icon={<Zap className="size-3.5" />}
        open={openSections.performance ?? false}
        onToggle={() => toggle("performance")}
        active={openSections.performance}
        dimmed={fixture.dimmed}
        duration={fixture.duration}
      >
        <div className="py-2 pl-5 space-y-1">
          <p className="text-sm text-muted-foreground">Cache: Enabled</p>
          <p className="text-sm text-muted-foreground">Prefetch: On</p>
        </div>
      </CollapsibleGroup>
    </div>
  );
}

export const config: PreviewLabConfig<Fixture> = {
  title: "Collapsible Group",
  description:
    "Accordion-style collapsible section with smooth grid-row animation. Uses CSS grid-template-rows for height transitions without DOM measurement.",
  tags: ["accordion", "collapsible", "animation", "interactive"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => <InteractiveDemo fixture={fixture} />,
  propsMeta,
};
