"use client";

import { ProfileEditor } from "@/registry/new-york/profile-editor/profile-editor";
import {
  ALL_FIXTURES,
  type ProfileEditorFixture,
} from "@/fixtures/profile-editor.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = ProfileEditorFixture;

const propsMeta: PropMeta[] = [
  { name: "displayName", type: "string", required: true, description: "Display name shown prominently" },
  { name: "avatarUrl", type: "string | null", required: false, description: "URL of the avatar image. Falls back to initials" },
  { name: "username", type: "string", required: false, description: "Username or handle" },
  { name: "bio", type: "string", required: false, description: "Short bio or tagline" },
  { name: "status", type: '"online" | "away" | "busy" | "offline"', required: false, defaultValue: '"offline"', description: "Current online status indicator" },
  { name: "compact", type: "boolean", required: false, defaultValue: "false", description: "Compact layout (settings) vs full layout (onboarding)" },
  { name: "editing", type: "boolean", required: false, defaultValue: "false", description: "Whether the profile fields are editable" },
  { name: "saveState", type: '"idle" | "saving" | "saved" | "error"', required: false, defaultValue: '"idle"', description: "Current save state" },
  { name: "saveError", type: "string | null", required: false, description: "Error message when saveState is error" },
  { name: "isDirty", type: "boolean", required: false, defaultValue: "false", description: "Whether any field has unsaved changes" },
  { name: "validationErrors", type: "ProfileValidationErrors", required: false, description: "Field validation errors to display inline" },
  { name: "onDisplayNameChange", type: "(value: string) => void", required: false, description: "Called when display name changes" },
  { name: "onBioChange", type: "(value: string) => void", required: false, description: "Called when bio changes" },
  { name: "onAvatarClick", type: "() => void", required: false, description: "Called when avatar is clicked" },
  { name: "onAvatarUpload", type: "(file: File) => void", required: false, description: "Called when a file is selected for avatar upload" },
  { name: "onSave", type: "() => void", required: false, description: "Called when save is clicked" },
  { name: "onCancel", type: "() => void", required: false, description: "Called when cancel is clicked" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

const USAGE = `import { ProfileEditor } from "@/registry/new-york/profile-editor/profile-editor"

{/* View mode */}
<ProfileEditor
  displayName="Alice Smith"
  username="@alice"
  bio="Building the future"
  status="online"
  avatarUrl="/avatar.png"
/>

{/* Edit mode with save/cancel */}
<ProfileEditor
  displayName={name}
  bio={bio}
  editing
  isDirty={isDirty}
  saveState={saveState}
  onDisplayNameChange={setName}
  onBioChange={setBio}
  onAvatarUpload={handleUpload}
  onSave={handleSave}
  onCancel={handleCancel}
/>

{/* Compact layout for settings pages */}
<ProfileEditor compact editing {...props} />`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Profile Editor",
  description:
    "Profile editor card with avatar, status indicator, editable fields, and save/cancel actions. Supports compact (settings) and full (onboarding) layouts.",
  tags: ["profile", "avatar", "editor", "form", "interactive"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture, Variant) => {
    const props = {
      ...fixture,
      onDisplayNameChange: fixture.editing ? () => {} : undefined,
      onBioChange: fixture.editing ? () => {} : undefined,
      onSave: fixture.editing ? () => {} : undefined,
      onCancel: fixture.editing ? () => {} : undefined,
    };
    if (Variant) return <Variant {...props} />;
    return <ProfileEditor {...props} />;
  },
  variants: [
    {
      name: "Full (Onboarding)",
      component: ((props: Fixture) => (
        <ProfileEditor
          {...props}
          compact={false}
          onDisplayNameChange={() => {}}
          onBioChange={() => {}}
          onSave={() => {}}
          onCancel={() => {}}
        />
      )) as React.ComponentType<Fixture>,
      description: "Centered card layout for onboarding or standalone use.",
    },
    {
      name: "Compact (Settings)",
      component: ((props: Fixture) => (
        <ProfileEditor
          {...props}
          compact
          onDisplayNameChange={() => {}}
          onBioChange={() => {}}
          onSave={() => {}}
          onCancel={() => {}}
        />
      )) as React.ComponentType<Fixture>,
      description: "Inline layout for settings pages.",
    },
  ],
  propsMeta,
};
