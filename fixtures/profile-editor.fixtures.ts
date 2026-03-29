import type { ProfileEditorProps } from "@/registry/new-york/profile-editor/profile-editor";

export type ProfileEditorFixture = Omit<
  ProfileEditorProps,
  "className" | "onDisplayNameChange" | "onBioChange" | "onAvatarClick" | "onAvatarUpload" | "onSave" | "onCancel"
>;
type Fixture = ProfileEditorFixture;

const BASE: Fixture = {
  displayName: "",
  avatarUrl: null,
  username: "",
  bio: "",
  status: "offline",
  compact: false,
  editing: true,
  saveState: "idle",
  saveError: null,
  isDirty: false,
  validationErrors: {},
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "New Profile (Onboarding)": BASE,

  "New Profile (Compact)": fx({
    compact: true,
  }),

  "Existing Profile": fx({
    displayName: "Alice Smith",
    username: "@alice",
    bio: "Designer & developer. Building the future one pixel at a time.",
    status: "online",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=alice",
    compact: true,
    editing: false,
  }),

  "Existing + Custom Avatar": fx({
    displayName: "Bob Creator",
    username: "@bob",
    bio: "Open source enthusiast",
    status: "away",
    avatarUrl: "https://api.dicebear.com/9.x/pixel-art/svg?seed=bob-custom",
    compact: true,
    editing: false,
  }),

  "Editing (Dirty)": fx({
    displayName: "Alice Updated",
    username: "@alice",
    bio: "Updated bio text",
    status: "online",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=alice",
    isDirty: true,
    compact: true,
  }),

  Saving: fx({
    displayName: "Alice Updated",
    username: "@alice",
    bio: "Updated bio text",
    status: "online",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=alice",
    saveState: "saving",
    isDirty: true,
    compact: true,
  }),

  "Save Success": fx({
    displayName: "Alice Updated",
    username: "@alice",
    bio: "Updated bio text",
    status: "online",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=alice",
    saveState: "saved",
    isDirty: false,
    compact: true,
  }),

  "Name Too Long": fx({
    displayName: "A".repeat(55),
    status: "offline",
    validationErrors: { displayName: "Name must be 50 characters or less" },
    isDirty: true,
    compact: true,
  }),

  "Network Error": fx({
    displayName: "Alice Smith",
    username: "@alice",
    bio: "Designer & developer",
    status: "online",
    avatarUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=alice",
    saveState: "error",
    saveError: "Failed to save profile. Please try again.",
    isDirty: true,
    compact: true,
  }),

  "No Avatar (Initials)": fx({
    displayName: "Travis Worthing",
    username: "@laughingwhales",
    bio: "Building cool things",
    status: "busy",
    avatarUrl: null,
    compact: false,
    editing: false,
  }),

  "View Mode (Full)": fx({
    displayName: "Travis Worthing",
    username: "@laughingwhales",
    bio: "Building cool things on the internet. Mostly TypeScript and React.",
    status: "online",
    avatarUrl: "https://api.dicebear.com/9.x/bottts/svg?seed=travis",
    compact: false,
    editing: false,
  }),
};
