import { FaqAccordion } from "@/registry/new-york/faq-accordion/faq-accordion";
import {
  ALL_FIXTURES,
  type FaqAccordionFixture,
} from "@/fixtures/faq-accordion.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

type Fixture = FaqAccordionFixture;

const propsMeta: PropMeta[] = [
  { name: "items", type: "CreatorFaqData[]", required: true, description: "Array of FAQ question/answer pairs" },
  { name: "isOwner", type: "boolean", required: true, description: "Whether the viewer is the owner — affects empty state message" },
  { name: "className", type: "string", required: false, description: "Additional CSS classes for the root container" },
];

const USAGE = `import { FaqAccordion } from "@/registry/new-york/faq-accordion/faq-accordion"

<FaqAccordion
  items={[
    { id: "1", question: "What is your streaming schedule?", answer: "I stream Tuesday through Friday from 5-7pm EST!" },
    { id: "2", question: "What games do you play?", answer: "Mostly Dead by Daylight!" },
  ]}
  isOwner={false}
/>

{/* Uses native <details>/<summary> for progressive enhancement */}
{/* Chevron rotates 180° when open */}
{/* Multiple items can be open simultaneously */}`;

export const config: PreviewLabConfig<Fixture> = {
  title: "FAQ Accordion",
  description:
    "Frequently asked questions list using native HTML details/summary for progressive enhancement. Animated chevron indicates open/closed state.",
  tags: ["faq", "accordion", "details", "creator"],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => (
    <div className="w-full max-w-2xl">
      <FaqAccordion {...fixture} />
    </div>
  ),
  propsMeta,
};
