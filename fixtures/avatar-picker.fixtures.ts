import type { AvatarPickerProps } from "@/registry/new-york/avatar-picker/avatar-picker";

export type AvatarPickerFixture = Omit<
  AvatarPickerProps,
  "className" | "onSelect" | "onUpload" | "onRemoveUpload"
>;
type Fixture = AvatarPickerFixture;

const BASE: Fixture = {
  currentSeed: "pixel-art:default-seed",
  currentAvatarUrl: null,
  subject: "demo",
  gridCount: 20,
  columns: 5,
  allowUpload: true,
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Default (Pixel Art)": BASE,

  "Adventurer Style": fx({
    currentSeed: "adventurer:alice-seed",
    subject: "alice",
  }),

  "Robots Style": fx({
    currentSeed: "bottts-neutral:robot-42",
    subject: "robot",
  }),

  "With Uploaded Avatar": fx({
    currentSeed: "pixel-art:bob-seed",
    currentAvatarUrl: "https://api.dicebear.com/9.x/thumbs/svg?seed=uploaded",
  }),

  "No Upload Allowed": fx({
    allowUpload: false,
    subject: "onboarding",
  }),

  "Compact Grid (3 cols)": fx({
    gridCount: 12,
    columns: 3,
    subject: "mobile",
  }),

  "Large Grid (6 cols)": fx({
    gridCount: 24,
    columns: 6,
    subject: "gallery",
  }),
};
