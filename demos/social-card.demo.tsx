import { SocialCard } from "@/registry/new-york/social-card/social-card";
import {
  ALL_FIXTURES,
  type SocialCardFixture,
} from "@/fixtures/social-card.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = SocialCardFixture;

const propsMeta: PropMeta[] = [
  { name: "socials", type: "CreatorSocialData[]", required: true, description: "Array of social platform links to display" },
  { name: "isOwner", type: "boolean", required: true, description: "Whether the viewer is the owner — affects empty state message" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes for the root container" },
];

const USAGE = `import { SocialCard } from "@/registry/new-york/social-card/social-card"

<SocialCard
  socials={[
    { id: "1", platform: "twitch", url: "https://twitch.tv/me", description: "I stream DBD!" },
    { id: "2", platform: "youtube", url: "https://youtube.com/@me", description: null },
    { id: "3", platform: "discord", url: "https://discord.gg/abc", description: "Join my community" },
  ]}
  isOwner={false}
/>

{/* Supported platforms with distinct icons + colors */}
{/* twitch | youtube | tiktok | instagram | discord | twitter | kick | threads */}
{/* Any other platform falls back to a generic link icon */}`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Social Card",
  description:
    "Grid of social platform cards with inline SVG icons, platform name, description, and external link. Supports 8 named platforms with a generic link icon fallback.",
  tags: ["social", "links", "grid", "creator"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="w-full">
      <SocialCard {...fixture} />
    </div>
  ),
  propsMeta,
};
