import type { BuildCardProps, CreatorBuildData } from "@/registry/new-york/build-card/build-card";

export type BuildCardFixture = BuildCardProps;
type Fixture = BuildCardFixture;

const SPRINGTRAP: CreatorBuildData = {
  id: "b1", game: "dbd", title: "Main Killer — Springtrap", role: "killer",
  characterImageUrl: null,
  description: null,
  items: [
    { id: "bi1", slot: "perk-1", perkId: "corrupt-intervention", label: "Corrupt Intervention", imageUrl: null, description: "Blocks 3 furthest gens for 120s" },
    { id: "bi2", slot: "perk-2", perkId: "pop-goes-the-weasel", label: "Pop Goes the Weasel", imageUrl: null, description: "Kick gen for 25% regression" },
    { id: "bi3", slot: "perk-3", perkId: "barbecue-and-chilli", label: "Barbecue & Chilli", imageUrl: null, description: "See auras after hooking" },
    { id: "bi4", slot: "perk-4", perkId: "lethal-pursuer", label: "Lethal Pursuer", imageUrl: null, description: "See survivors at start" },
  ],
};

const SABLE: CreatorBuildData = {
  id: "b2", game: "dbd", title: "Main Survivor — Sable", role: "survivor",
  characterImageUrl: null,
  description: null,
  items: [
    { id: "bi5", slot: "perk-1", perkId: "windows-of-opportunity", label: "Windows of Opportunity", imageUrl: null, description: "See pallets and vaults" },
    { id: "bi6", slot: "perk-2", perkId: "sprint-burst", label: "Sprint Burst", imageUrl: null, description: "Burst of speed when running" },
    { id: "bi7", slot: "perk-3", perkId: "iron-will", label: "Iron Will", imageUrl: null, description: "Reduce grunts of pain" },
    { id: "bi8", slot: "perk-4", perkId: "adrenaline", label: "Adrenaline", imageUrl: null, description: "Heal + speed on last gen" },
  ],
};

const EMPTY_BUILD: CreatorBuildData = {
  id: "b3", game: "dbd", title: "Experimental Build", role: "killer",
  characterImageUrl: null, description: "Still testing this one out", items: [],
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  builds: [SPRINGTRAP, SABLE],
  isOwner: true,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Owner (2 builds)": fx(),
  "Viewer (read-only)": fx({ isOwner: false }),
  "Single Build": fx({ builds: [SPRINGTRAP] }),
  "No Perks Yet": fx({ builds: [EMPTY_BUILD] }),
  "Empty — Add Build": fx({ builds: [] }),
};
