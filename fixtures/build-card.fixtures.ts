import type { BuildCardProps, CreatorBuildData } from "@/registry/new-york/build-card/build-card";

export type BuildCardFixture = BuildCardProps;
type Fixture = BuildCardFixture;

const SPRINGTRAP: CreatorBuildData = {
  id: "b1", game: "dbd", title: "Main Killer — Springtrap", role: "killer",
  characterImageUrl: null,
  description: null,
  items: [
    { id: "bi1", slot: "perk-1", label: "Corrupt Intervention", imageUrl: null, description: "Blocks 3 furthest gens for 120s" },
    { id: "bi2", slot: "perk-2", label: "Pop Goes the Weasel", imageUrl: null, description: "Kick gen for 25% regression" },
    { id: "bi3", slot: "perk-3", label: "BBQ & Chilli", imageUrl: null, description: "See auras after hooking" },
    { id: "bi4", slot: "perk-4", label: "Lethal Pursuer", imageUrl: null, description: "See survivors at start" },
  ],
};

const SABLE: CreatorBuildData = {
  id: "b2", game: "dbd", title: "Main Survivor — Sable", role: "survivor",
  characterImageUrl: null,
  description: null,
  items: [
    { id: "bi5", slot: "perk-1", label: "Windows of Opportunity", imageUrl: null, description: "See pallets and vaults" },
    { id: "bi6", slot: "perk-2", label: "Sprint Burst", imageUrl: null, description: "Burst of speed when running" },
    { id: "bi7", slot: "perk-3", label: "Iron Will", imageUrl: null, description: "Reduce grunts of pain" },
    { id: "bi8", slot: "perk-4", label: "Adrenaline", imageUrl: null, description: "Heal + speed on last gen" },
  ],
};

const EMPTY_BUILD: CreatorBuildData = {
  id: "b3", game: "dbd", title: "Experimental Build", role: "killer",
  characterImageUrl: null, description: "Still testing this one out", items: [],
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  builds: [SPRINGTRAP, SABLE],
  isOwner: false,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Public (2 builds)": fx(),
  "Owner": fx({ isOwner: true }),
  "Empty — Public": fx({ builds: [] }),
  "Empty — Owner": fx({ builds: [], isOwner: true }),
  "Single Build": fx({ builds: [SPRINGTRAP] }),
  "Build Without Items": fx({ builds: [EMPTY_BUILD] }),
};
