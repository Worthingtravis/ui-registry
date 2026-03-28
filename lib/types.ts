import type { ComponentType } from "react";

// ---------------------------------------------------------------------------
// Registry types — shared across the entire preview system
// ---------------------------------------------------------------------------

/** A named variant of a component — same props interface, different visual. */
export interface Variant<TProps> {
  /** Display name (e.g. "Compact", "Minimal") */
  name: string;
  /** The component to render */
  component: ComponentType<TProps>;
  /** Optional description shown in variant selector */
  description?: string;
}

/** Metadata for a single prop, used in the Props inspection tab. */
export interface PropMeta {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: string;
}

/** Configuration for one component's preview lab page. */
export interface PreviewLabConfig<TFixture> {
  /** Component title */
  title: string;
  /** One-line description */
  description: string;
  /** Tags for categorization */
  tags?: string[];
  /** Named fixtures — key is display name, value is the fixture data */
  fixtures: Record<string, TFixture>;
  /** Render function: takes fixture data and returns JSX */
  render: (fixture: TFixture) => React.ReactNode;
  /** Visual variants of the same component (optional) */
  variants?: Variant<TFixture>[];
  /** Raw source code string for code tab */
  sourceCode?: string;
  /** Fixture source code string for fixtures tab */
  fixtureCode?: string;
  /** Prop definitions for the props tab */
  propsMeta?: PropMeta[];
}

/** Registry entry — config for one component in the index + preview system. */
export interface RegistryEntry {
  /** kebab-case name matching registry.json */
  name: string;
  /** Dynamic import for the preview lab config */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lab: () => Promise<{ config: PreviewLabConfig<any> }>;
  /** Tags for index page filtering */
  tags: string[];
}
