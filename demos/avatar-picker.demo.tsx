"use client";

import { AvatarPicker } from "@/registry/new-york/avatar-picker/avatar-picker";
import {
  ALL_FIXTURES,
  type AvatarPickerFixture,
} from "@/fixtures/avatar-picker.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = AvatarPickerFixture;

const propsMeta: PropMeta[] = [
  { name: "currentSeed", type: "string", required: true, description: 'Encoded seed (e.g. "pixel-art:my-seed")' },
  { name: "currentAvatarUrl", type: "string | null", required: false, description: "URL of a custom-uploaded avatar" },
  { name: "subject", type: "string", required: false, defaultValue: '"avatar"', description: "Base subject for generating seed batches" },
  { name: "gridCount", type: "number", required: false, defaultValue: "20", description: "Number of avatars per batch" },
  { name: "columns", type: "number", required: false, defaultValue: "5", description: "Number of grid columns" },
  { name: "allowUpload", type: "boolean", required: false, defaultValue: "true", description: "Whether to show the upload tab" },
  { name: "onSelect", type: "(encodedSeed: string) => void", required: false, description: "Called immediately when an avatar is clicked" },
  { name: "onUpload", type: "(file: File) => void", required: false, description: "Called when a file is selected for upload" },
  { name: "onRemoveUpload", type: "() => void", required: false, description: "Called when the uploaded avatar is removed" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes" },
];

const USAGE = `import { AvatarPicker } from "@/registry/new-york/avatar-picker/avatar-picker"

<AvatarPicker
  currentSeed="pixel-art:my-seed"
  subject="username"
  onSelect={(seed) => setSeed(seed)}
  onUpload={(file) => uploadAvatar(file)}
  onRemoveUpload={() => removeAvatar()}
/>

{/* Without upload tab */}
<AvatarPicker
  currentSeed={seed}
  subject="onboarding"
  allowUpload={false}
  onSelect={setSeed}
/>

{/* Compact grid for mobile */}
<AvatarPicker
  currentSeed={seed}
  gridCount={12}
  columns={3}
  onSelect={setSeed}
/>`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Avatar Picker",
  description:
    "Avatar picker with DiceBear generated avatars (8 styles), paginated grid, custom seed input, and drag-and-drop file upload.",
  tags: ["avatar", "picker", "dicebear", "upload", "interactive"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <AvatarPicker
      {...fixture}
      onSelect={() => {}}
      onUpload={() => {}}
      onRemoveUpload={() => {}}
    />
  ),
  propsMeta,
};
