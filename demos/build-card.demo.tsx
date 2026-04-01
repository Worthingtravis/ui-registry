import { BuildCard } from "@/registry/new-york/build-card/build-card";
import {
  ALL_FIXTURES,
  type BuildCardFixture,
} from "@/fixtures/build-card.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = BuildCardFixture;

const propsMeta: PropMeta[] = [
  { name: "builds", type: "CreatorBuildData[]", required: true, description: "Array of character builds to display" },
  { name: "isOwner", type: "boolean", required: true, description: "Whether the viewer is the owner — affects empty state message" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes for the root container" },
];

const USAGE = `import { BuildCard } from "@/registry/new-york/build-card/build-card"

<BuildCard
  builds={[{
    id: "1",
    game: "dbd",
    title: "Main Killer — Springtrap",
    role: "killer",
    characterImageUrl: null,
    description: null,
    items: [
      { id: "i1", slot: "perk-1", label: "Corrupt Intervention", imageUrl: null, description: "Blocks 3 furthest gens for 120s" },
      { id: "i2", slot: "perk-2", label: "Pop Goes the Weasel", imageUrl: null, description: "Kick gen for 25% regression" },
      { id: "i3", slot: "perk-3", label: "BBQ & Chilli", imageUrl: null, description: "See auras after hooking" },
      { id: "i4", slot: "perk-4", label: "Lethal Pursuer", imageUrl: null, description: "See survivors at start" },
    ],
  }]}
  isOwner={false}
/>

{/* Items: slot names starting with "perk" (up to 4) shown first, then "addon" (up to 2) */}
{/* Hover any item slot to see its description tooltip */}
{/* role="killer" → red badge, role="survivor" → green badge */}`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Build Card",
  description:
    "Character build cards with a large character image, role badge (killer/survivor), item slot grid with hover tooltips, and optional description.",
  tags: ["build", "loadout", "game", "creator", "grid"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="w-full max-w-3xl">
      <BuildCard {...fixture} />
    </div>
  ),
  propsMeta,
};
