import type { GuideTabsProps, CreatorGuideCategoryData } from "@/registry/new-york/guide-tabs/guide-tabs";

export type GuideTabsFixture = GuideTabsProps;
type Fixture = GuideTabsFixture;

const KILLER_GUIDES: CreatorGuideCategoryData = {
  id: "gc1", title: "How to Master Each Killer", description: null,
  links: [
    { id: "gl1", title: "How to Master Springtrap", url: "https://youtube.com/shorts/T7ENojVqurg", thumbnailUrl: "https://i.ytimg.com/vi/T7ENojVqurg/maxresdefault.jpg", description: null },
    { id: "gl2", title: "How to Master Huntress", url: "https://youtube.com/shorts/fb6vQIl8kyQ", thumbnailUrl: "https://i.ytimg.com/vi/fb6vQIl8kyQ/maxresdefault.jpg", description: null },
    { id: "gl3", title: "How to Master Nurse", url: "https://youtube.com/shorts/5UfQ4hhlgSU", thumbnailUrl: "https://i.ytimg.com/vi/5UfQ4hhlgSU/maxresdefault.jpg", description: null },
  ],
};

const SURVIVOR_TIPS: CreatorGuideCategoryData = {
  id: "gc2", title: "How to Become Better at Survivor", description: null,
  links: [
    { id: "gl4", title: "Survivor Basics", url: "https://youtube.com/shorts/kq0vELLRhGI", thumbnailUrl: "https://i.ytimg.com/vi/kq0vELLRhGI/maxresdefault.jpg", description: "Essential survivor tips" },
    { id: "gl5", title: "Looping 101", url: "https://youtube.com/shorts/_25bW7k2OOw", thumbnailUrl: "https://i.ytimg.com/vi/_25bW7k2OOw/maxresdefault.jpg", description: null },
  ],
};

const GENERAL: CreatorGuideCategoryData = {
  id: "gc3", title: "General Guides", description: null,
  links: [{ id: "gl6", title: "DBD Beginner Guide", url: "https://youtube.com/shorts/OFfxgaE6WJM", thumbnailUrl: "https://i.ytimg.com/vi/OFfxgaE6WJM/maxresdefault.jpg", description: null }],
};

const EMPTY_CAT: CreatorGuideCategoryData = {
  id: "gc4", title: "Random Tips", description: null, links: [],
};

const INTRO = "I have a lot of guides for players on Dead by Daylight, revolved around becoming better at the game and how to do certain things!";

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  categories: [KILLER_GUIDES, SURVIVOR_TIPS, GENERAL],
  introText: INTRO,
  isOwner: false,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Public (3 categories)": fx(),
  "Owner": fx({ isOwner: true }),
  "Empty — Public": fx({ categories: [], introText: null }),
  "Empty — Owner": fx({ categories: [], introText: null, isOwner: true }),
  "Single Category": fx({ categories: [KILLER_GUIDES] }),
  "With Empty Tab": fx({ categories: [KILLER_GUIDES, EMPTY_CAT] }),
};
