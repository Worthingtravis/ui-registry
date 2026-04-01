import type { SocialCardProps, CreatorSocialData } from "@/registry/new-york/social-card/social-card";

export type SocialCardFixture = SocialCardProps;
type Fixture = SocialCardFixture;

const TWITCH: CreatorSocialData = { id: "s1", platform: "twitch", url: "https://twitch.tv/jagerzgoober", description: "I stream Dead by Daylight killer and survivor. I also stream other fun games on Fridays!" };
const YOUTUBE: CreatorSocialData = { id: "s2", platform: "youtube", url: "https://youtube.com/@Jagerzgoober", description: "Clips, guides, and DBD content" };
const TIKTOK: CreatorSocialData = { id: "s3", platform: "tiktok", url: "https://tiktok.com/@jagerzgoober", description: "Short-form DBD content and highlights" };
const INSTAGRAM: CreatorSocialData = { id: "s4", platform: "instagram", url: "https://instagram.com/jagerzgoober", description: "Behind the scenes and updates" };
const DISCORD: CreatorSocialData = { id: "s5", platform: "discord", url: "https://discord.gg/7p82RZwvNq", description: "Community server — come hang out!" };
const KICK: CreatorSocialData = { id: "s6", platform: "kick", url: "https://kick.com/jagerzgoober", description: null };
const UNKNOWN: CreatorSocialData = { id: "s7", platform: "myspace", url: "https://myspace.com/jagerzgoober", description: "Throwback" };

const ALL = [TWITCH, YOUTUBE, TIKTOK, INSTAGRAM, DISCORD];

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  socials: ALL,
  isOwner: false,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Public": fx(),
  "Owner": fx({ isOwner: true }),
  "Empty — Public": fx({ socials: [] }),
  "Empty — Owner": fx({ socials: [], isOwner: true }),
  "Single": fx({ socials: [TWITCH] }),
  "Many (7)": fx({ socials: [...ALL, KICK, UNKNOWN] }),
  "Optional Fields": fx({ socials: [TWITCH, KICK, UNKNOWN] }),
};
