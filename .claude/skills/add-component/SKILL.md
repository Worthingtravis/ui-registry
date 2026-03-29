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

## Step-by-step process

### 1. Create the component

**File:** `registry/new-york/$ARGUMENTS/$ARGUMENTS.tsx`

Rules:
- Add `"use client"` directive if the component uses hooks, state, or browser APIs
- Export a `{PascalName}Props` interface with JSDoc on every prop
- Export the component as a named function (not default export)
- No `any` types — use concrete types and discriminated unions
- Pure presentation only — all data comes through props, no hardcoded demo data
- Use `cn()` from `@/lib/utils` for className merging
- Import other registry items via `@/registry/new-york/{name}/{name}` (never relative imports between registry items)
- Standard imports (`@/lib/utils`, `@/components/ui/*`) are fine

### 2. Create fixtures

**File:** `fixtures/$ARGUMENTS.fixtures.ts`

Rules:
- Pure data — no JSX, no React imports
- Import the Props type from `@/registry/new-york/$ARGUMENTS/$ARGUMENTS`
- Create a `Fixture` type as `Omit<Props, "className" | "onEvent" | ...>` (omit handler/style props)
- Use the BASE + fx() override pattern:

```ts
const BASE: Fixture = { /* sensible defaults */ };
const fx = (overrides: Partial<Fixture> = {}): Fixture => ({ ...BASE, ...overrides });
```

- Export `type {PascalName}Fixture = Fixture`
- Export `ALL_FIXTURES: Record<string, Fixture>` with at least 3 named fixtures (Default, plus meaningful variations)

### 3. Create demo

**File:** `demos/$ARGUMENTS.demo.tsx`

Rules:
- `"use client"` directive
- Import the component from `@/registry/new-york/$ARGUMENTS/$ARGUMENTS`
- Import `ALL_FIXTURES` and the fixture type from `@/fixtures/$ARGUMENTS.fixtures`
- Import `PreviewLabConfig` and `PropMeta` from `@/lib/types`
- Export `const config: PreviewLabConfig<{PascalName}Fixture>` with:
  - `title`, `description`, `tags`
  - `fixtures: ALL_FIXTURES`
  - `render: (fixture, Variant) => ...`
  - `propsMeta` array matching every prop in the Props interface
  - Optional: `variants` array for layout/mode variations
  - Optional: `usageCode` string showing how to use the component
  - Optional: `sourceCode` string

### 4. Register in lib/registry.ts

Add an entry to the `REGISTRY` array:

```ts
{
  name: "$ARGUMENTS",
  description: "One-line description",
  lab: () => import("@/demos/$ARGUMENTS.demo"),
  tags: ["relevant", "tags"],
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

Important registry.json fields:
- `registryDependencies`: other registry item names this depends on (e.g., `["use-copy", "terminal-lib"]`)
- `dependencies`: npm packages (e.g., `["lucide-react"]`)
- `css`: custom keyframes/utilities if needed
- `cssVars`: CSS custom properties if needed
- If the component has sub-files, add each to the `files` array with appropriate type (`registry:component`, `registry:hook`, `registry:lib`)

### 6. Validate

Run both commands — both must pass with zero errors:

```bash
npx tsc --noEmit
pnpm run build:registry
```

If either fails, fix the issues before proceeding.

### 7. Update README.md

Add the new component to the components table in `README.md`.

- Add a row to the appropriate table (Components or Shared) matching the existing format:
  ```
  | `$ARGUMENTS` | `registry:component` | One-line description |
  ```
- Add a direct URL install line in the "Direct URL" section:
  ```
  npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/$ARGUMENTS.json
  ```
- Add a namespace install line in the "With namespace" section:
  ```
  npx shadcn@latest add @worthingtravis/$ARGUMENTS
  ```
- Keep alphabetical or categorical ordering consistent with existing entries

### 8. Verify the preview

Check that the component appears in the sidebar and renders correctly:
- The component should show in the sidebar nav
- Fixture cycling should work
- Props table should display

## Checklist before finishing

- [ ] Component at `registry/new-york/$ARGUMENTS/$ARGUMENTS.tsx` with exported Props interface
- [ ] Every prop has a JSDoc comment
- [ ] Fixtures at `fixtures/$ARGUMENTS.fixtures.ts` with BASE + fx() pattern
- [ ] Demo at `demos/$ARGUMENTS.demo.tsx` with PreviewLabConfig
- [ ] Entry in `lib/registry.ts` REGISTRY array
- [ ] Entry in `registry.json` with all dependencies listed
- [ ] README.md updated with component table row and install commands
- [ ] `npx tsc --noEmit` passes
- [ ] `pnpm run build:registry` passes
- [ ] No `any` types
- [ ] No hardcoded demo data in the component
- [ ] All cross-registry imports use `@/registry/new-york/...` paths
