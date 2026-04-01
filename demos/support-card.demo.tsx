"use client";

import { SupportCard } from "@/registry/new-york/support-card/support-card";
import {
  ALL_FIXTURES,
  type SupportCardFixture,
} from "@/fixtures/support-card.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = SupportCardFixture;

const propsMeta: PropMeta[] = [
  { name: "links", type: "CreatorSupportData[]", required: true, description: "Array of support links to display" },
  { name: "isOwner", type: "boolean", required: true, description: "Whether the viewer is the owner — affects empty state message" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes for the root container" },
];

const USAGE = `import { SupportCard } from "@/registry/new-york/support-card/support-card"

<SupportCard
  links={[
    { id: "1", type: "creator-code", label: "Dead by Daylight", url: null, code: "MYCREATOR", description: "Official creator", imageUrl: null },
    { id: "2", type: "donation", label: "Streamlabs", url: "https://streamlabs.com/me/tip", code: null, description: null, imageUrl: null },
    { id: "3", type: "affiliate", label: "G-FUEL", url: "https://gfuel.com/me", code: null, description: "Use my link!", imageUrl: null },
    { id: "4", type: "merch", label: "My Merch Store", url: "https://redbubble.com/me", code: null, description: null, imageUrl: null },
  ]}
  isOwner={false}
/>

{/* Card type determines icon + color: */}
{/* creator-code → code icon + copy button */}
{/* donation → heart icon */}
{/* affiliate → link icon */}
{/* merch → shopping bag icon */}`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Support Card",
  description:
    "Grid of support cards grouped by type. Donation cards show a heart icon, affiliate cards show a link, merch shows a shopping bag, and creator-code cards display the code with a click-to-copy button.",
  tags: ["support", "creator", "copy", "grid", "links"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="w-full max-w-2xl">
      <SupportCard {...fixture} />
    </div>
  ),
  propsMeta,
};
