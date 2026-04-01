import type { FaqAccordionProps, CreatorFaqData } from "@/registry/new-york/faq-accordion/faq-accordion";

export type FaqAccordionFixture = FaqAccordionProps;
type Fixture = FaqAccordionFixture;

const Q1: CreatorFaqData = { id: "faq1", question: "What is your streaming schedule?", answer: "I stream Tuesday through Friday from 5-7pm EST!" };
const Q2: CreatorFaqData = { id: "faq2", question: "What games do you play?", answer: "My main game is Dead by Daylight, but I play a variety of games and I'm always open to suggestions from chat." };
const Q3: CreatorFaqData = { id: "faq3", question: "How can I support you?", answer: "You can use my creator codes, check out my affiliate links, donate through Streamlabs or PayPal, or just hang out in chat!" };
const Q4: CreatorFaqData = { id: "faq4", question: "Do you have a Discord?", answer: "Yes! Join at discord.gg/7p82RZwvNq — we have a great community." };
const Q5: CreatorFaqData = { id: "faq5", question: "Can I play with you?", answer: "I do viewer games on Fridays! Join the Discord to get notified when I'm looking for players." };

const ALL = [Q1, Q2, Q3, Q4, Q5];

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  items: ALL,
  isOwner: false,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Public": fx(),
  "Owner": fx({ isOwner: true }),
  "Empty — Public": fx({ items: [] }),
  "Empty — Owner": fx({ items: [], isOwner: true }),
  "Single": fx({ items: [Q1] }),
};
