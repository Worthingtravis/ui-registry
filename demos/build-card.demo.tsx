"use client";

import React, { useState, useCallback } from "react";
import { BuildCard, type CreatorBuildData } from "@/registry/new-york/build-card/build-card";
import type { SelectedPerk } from "@/registry/new-york/perk-picker/perk-picker";
import {
  ALL_FIXTURES,
  type BuildCardFixture,
} from "@/fixtures/build-card.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = BuildCardFixture;

const propsMeta: PropMeta[] = [
  { name: "builds", type: "CreatorBuildData[]", required: true, description: "Array of character builds to display" },
  { name: "isOwner", type: "boolean", required: true, description: "Whether the viewer is the owner — enables perk editing" },
  { name: "onPerksChange", type: "(buildId, perks) => void", required: false, description: "Called when perks are updated via the picker dialog" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes for the root container" },
];

const USAGE = `import { BuildCard } from "@/registry/new-york/build-card/build-card"
import type { SelectedPerk } from "@/registry/new-york/perk-picker/perk-picker"

function MyBuilds() {
  const [builds, setBuilds] = useState(initialBuilds);

  const handlePerksChange = (buildId: string, perks: SelectedPerk[]) => {
    setBuilds(prev => prev.map(b =>
      b.id === buildId
        ? { ...b, items: perks.map((p, i) => ({
            id: \`perk-\${i}\`,
            slot: \`perk-\${i + 1}\`,
            label: p.perk.name,
            imageUrl: p.perk.iconFile ? \`/dbd-perks/icons/\${p.perk.iconFile}\` : null,
            description: p.perk.description,
          }))}
        : b
    ));
  };

  return (
    <BuildCard
      builds={builds}
      isOwner={true}
      onPerksChange={handlePerksChange}
    />
  );
}`;

function BuildCardDemo({ fixture }: { fixture: Fixture }) {
  const [builds, setBuilds] = useState<CreatorBuildData[]>(fixture.builds);

  // Reset builds when fixture changes
  React.useEffect(() => {
    setBuilds(fixture.builds);
  }, [fixture.builds]);

  const handlePerksChange = useCallback((buildId: string, perks: SelectedPerk[]) => {
    setBuilds((prev) =>
      prev.map((b) =>
        b.id === buildId
          ? {
              ...b,
              items: [
                // Replace perks
                ...perks.map((p, i) => ({
                  id: `perk-new-${i}`,
                  slot: `perk-${i + 1}`,
                  perkId: p.perk.id,
                  label: p.perk.name,
                  imageUrl: p.perk.iconFile
                    ? `/dbd-perks/icons/${decodeURIComponent(p.perk.iconFile)}`
                    : null,
                  description: p.perk.description,
                })),
                // Keep non-perk items
                ...b.items.filter((item) => !item.slot.startsWith("perk")),
              ],
            }
          : b,
      ),
    );
  }, []);

  const handleAddBuild = useCallback((role: "killer" | "survivor") => {
    const newBuild: CreatorBuildData = {
      id: `new-${Date.now()}`,
      game: "dbd",
      title: `New ${role.charAt(0).toUpperCase() + role.slice(1)} Build`,
      role,
      characterImageUrl: null,
      description: null,
      items: [],
    };
    setBuilds((prev) => [...prev, newBuild]);
  }, []);

  return (
    <div className="w-full">
      <BuildCard
        builds={builds}
        isOwner={fixture.isOwner}
        onPerksChange={handlePerksChange}
        onAddBuild={handleAddBuild}
      />
    </div>
  );
}

export const config: PreviewLabConfig<Fixture> = {
  title: "Build Card",
  description:
    "Character build cards with a large character image, role badge (killer/survivor), item slot grid with hover tooltips, and optional description. When isOwner is true, perk slots are interactive — click to open the perk picker dialog.",
  tags: ["build", "loadout", "game", "creator", "grid"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => <BuildCardDemo fixture={fixture} />,
  propsMeta,
};
