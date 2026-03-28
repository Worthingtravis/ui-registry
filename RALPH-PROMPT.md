# UI Registry — Ralph Loop Prompt

You are iterating on `/mnt/ssd/development/ui-registry`, a production-grade shadcn component registry. Each loop iteration: pick the next incomplete task, do the work, verify, commit, exit.

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
  types.ts                  <- Shared types (RegistryEntry, Variant, PreviewLabConfig)
  registry.ts               <- Central REGISTRY array + helpers
  utils.ts                  <- cn() and shared helpers

components/                 <- App-only UI (preview-lab, site-header, sidebar, etc.)
```

## Shadcn Registry Rules (MUST follow)

These rules come from the official shadcn registry guide. Violations break `shadcn build` or consumer installs.

### Directory Structure
- Every registry item lives at `registry/new-york/{name}/{name}.tsx`
- Sub-files go in `components/`, `hooks/`, `lib/` directories within the item folder
- The style directory is `new-york` — always use this, never flat `registry/{name}.tsx`

### Imports
- **Registry components MUST import other registry items using `@/registry/new-york/...` paths**
  - `import { TerminalChrome } from "@/registry/new-york/terminal-chrome/terminal-chrome"`
- Standard shadcn imports (`@/lib/utils`, `@/components/ui/button`) are fine — consumers have these
- NEVER use relative imports (`./foo`) between registry items

### registry.json
- Every item needs: `name`, `type`, `title`, `description`, `files`
- Every file entry needs: `path` (relative from project root), `type`
- Valid item types: `registry:component`, `registry:block`, `registry:hook`, `registry:lib`
- Valid file types: `registry:component`, `registry:hook`, `registry:lib`
- `registryDependencies`: array of other registry item names this item depends on
- `dependencies`: array of npm package names (e.g., `["lucide-react"]`)
- `css`: keyframe/utility CSS the item requires

### Types
- Every component exports a `{Name}Props` interface
- Hooks are `registry:hook`, utility files are `registry:lib`
- Shared utilities used by multiple registry items should be their own registry items
  (e.g., `use-copy` is `registry:hook`, `terminal-lib` is `registry:lib`)

## Component Quality Rules

### Props & Types
- Every component has an exported `{Name}Props` interface with JSDoc on each prop
- No `any`, no `Record<string, unknown>` — concrete types everywhere
- Use discriminated unions for entry types (e.g., `TerminalEntry`)

### DRY
- Zero duplicated logic between registry items — extract shared code into registry:lib or registry:hook items
- Fixture files use `BASE + override` pattern: `const fx = (overrides) => ({...BASE, ...overrides})`
- If the same logic appears in 2+ registry components, extract it

### Pure Presentation
- Registry components are pure presentation — no hardcoded demo data
- All state/behavior comes through props
- Demo data lives in `fixtures/`, wiring lives in `demos/`

## Fixture Pattern

Every component needs a fixture file at `fixtures/{name}.fixtures.ts`:

```ts
import type { FooProps } from "@/registry/new-york/foo/foo";

type Fixture = Omit<FooProps, "className" | "onEvent">;

const BASE: Fixture = { /* sensible defaults */ };
const fx = (overrides: Partial<Fixture> = {}): Fixture => ({ ...BASE, ...overrides });

export type FooFixture = Fixture;

export const ALL_FIXTURES: Record<string, Fixture> = {
  Default: BASE,
  Empty: fx({ items: [] }),
  Full: fx({ items: MANY_ITEMS }),
};
```

Rules:
- Fixtures are pure data — no JSX, no React imports
- Import types from `@/registry/new-york/{name}/{name}`
- Export `ALL_FIXTURES` as `Record<string, Fixture>`
- Export the Fixture type for the demo file

## Demo Pattern

Every component needs a demo file at `demos/{name}.demo.tsx`:

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
  fixtures: ALL_FIXTURES,
  render: (fixture) => <Foo {...fixture} />,
  propsMeta,
};
```

## Adding a New Component (the loop iteration)

Each iteration should pick ONE component that needs work and complete the full cycle:

1. **Create** `registry/new-york/{name}/{name}.tsx` — pure component with exported `{Name}Props`
2. **Create** `fixtures/{name}.fixtures.ts` — typed fixtures with BASE + override pattern
3. **Create** `demos/{name}.demo.tsx` — PreviewLabConfig wiring fixtures to component
4. **Register** — add entry to `lib/registry.ts` REGISTRY array
5. **Register** — add item to `registry.json` with proper metadata
6. **Verify** — `npx tsc --noEmit` passes, `npx shadcn@latest build` succeeds
7. **Commit** — one clean commit per component

## Validation Checklist (run before every commit)

```bash
npx tsc --noEmit                    # Zero type errors
npx shadcn@latest build             # Registry builds all items
```

If either fails, fix before committing. Never commit broken state.

## Current State

12 registry items exist in `registry/new-york/`:
- **Primitives:** terminal-chrome, typing-text, tool-call-block, tool-call-block-inline, copyable-row, scroll-prompt, step-flow, step-flow-vertical
- **Shared:** use-copy (hook), terminal-lib (lib)
- **Compositions:** mini-terminal-demo (block), terminal-demo (block)

All have fixtures, demos, and proper registry.json entries. The PreviewLab harness supports fixture cycling, variant tabs, code/fixture/props inspection, and install commands.

## What To Work On

Look at what's incomplete or could be improved:
1. New components that need the full cycle (registry + fixtures + demo + registration)
2. Existing components missing variants
3. Missing `registryDependencies` or `dependencies` in registry.json
4. Import paths not using `@/registry/new-york/...` pattern
5. Fixtures not following BASE + override pattern
6. Components with inline demo data instead of pure props

Pick the highest-impact incomplete item, do the work, verify, commit.

Output `<promise>REGISTRY COMPLETE</promise>` when there is nothing left to improve — all components follow the patterns, all validations pass, and the registry is production-ready.
