/**
 * Page-builder demo fixtures.
 *
 * Combines generic placeholder sections (hero, stats-bar, footer) with real
 * creator section components (social, support, builds, guides, faq, creators).
 */
import React from "react";
import type { PageLayout, SectionRegistry } from "@/registry/new-york/page-builder-lib/types";

// -- Creator components -------------------------------------------------------
import { SocialCard } from "@/registry/new-york/social-card/social-card";
import type { CreatorSocialData } from "@/registry/new-york/social-card/social-card";
import { SupportCard } from "@/registry/new-york/support-card/support-card";
import type { CreatorSupportData } from "@/registry/new-york/support-card/support-card";
import { BuildCard } from "@/registry/new-york/build-card/build-card";
import type { CreatorBuildData } from "@/registry/new-york/build-card/build-card";
import { GuideTabs } from "@/registry/new-york/guide-tabs/guide-tabs";
import type { CreatorGuideCategoryData } from "@/registry/new-york/guide-tabs/guide-tabs";
import { FaqAccordion } from "@/registry/new-york/faq-accordion/faq-accordion";
import type { CreatorFaqData } from "@/registry/new-york/faq-accordion/faq-accordion";
import { CreatorCard } from "@/registry/new-york/creator-card/creator-card";
import type { CreatorRecommendationData } from "@/registry/new-york/creator-card/creator-card";

// -- Fixture data -------------------------------------------------------------
import { ALL_FIXTURES as SOCIAL_FX } from "@/fixtures/social-card.fixtures";
import { ALL_FIXTURES as SUPPORT_FX } from "@/fixtures/support-card.fixtures";
import { ALL_FIXTURES as BUILD_FX } from "@/fixtures/build-card.fixtures";
import { ALL_FIXTURES as GUIDE_FX } from "@/fixtures/guide-tabs.fixtures";
import { ALL_FIXTURES as FAQ_FX } from "@/fixtures/faq-accordion.fixtures";
import { ALL_FIXTURES as CREATOR_FX } from "@/fixtures/creator-card.fixtures";

// ---------------------------------------------------------------------------
// Default layout
// ---------------------------------------------------------------------------

export const DEFAULT_DEMO_LAYOUT: PageLayout = {
  schemaVersion: 1,
  pageKey: "demo",
  sections: [
    { sectionKey: "hero",      variant: "default", visible: true, column: "full" },
    { sectionKey: "stats-bar", variant: "default", visible: true, column: "full" },
    { sectionKey: "social",    variant: "default", visible: true, column: "left",  split: "2-1" },
    { sectionKey: "support",   variant: "default", visible: true, column: "right", split: "2-1" },
    { sectionKey: "builds",    variant: "default", visible: true, column: "full" },
    { sectionKey: "guides",    variant: "default", visible: true, column: "left",  split: "2-1" },
    { sectionKey: "faq",       variant: "default", visible: true, column: "right", split: "2-1" },
    { sectionKey: "creators",  variant: "default", visible: true, column: "full" },
    { sectionKey: "footer",    variant: "default", visible: true, column: "full" },
  ],
};

// ---------------------------------------------------------------------------
// Default data context — real fixture data for each section
// ---------------------------------------------------------------------------

export const DEFAULT_DATA_CONTEXT: Record<string, Record<string, unknown>> = {
  social:   SOCIAL_FX["Public"] as unknown as Record<string, unknown>,
  support:  SUPPORT_FX["Public"] as unknown as Record<string, unknown>,
  builds:   BUILD_FX["Public (2 builds)"] as unknown as Record<string, unknown>,
  guides:   GUIDE_FX["Public (3 categories)"] as unknown as Record<string, unknown>,
  faq:      FAQ_FX["Public"] as unknown as Record<string, unknown>,
  creators: CREATOR_FX["Public"] as unknown as Record<string, unknown>,
};

// ---------------------------------------------------------------------------
// Section registry
// ---------------------------------------------------------------------------

export function buildDemoRegistry(
  PlaceholderCard: (props: { label: string; color: string; description?: string }) => React.ReactElement | null,
): SectionRegistry {
  // Helper for placeholder sections (hero, stats-bar, footer)
  function placeholder(
    key: string,
    label: string,
    color: string,
    column: "left" | "right" | "full",
    opts?: {
      allowedColumns?: ("left" | "right" | "full")[];
      alwaysVisible?: boolean;
      sizeHint?: "sm" | "md" | "lg";
    },
  ) {
    const variants = {
      default: (props: Record<string, unknown>) =>
        PlaceholderCard({
          label,
          color,
          description: String(props["description"] ?? "Default layout"),
        }),
      compact: (props: Record<string, unknown>) =>
        PlaceholderCard({
          label,
          color,
          description: String(props["description"] ?? "Compact layout"),
        }),
    };
    return {
      key,
      label,
      column,
      allowedColumns: opts?.allowedColumns,
      alwaysVisible: opts?.alwaysVisible,
      variants,
      defaultVariant: "default",
      variantMeta: {
        default: { label: "Default", sizeHint: (opts?.sizeHint ?? "md") as "sm" | "md" | "lg" },
        compact: { label: "Compact", sizeHint: "sm" as const },
      },
    };
  }

  return {
    // -- Placeholder sections -------------------------------------------------
    hero: placeholder("hero", "Hero", "bg-cyan-500/10 border-cyan-500/20", "full", {
      allowedColumns: ["full"],
      alwaysVisible: true,
      sizeHint: "md",
    }),
    "stats-bar": placeholder("stats-bar", "Stats Bar", "bg-yellow-500/10 border-yellow-500/20", "full", {
      allowedColumns: ["full"],
      sizeHint: "sm",
    }),
    footer: placeholder("footer", "Footer", "bg-rose-500/10 border-rose-500/20", "full", {
      allowedColumns: ["full"],
      sizeHint: "sm",
    }),

    // -- Real creator sections ------------------------------------------------
    social: {
      key: "social",
      label: "Social Links",
      column: "left",
      variants: {
        default: (props: Record<string, unknown>) =>
          React.createElement(SocialCard, {
            socials: (props.socials ?? []) as CreatorSocialData[],
            isOwner: (props.isOwner ?? false) as boolean,
          }),
        compact: (props: Record<string, unknown>) =>
          React.createElement(SocialCard, {
            socials: ((props.socials ?? []) as CreatorSocialData[]).slice(0, 3),
            isOwner: (props.isOwner ?? false) as boolean,
          }),
      },
      defaultVariant: "default",
      variantMeta: {
        default: { label: "Full", sizeHint: "md" },
        compact: { label: "Top 3", sizeHint: "sm" },
      },
    },
    support: {
      key: "support",
      label: "Support Links",
      column: "right",
      variants: {
        default: (props: Record<string, unknown>) =>
          React.createElement(SupportCard, {
            links: (props.links ?? []) as CreatorSupportData[],
            isOwner: (props.isOwner ?? false) as boolean,
          }),
        compact: (props: Record<string, unknown>) =>
          React.createElement(SupportCard, {
            links: ((props.links ?? []) as CreatorSupportData[]).slice(0, 3),
            isOwner: (props.isOwner ?? false) as boolean,
          }),
      },
      defaultVariant: "default",
      variantMeta: {
        default: { label: "Full", sizeHint: "md" },
        compact: { label: "Top 3", sizeHint: "sm" },
      },
    },
    builds: {
      key: "builds",
      label: "Builds",
      column: "full",
      variants: {
        default: (props: Record<string, unknown>) =>
          React.createElement(BuildCard, {
            builds: (props.builds ?? []) as CreatorBuildData[],
            isOwner: (props.isOwner ?? false) as boolean,
          }),
        compact: (props: Record<string, unknown>) =>
          React.createElement(BuildCard, {
            builds: ((props.builds ?? []) as CreatorBuildData[]).slice(0, 1),
            isOwner: (props.isOwner ?? false) as boolean,
          }),
      },
      defaultVariant: "default",
      variantMeta: {
        default: { label: "All Builds", sizeHint: "lg" },
        compact: { label: "Featured Build", sizeHint: "md" },
      },
    },
    guides: {
      key: "guides",
      label: "Guide Tabs",
      column: "left",
      variants: {
        default: (props: Record<string, unknown>) =>
          React.createElement(GuideTabs, {
            categories: (props.categories ?? []) as CreatorGuideCategoryData[],
            introText: (props.introText ?? null) as string | null,
            isOwner: (props.isOwner ?? false) as boolean,
          }),
        compact: (props: Record<string, unknown>) =>
          React.createElement(GuideTabs, {
            categories: ((props.categories ?? []) as CreatorGuideCategoryData[]).slice(0, 1),
            introText: null,
            isOwner: (props.isOwner ?? false) as boolean,
          }),
      },
      defaultVariant: "default",
      variantMeta: {
        default: { label: "All Categories", sizeHint: "lg" },
        compact: { label: "Single Category", sizeHint: "md" },
      },
    },
    faq: {
      key: "faq",
      label: "FAQ",
      column: "right",
      variants: {
        default: (props: Record<string, unknown>) =>
          React.createElement(FaqAccordion, {
            items: (props.items ?? []) as CreatorFaqData[],
            isOwner: (props.isOwner ?? false) as boolean,
          }),
        compact: (props: Record<string, unknown>) =>
          React.createElement(FaqAccordion, {
            items: ((props.items ?? []) as CreatorFaqData[]).slice(0, 3),
            isOwner: (props.isOwner ?? false) as boolean,
          }),
      },
      defaultVariant: "default",
      variantMeta: {
        default: { label: "Full", sizeHint: "md" },
        compact: { label: "Top 3", sizeHint: "sm" },
      },
    },
    creators: {
      key: "creators",
      label: "Recommended Creators",
      column: "full",
      variants: {
        default: (props: Record<string, unknown>) =>
          React.createElement(CreatorCard, {
            recommendations: (props.recommendations ?? []) as CreatorRecommendationData[],
            introText: (props.introText ?? null) as string | null,
            isOwner: (props.isOwner ?? false) as boolean,
          }),
        compact: (props: Record<string, unknown>) =>
          React.createElement(CreatorCard, {
            recommendations: ((props.recommendations ?? []) as CreatorRecommendationData[]).slice(0, 2),
            introText: null,
            isOwner: (props.isOwner ?? false) as boolean,
          }),
      },
      defaultVariant: "default",
      variantMeta: {
        default: { label: "Full", sizeHint: "md" },
        compact: { label: "Top 2", sizeHint: "sm" },
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Preview fixtures (for fixture picker in edit mode)
// ---------------------------------------------------------------------------

function toRecord(fx: Record<string, unknown>): Record<string, Record<string, unknown>> {
  return Object.fromEntries(
    Object.entries(fx).map(([k, v]) => [k, v as Record<string, unknown>]),
  );
}

export const DEMO_PREVIEW_FIXTURES: Record<
  string,
  Record<string, Record<string, unknown>>
> = {
  social:   toRecord(SOCIAL_FX),
  support:  toRecord(SUPPORT_FX),
  builds:   toRecord(BUILD_FX),
  guides:   toRecord(GUIDE_FX),
  faq:      toRecord(FAQ_FX),
  creators: toRecord(CREATOR_FX),
};
