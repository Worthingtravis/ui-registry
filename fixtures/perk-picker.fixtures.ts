import type { PerkPickerProps, SelectedPerk, Perk } from "@/registry/new-york/perk-picker/perk-picker";
import perksData from "@/registry/new-york/perk-picker/perks.json";

const ALL_PERKS = perksData as Perk[];

export type PerkPickerFixture = Omit<PerkPickerProps, "onChange">;
type Fixture = PerkPickerFixture;

// Grab some well-known perks for fixtures
const find = (name: string) => ALL_PERKS.find((p) => p.name === name)!;

const CORRUPT = find("Corrupt Intervention");
const POP = find("Pop Goes the Weasel");
const BBQ = find("BBQ & Chilli");
const LETHAL = find("Lethal Pursuer");
const WINDOWS = find("Windows of Opportunity");
const SPRINT = find("Sprint Burst");
const IRON_WILL = find("Iron Will");
const ADRENALINE = find("Adrenaline");

const KILLER_BUILD: SelectedPerk[] = [
  { slot: 0, perk: CORRUPT },
  { slot: 1, perk: POP },
  { slot: 2, perk: BBQ },
  { slot: 3, perk: LETHAL },
];

const SURVIVOR_BUILD: SelectedPerk[] = [
  { slot: 0, perk: WINDOWS },
  { slot: 1, perk: SPRINT },
  { slot: 2, perk: IRON_WILL },
  { slot: 3, perk: ADRENALINE },
];

const PARTIAL_BUILD: SelectedPerk[] = [
  { slot: 0, perk: CORRUPT },
  { slot: 2, perk: BBQ },
];

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  value: [],
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Empty": fx(),
  "Killer Build (Full)": fx({ value: KILLER_BUILD, role: "killer" }),
  "Survivor Build (Full)": fx({ value: SURVIVOR_BUILD, role: "survivor" }),
  "Partial Build": fx({ value: PARTIAL_BUILD }),
  "Locked to Killer": fx({ role: "killer" }),
  "Locked to Survivor": fx({ role: "survivor" }),
};
