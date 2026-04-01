import { CreatorCard } from "@/registry/new-york/creator-card/creator-card";
import {
  ALL_FIXTURES,
  type CreatorCardFixture,
} from "@/fixtures/creator-card.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = CreatorCardFixture;

const propsMeta: PropMeta[] = [
  { name: "recommendations", type: "CreatorRecommendationData[]", required: true, description: "Array of recommended creators" },
  { name: "introText", type: "string | null", required: true, description: "Optional intro text shown above the grid" },
  { name: "isOwner", type: "boolean", required: true, description: "Whether the viewer is the owner — affects empty state message" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes for the root container" },
];

const USAGE = `import { CreatorCard } from "@/registry/new-york/creator-card/creator-card"

<CreatorCard
  introText="My favorite DBD creators!"
  recommendations={[
    {
      id: "1",
      name: "Otzdarva",
      twitchLogin: "otzdarva",
      description: "Best DBD educational content",
      imageUrl: null,
    },
    {
      id: "2",
      name: "CherrieBlossomm",
      twitchLogin: "cherrieblossomm",
      description: "Amazing Huntress player",
      imageUrl: "https://example.com/avatar.png",
    },
  ]}
  isOwner={false}
/>

{/* imageUrl: if provided, shows profile image; otherwise renders initials fallback */}
{/* Each card links to https://twitch.tv/{twitchLogin} */}`;

export const config: PreviewLabConfig<Fixture> = {
  title: "Creator Card",
  description:
    "Grid of recommended creator cards with rounded profile image (or initials fallback), display name, Twitch handle, optional description, and link to their Twitch channel.",
  tags: ["creator", "profile", "recommendations", "grid"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="w-full">
      <CreatorCard {...fixture} />
    </div>
  ),
  propsMeta,
};
