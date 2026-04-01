"use client";

import { GuideTabs } from "@/registry/new-york/guide-tabs/guide-tabs";
import {
  ALL_FIXTURES,
  type GuideTabsFixture,
} from "@/fixtures/guide-tabs.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = GuideTabsFixture;

const propsMeta: PropMeta[] = [
  { name: "categories", type: "CreatorGuideCategoryData[]", required: true, description: "Guide categories, each with a list of video links" },
  { name: "introText", type: "string | null", required: true, description: "Optional intro text shown above the tabs" },
  { name: "isOwner", type: "boolean", required: true, description: "Whether the viewer is the owner — affects empty state message" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes for the root container" },
];

const USAGE = `import { GuideTabs } from "@/registry/new-york/guide-tabs/guide-tabs"

<GuideTabs
  introText="My guide collection for Dead by Daylight."
  categories={[
    {
      id: "cat1",
      title: "Killer Guides",
      description: null,
      links: [
        {
          id: "gl1",
          title: "How to Master Springtrap",
          url: "https://youtube.com/shorts/T7ENojVqurg",
          thumbnailUrl: "https://i.ytimg.com/vi/T7ENojVqurg/maxresdefault.jpg",
          description: null,
        },
      ],
    },
  ]}
  isOwner={false}
/>

{/* Active tab persists in component state */}
{/* 16:9 thumbnails with hover play overlay */}
{/* Category tab shows item count next to title */}`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Guide Tabs",
  description:
    "Tabbed guide viewer with optional intro text, category tabs, and a responsive video card grid with 16:9 thumbnails and hover play overlay.",
  tags: ["tabs", "video", "guides", "creator", "interactive"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="w-full">
      <GuideTabs {...fixture} />
    </div>
  ),
  propsMeta,
};
