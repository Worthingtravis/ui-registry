"use client";

import React, { useState } from "react";
import { PerkPicker, type SelectedPerk } from "@/registry/new-york/perk-picker/perk-picker";
import { ALL_FIXTURES, type PerkPickerFixture } from "@/fixtures/perk-picker.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = PerkPickerFixture;

const propsMeta: PropMeta[] = [
  { name: "value", type: "SelectedPerk[]", required: true, description: "Currently selected perks (up to maxSlots)" },
  { name: "onChange", type: "(perks: SelectedPerk[]) => void", required: true, description: "Called when selection changes" },
  { name: "role", type: '"killer" | "survivor"', required: false, description: "Lock to a specific role — hides role filter" },
  { name: "maxSlots", type: "number", required: false, defaultValue: "4", description: "Maximum perk slots" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

const USAGE = `import { PerkPicker, type SelectedPerk } from "@/registry/new-york/perk-picker/perk-picker"

const [perks, setPerks] = useState<SelectedPerk[]>([]);

<PerkPicker
  value={perks}
  onChange={setPerks}
  role="killer"
  maxSlots={4}
/>`;

function PerkPickerWrapper({ fixture }: { fixture: Fixture }) {
  const [value, setValue] = useState<SelectedPerk[]>(fixture.value);

  return (
    <div className="w-full">
      <PerkPicker
        value={value}
        onChange={setValue}
        role={fixture.role}
        maxSlots={fixture.maxSlots}
      />
    </div>
  );
}

export const config: PreviewLabConfig<Fixture> = {
  title: "Perk Picker",
  description:
    "Searchable perk selector for Dead by Daylight builds. Filter by role (killer/survivor), search by name or character, and select up to 4 perks with icon previews.",
  tags: ["picker", "game", "build", "dbd", "interactive"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => <PerkPickerWrapper fixture={fixture} />,
  propsMeta,
};
