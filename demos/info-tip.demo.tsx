"use client";

import { InfoTip } from "@/registry/new-york/info-tip/info-tip";
import { ALL_FIXTURES, type InfoTipFixture } from "@/fixtures/info-tip.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = InfoTipFixture;

const propsMeta: PropMeta[] = [
  { name: "children", type: "ReactNode", required: true, description: "Content shown in the tooltip" },
  { name: "side", type: '"top" | "bottom" | "left" | "right"', required: false, defaultValue: '"top"', description: "Placement of the tooltip" },
  { name: "maxWidth", type: "number", required: false, defaultValue: "256", description: "Maximum width in pixels" },
  { name: "iconSize", type: "number", required: false, defaultValue: "14", description: "Size of the info icon in pixels" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes for the trigger" },
];

const USAGE = `import { InfoTip } from "@/registry/new-york/info-tip/info-tip"

<label>
  API Key <InfoTip>Required for authentication.</InfoTip>
</label>

<InfoTip side="right" maxWidth={300}>
  <p>Supports <strong>rich content</strong> including links.</p>
</InfoTip>`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Info Tip",
  description:
    "Info icon that shows a tooltip on hover (desktop) and toggles on tap (mobile). Self-contained with no external tooltip library.",
  tags: ["tooltip", "info", "help", "interactive"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="flex items-center justify-center py-12">
      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
        API Key
        <InfoTip {...fixture}>
          Required for authentication. Generate one from your dashboard settings.
        </InfoTip>
      </span>
    </div>
  ),
  propsMeta,
};
