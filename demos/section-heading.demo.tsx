"use client";

import { SectionHeading } from "@/registry/new-york/section-heading/section-heading";
import {
  ALL_FIXTURES,
  type SectionHeadingFixture,
} from "@/fixtures/section-heading.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = SectionHeadingFixture;

const HEADING_TEXT: Record<string, string> = {
  "getting-started": "Getting Started",
  "introduction": "Introduction",
  "api-reference": "API Reference",
  "configuration": "Configuration",
  "frequently-asked-questions-and-troubleshooting-guide": "Frequently Asked Questions & Troubleshooting Guide",
};

const propsMeta: PropMeta[] = [
  { name: "id", type: "string", required: true, description: "Anchor ID for the heading (auto-slugified)" },
  { name: "children", type: "ReactNode", required: true, description: "Heading content" },
  { name: "as", type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6"', required: false, defaultValue: '"h2"', description: "HTML heading level" },
  { name: "scrollMargin", type: "number", required: false, defaultValue: "96", description: "Scroll margin offset in pixels" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

const USAGE = `import { SectionHeading } from "@/registry/new-york/section-heading/section-heading"

<SectionHeading id="installation">
  Installation
</SectionHeading>

<SectionHeading id="api-reference" as="h3" scrollMargin={80}>
  API Reference
</SectionHeading>

{/* Click the heading to copy the URL with #anchor */}`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Section Heading",
  description:
    "Heading with auto-generated anchor link. Click to copy the section URL. The # symbol appears on hover, positioned on whichever side has more space.",
  tags: ["heading", "anchor", "navigation", "documentation"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => {
    const text = HEADING_TEXT[fixture.id] ?? fixture.id;
    return (
      <div className="px-8 py-4">
        <SectionHeading {...fixture} className="text-2xl font-bold tracking-tight">
          {text}
        </SectionHeading>
        <p className="mt-2 text-sm text-muted-foreground">
          Hover the heading to see the anchor link. Click to copy the URL.
        </p>
      </div>
    );
  },
  propsMeta,
};
