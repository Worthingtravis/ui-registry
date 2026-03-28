# UI Registry → Shadcn ExperimentLab Clone

You are transforming `/mnt/ssd/development/ui-registry` into a production-grade shadcn component registry that follows the **ExperimentLab** pattern: modules, fixtures, variants — with strict types, maximum DRY, and inspectable tabbed code.

## The Vision

This is NOT a generic component gallery. It's a **shadcn clone** where every component is:
1. **Installable** via `npx shadcn@latest add`
2. **Previewable** with multiple fixtures (data states) and variants (visual implementations)
3. **Inspectable** with tabbed code view showing source, usage, fixtures, and props
4. Strictly typed end-to-end — no `any`, no loose objects, no inline data

## Architecture Target

```
registry/             -> Pure components (what gets installed)
  {name}.tsx          -> Single source of truth, strict props interface

lib/
  types.ts            -> Shared types (RegistryEntry, Fixture, Variant, etc.)
  registry.ts         -> Central registry with typed entries
  utils.ts            -> cn() and shared helpers only

fixtures/
  {name}.fixtures.ts  -> Typed fixture data per component (ALL_FIXTURES export)

demos/
  {name}.demo.tsx     -> Demo config: maps fixtures to component, defines variants

components/
  preview-lab.tsx     -> The ExperimentLab harness (fixture cycling, variant tabs, code tabs)
  ui/                 -> shadcn base components
```

## ExperimentLab Pattern (from Sacred v3)

The core pattern has three concepts:

### 1. Fixtures (Data States)
Typed mock data representing every meaningful state of a component. Each fixture file exports:
- A `BASE` fixture with sensible defaults
- Named fixtures for specific states (empty, loading, error, full, edge cases)
- An `ALL_FIXTURES` record: `Record<string, ComponentProps>`
- A fixture creator function for DRY overrides: `const fx = (overrides: Partial<Props>) => ({...BASE, ...overrides})`

### 2. Variants (Visual Implementations)
Multiple visual presentations of the same data contract. Same props interface, different rendering.
- Original component + 0-N variant components
- Each variant accepts the EXACT same props type
- Variants are registered with name + description
- Navigation: Left/Right switches variants, Up/Down switches fixtures

### 3. Render Harness (PreviewLab)
The container that wires fixtures + variants together:
- Fixture selector (keyboard navigable: arrow keys)
- Variant selector tabs
- Active preview panel
- Code inspection tabs: Preview | Source | Fixtures | Props
- All-fixtures matrix (shows all states at once)
- Install command with copy button

## Strict Rules

### Types
- Every component has an exported `{Name}Props` interface
- Every fixture file imports and uses the component's props interface
- No `Record<string, unknown>` or `any` — concrete types everywhere
- PreviewLab generics: `PreviewLab<T>` where T is the fixture shape
- Use discriminated unions for entry types (already done well in terminal-demo)

### DRY
- ZERO duplicated fixture data — use the `BASE + override` pattern
- ZERO duplicated UI patterns — extract shared sub-components
- The `computeTimings()` function exists in TWO files (terminal-demo.tsx AND mini-terminal-demo.tsx) — consolidate
- The copy-to-clipboard logic exists in THREE places — extract once
- Color class maps are duplicated — centralize
- The CodeBlock/CopyButton in preview-lab should be reusable

### Code Organization
- One concern per file, one export per module where possible
- Fixture files are pure data — no JSX, no React imports
- Demo files are config — they wire fixtures to components, define variant lists
- Registry components are pure presentation — no hardcoded demo data

## Iteration Checklist (work through these in order)

### Phase 1: Type Foundation
- Create `lib/types.ts` with all shared types (Fixture, Variant, RegistryEntry, PreviewLabConfig)
- Make PreviewLab generic: `PreviewLab<TFixture>`
- Export strict `{Name}Props` from every registry component
- Ensure every prop has a purpose — remove unused props, tighten optional vs required

### Phase 2: Fixture Extraction
- Create `fixtures/` directory
- Extract inline demo data into typed fixture files with BASE + override pattern
- Each fixture file: `{name}.fixtures.ts` with `ALL_FIXTURES` export
- Fixtures are pure data — no JSX, no React, just typed objects

### Phase 3: DRY Consolidation
- Merge duplicated `computeTimings()` into a shared util
- Extract copy-to-clipboard into a shared hook `useCopyToClipboard`
- Centralize color class maps
- Extract shared sub-components (CodeBlock, CopyButton, etc.)
- Audit every file for repeated patterns and consolidate

### Phase 4: Variant System
- Define Variant type: `{ name: string; component: ComponentType<T>; description?: string }`
- Add variant support to PreviewLab (tab row for switching between visual implementations)
- Where applicable, create at least one alternate variant per component
- Keyboard navigation: Left/Right = variants, Up/Down = fixtures

### Phase 5: Inspectable Code Tabs
- Add tabbed view to PreviewLab: Preview | Code | Fixtures | Props
- Code tab: shows the component source (can use raw string or dynamic import)
- Fixtures tab: shows the fixture data for the active state
- Props tab: shows the TypeScript interface (prop name, type, required/optional, description)
- Each tab should be independently scrollable with syntax-appropriate formatting

### Phase 6: Polish & Validate
- `npm run build:next` passes with zero errors
- Every registry component renders correctly in all fixtures
- Keyboard navigation works (arrows for fixtures/variants)
- No `any` types anywhere
- No duplicated logic anywhere
- Mobile responsive

## Current State

8 registry components exist: step-flow, terminal-chrome, typing-text, tool-call-block, copyable-row, scroll-prompt, mini-terminal-demo, terminal-demo.

The PreviewLab exists but is flat (no fixtures/variants pattern, no generic typing, no code inspection tabs). Demos are inline JSX wrappers, not fixture-driven.

## What Success Looks Like

When done, a contributor adds a new component by:
1. Creating `registry/my-thing.tsx` with exported `MyThingProps` interface
2. Creating `fixtures/my-thing.fixtures.ts` with typed `ALL_FIXTURES`
3. Creating `demos/my-thing.demo.tsx` that maps fixtures to component
4. Adding one line to `lib/registry.ts`

That's it. PreviewLab handles the rest: fixture cycling, variant tabs, code inspection, install commands. Zero boilerplate, zero guessing.

## Important

- Run `npm run build:next` (NOT `npm run build`) after changes to verify — the full build includes shadcn registry build which may fail on missing files
- Commit after each completed phase
- Keep the dark theme consistent (zinc-900 backgrounds, muted-foreground text)
- Preserve all existing component functionality — this is a structural refactor, not a rewrite

Output `<promise>REGISTRY TRANSFORMED</promise>` when all 6 phases are complete, build passes, and every component renders with the new fixture/variant/inspection system.
