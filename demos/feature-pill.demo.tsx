"use client";

import { FeaturePill } from "@/registry/new-york/feature-pill/feature-pill";
import {
  ALL_FIXTURES,
  type FeaturePillFixture,
} from "@/fixtures/feature-pill.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = FeaturePillFixture;

const propsMeta: PropMeta[] = [
  { name: "label", type: "string", required: true, description: "Text displayed inside the pill" },
  { name: "href", type: "string", required: false, description: "Navigation URL — makes the pill clickable" },
  { name: "variant", type: '"default" | "primary" | "success" | "destructive" | "outline"', required: false, defaultValue: '"default"', description: "Visual variant" },
  { name: "renderLink", type: "(props) => ReactNode", required: false, description: "Custom link renderer for framework routing" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

const USAGE = `import { FeaturePill } from "@/registry/new-york/feature-pill/feature-pill"

{/* Static labels */}
<FeaturePill label="New" variant="primary" />
<FeaturePill label="Stable" variant="success" />
<FeaturePill label="Beta" variant="outline" />

{/* Clickable with Next.js Link */}
<FeaturePill
  label="Docs"
  href="/docs"
  renderLink={({ href, className, children }) => (
    <Link href={href} className={className}>{children}</Link>
  )}
/>

{/* Row of feature tags */}
<div className="flex flex-wrap gap-1.5">
  {features.map(f => <FeaturePill key={f} label={f} />)}
</div>`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Feature Pill",
  description:
    "Small rounded pill badge for feature labels, tags, or categories. Supports static and clickable variants with multiple color options.",
  tags: ["badge", "pill", "tag", "label"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <FeaturePill {...fixture} />
      <FeaturePill label="React" variant="primary" />
      <FeaturePill label="TypeScript" variant="success" />
      <FeaturePill label="Tailwind" variant="outline" />
      <FeaturePill label="shadcn" />
    </div>
  ),
  propsMeta,
};
