import type { CreatorCardProps, CreatorRecommendationData } from "@/registry/new-york/creator-card/creator-card";

export type CreatorCardFixture = CreatorCardProps;
type Fixture = CreatorCardFixture;

const CHERRIE: CreatorRecommendationData = { id: "rec1", name: "CherrieBlossomm", twitchLogin: "cherrieblossomm", description: "Amazing Huntress player and great vibes", imageUrl: null };
const OTZDARVA: CreatorRecommendationData = { id: "rec2", name: "Otzdarva", twitchLogin: "otzdarva", description: "Best DBD educational content", imageUrl: null };
const DOWSEY: CreatorRecommendationData = { id: "rec3", name: "Dowsey", twitchLogin: "dowsey", description: null, imageUrl: null };
const CUSTOM_IMG: CreatorRecommendationData = { id: "rec4", name: "CustomCreator", twitchLogin: "customcreator", description: "With custom image", imageUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=custom" };

const INTRO = "These are some of my favorite Dead by Daylight creators in the community and I would highly recommend checking them out!";

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  recommendations: [CHERRIE, OTZDARVA, DOWSEY],
  introText: INTRO,
  isOwner: false,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Public": fx(),
  "Owner": fx({ isOwner: true }),
  "Empty — Public": fx({ recommendations: [], introText: null }),
  "Empty — Owner": fx({ recommendations: [], introText: null, isOwner: true }),
  "Single": fx({ recommendations: [CHERRIE] }),
  "With Custom Image": fx({ recommendations: [CHERRIE, CUSTOM_IMG] }),
};
