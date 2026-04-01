import type { SupportCardProps, CreatorSupportData } from "@/registry/new-york/support-card/support-card";

export type SupportCardFixture = SupportCardProps;
type Fixture = SupportCardFixture;

const GFUEL: CreatorSupportData = { id: "sup1", type: "affiliate", label: "G-FUEL", url: "https://gfuel.com/Jagerzgoober", code: null, description: "Energy drinks partner", imageUrl: null };
const RAZER: CreatorSupportData = { id: "sup2", type: "affiliate", label: "Razer", url: "https://razer.com/?utm_source=Jagerzgoober", code: null, description: "Gaming peripherals", imageUrl: null };
const STREAMLABS: CreatorSupportData = { id: "sup3", type: "donation", label: "Streamlabs", url: "https://streamlabs.com/jagerzgoober/tip", code: null, description: "Any support is appreciated!", imageUrl: null };
const PAYPAL: CreatorSupportData = { id: "sup4", type: "donation", label: "PayPal", url: "https://paypal.biz/jagerzgoober", code: null, description: null, imageUrl: null };
const MERCH: CreatorSupportData = { id: "sup5", type: "merch", label: "Merch Store", url: "https://redbubble.com/people/jagerzgoober/shop", code: null, description: "Official merch", imageUrl: null };
const DBD_CODE: CreatorSupportData = { id: "sup6", type: "creator-code", label: "Dead by Daylight", url: null, code: "JAGERZGOOBER", description: "Official DBD Creator", imageUrl: null };
const FN_CODE: CreatorSupportData = { id: "sup7", type: "creator-code", label: "Fortnite", url: null, code: "jagerzgoober", description: "Support-a-Creator", imageUrl: null };

const ALL = [GFUEL, RAZER, STREAMLABS, PAYPAL, MERCH, DBD_CODE, FN_CODE];

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  links: ALL,
  isOwner: false,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Public": fx(),
  "Owner": fx({ isOwner: true }),
  "Empty — Public": fx({ links: [] }),
  "Empty — Owner": fx({ links: [], isOwner: true }),
  "Single (Code)": fx({ links: [DBD_CODE] }),
  "Codes Only": fx({ links: [DBD_CODE, FN_CODE] }),
  "Donations Only": fx({ links: [STREAMLABS, PAYPAL] }),
};
