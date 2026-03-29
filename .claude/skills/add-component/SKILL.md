---
name: add-component
description: Add a new reusable component to the shadcn registry with fixtures, demo, and full registration
argument-hint: <component-name> — kebab-case name for the new component
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Agent
---

# Add Component to UI Registry

You are adding a new reusable component to the `@worthingtravis/ui-registry` shadcn registry. Follow every step exactly — skipping any step will break consumer installs or the preview site.

## Arguments

`$ARGUMENTS` is the kebab-case component name (e.g., `accordion`, `code-block`, `avatar-stack`).

If no name is provided, ask the user what component they want to add.

---

## Architecture

```
registry/new-york/          <- Installable components (shadcn registry)
  {name}/
    {name}.tsx              <- Pure presentation, exported {Name}Props interface
    components/             <- Sub-components (optional, for complex items)
    hooks/                  <- Hooks scoped to this item (optional)
    lib/                    <- Utilities scoped to this item (optional)

fixtures/
  {name}.fixtures.ts        <- Typed fixture data (ALL_FIXTURES export)

demos/
  {name}.demo.tsx           <- PreviewLabConfig wiring fixtures → component

lib/
  types.ts                  <- Shared types (RegistryEntry, RegistryCategory, Variant, PreviewLabConfig)
  registry.ts               <- Central REGISTRY array, CATEGORY_ORDER, groupedRegistry()
  utils.ts                  <- cn() and shared helpers

components/                 <- App-only UI (preview-lab, site-header, sidebar, etc.)
```

### Sidebar Categories

Components are grouped in the sidebar under these ordered categories (defined in `lib/registry.ts`):

- **Terminal** — terminal-chrome, tool-call-block, mini-terminal-demo, terminal-demo
- **Profile & Avatar** — avatar-picker, profile-editor
- **Progression** — onboarding-checklist, step-flow, flow-diagram
- **Animation** — typing-text, scroll-prompt
- **Navigation** — section-heading, component-grid, grouped-sidebar
- **Interactive** — info-tip, collapsible-group, copyable-row

Every `RegistryEntry` requires a `category` field matching one of these.

---

## Shadcn Registry Rules (MUST follow)

Violations break `shadcn build` or consumer installs.

### Directory Structure
- Every registry item lives at `registry/new-york/{name}/{name}.tsx`
- Sub-files go in `components/`, `hooks/`, `lib/` directories within the item folder
- The style directory is `new-york` — always use this

### Imports
- **Registry components MUST import other registry items using `@/registry/new-york/...` paths**
- Standard shadcn imports (`@/lib/utils`, `@/components/ui/button`) are fine
- NEVER use relative imports (`./foo`) between registry items

### registry.json
- Every item needs: `name`, `type`, `title`, `description`, `files`
- Every file entry needs: `path` (relative from project root), `type`
- Valid item types: `registry:component`, `registry:block`, `registry:hook`, `registry:lib`
- `registryDependencies`: array of other registry item names this depends on
- `dependencies`: array of npm package names (e.g., `["lucide-react"]`)
- `css`: keyframe/utility CSS the item requires

### Types
- Every component exports a `{Name}Props` interface with JSDoc on each prop
- No `any`, no `Record<string, unknown>` — concrete types everywhere
- Use discriminated unions for complex prop variations

### Quality
- Pure presentation — no hardcoded demo data, all state comes through props
- Zero duplicated logic — extract shared code into registry:lib or registry:hook items
- Fixture files use `BASE + fx()` override pattern
- If the same logic appears in 2+ registry components, extract it

---

## Step-by-step process

### 0. Sanitize source material

If copying or adapting a component from another project, review the source for anything that must NOT be carried over:

- **API keys, tokens, secrets** — env vars, hardcoded credentials, auth headers
- **Internal URLs** — staging endpoints, admin panels, internal API routes
- **User data** — real names, emails, usernames, avatar URLs pointing to private storage
- **Business logic** — auth checks, permission gates, billing code, analytics calls
- **Platform-specific imports** — app-specific contexts, stores, services, or hooks that won't exist in the registry
- **Licensed assets** — fonts, images, or icons with restricted licenses
- **App-specific CSS classes** — e.g. `text-twitch` → use `text-primary` instead

Replace all of the above with:
- Generic placeholder data in fixtures (e.g. "Alice Smith", "https://example.com")
- Standard imports from `@/lib/utils` or `lucide-react`
- Props that let the consumer provide their own data
- `renderLink` prop pattern for framework-specific routing (Next.js Link, etc.)

If unsure whether something is sensitive, strip it and make it a prop.

### 1. Create the component

**File:** `registry/new-york/$ARGUMENTS/$ARGUMENTS.tsx`

Rules:
- Add `"use client"` directive if the component uses hooks, state, or browser APIs
- Export a `{PascalName}Props` interface with JSDoc on every prop
- Export the component as a named function (not default export)
- No `any` types — use concrete types and discriminated unions
- Pure presentation only — all data comes through props, no hardcoded demo data
- Use `cn()` from `@/lib/utils` for className merging
- Use `--color-primary` (not `--accent`) for theme colors in inline styles
- Use `text-primary`, `border-primary`, `bg-primary` for Tailwind classes
- Import other registry items via `@/registry/new-york/{name}/{name}` (never relative imports)
- When the component renders links, use a `renderLink` prop so consumers can provide their own `<Link>` component. Default fallback should use `<div>` or `<span>` (not `<a>`) to avoid nested anchor issues when the component is rendered inside a link wrapper (e.g., ComponentCell on the home page).

### 2. Create fixtures

**File:** `fixtures/$ARGUMENTS.fixtures.ts`

```ts
import type { FooProps } from "@/registry/new-york/foo/foo";

export type FooFixture = Omit<FooProps, "className" | "onEvent">;
type Fixture = FooFixture;

const BASE: Fixture = { /* sensible defaults */ };
const fx = (overrides: Partial<Fixture> = {}): Fixture => ({ ...BASE, ...overrides });

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Default": BASE,
  "Empty": fx({ items: [] }),
  "Full": fx({ items: MANY_ITEMS }),
};
```

Rules:
- Pure data — no JSX, no React imports
- Import types from `@/registry/new-york/{name}/{name}`
- Export `ALL_FIXTURES` as `Record<string, Fixture>` with at least 3 named fixtures
- Export the Fixture type for the demo file

### 3. Create demo

**File:** `demos/$ARGUMENTS.demo.tsx`

```tsx
"use client";
import { Foo } from "@/registry/new-york/foo/foo";
import { ALL_FIXTURES, type FooFixture } from "@/fixtures/foo.fixtures";
import type { PreviewLabConfig, PropMeta } from "@/lib/types";

const propsMeta: PropMeta[] = [
  { name: "bar", type: "string", required: true, description: "..." },
];

export const config: PreviewLabConfig<FooFixture> = {
  title: "Foo",
  description: "...",
  tags: ["..."],
  usageCode: USAGE,
  fixtures: ALL_FIXTURES,
  render: (fixture) => <Foo {...fixture} />,
  propsMeta,
};
```

Rules:
- Make demos **interactive** — if the component has toggle/click behavior, wrap the render in a stateful helper component (the render function itself can't use hooks)
- Include `usageCode` with realistic import + JSX examples
- Include `propsMeta` matching every prop in the Props interface

### 4. Register in lib/registry.ts

Add an entry to the `REGISTRY` array in the correct category section:

```ts
{
  name: "$ARGUMENTS",
  description: "One-line description",
  lab: () => import("@/demos/$ARGUMENTS.demo"),
  tags: ["relevant", "tags"],
  category: "Terminal", // or "Profile & Avatar", "Progression", "Animation", "Navigation", "Interactive"
},
```

### 5. Register in registry.json

Add an entry to the `items` array:

```json
{
  "name": "$ARGUMENTS",
  "type": "registry:component",
  "title": "Pascal Name",
  "description": "One-line description",
  "author": "worthingtravis",
  "registryDependencies": [],
  "dependencies": [],
  "files": [
    {
      "path": "registry/new-york/$ARGUMENTS/$ARGUMENTS.tsx",
      "type": "registry:component"
    }
  ],
  "categories": ["relevant-category"]
}
```

### 6. Validate

Both must pass with zero errors:

```bash
npx tsc --noEmit
pnpm run build:registry
```

If either fails, fix before proceeding.

### 7. Update README.md

- Add a row to the appropriate category table
- Add a direct URL install line
- Add a namespace install line

### 8. Verify the preview

- Component appears in the correct sidebar category
- Fixture cycling works
- Props table displays
- Demo is interactive (not just static rendering with no-op callbacks)

## Checklist

- [ ] Source material sanitized (no secrets, internal URLs, app-specific imports)
- [ ] Component at `registry/new-york/$ARGUMENTS/$ARGUMENTS.tsx` with exported Props interface
- [ ] Every prop has a JSDoc comment
- [ ] Fixtures at `fixtures/$ARGUMENTS.fixtures.ts` with BASE + fx() pattern
- [ ] Demo at `demos/$ARGUMENTS.demo.tsx` with PreviewLabConfig (interactive!)
- [ ] Entry in `lib/registry.ts` REGISTRY array with correct `category`
- [ ] Entry in `registry.json` with all dependencies listed
- [ ] README.md updated with component table row and install commands
- [ ] `npx tsc --noEmit` passes
- [ ] `pnpm run build:registry` passes
- [ ] No `any` types
- [ ] No hardcoded demo data in the component
- [ ] All cross-registry imports use `@/registry/new-york/...` paths
- [ ] Default link fallback uses `<div>`/`<span>` (not `<a>`) to avoid nested anchor errors
- [ ] Theme colors use `primary` (not `accent` or app-specific tokens)
