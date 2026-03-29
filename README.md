# @worthingtravis/ui-registry

Reusable UI components for [shadcn/ui](https://ui.shadcn.com). Browse live previews at [laughingwhales.com/ui](https://laughingwhales.com/ui).

## Components

### Terminal

| Name | Type | Description |
|---|---|---|
| `terminal-chrome` | `registry:component` | macOS-style terminal window shell with traffic light buttons |
| `tool-call-block` | `registry:component` | MCP tool call display with name, arguments, and result |
| `mini-terminal-demo` | `registry:block` | Compact animated terminal card with copy-to-clipboard |
| `terminal-demo` | `registry:block` | Full animated terminal session with typing, tool calls, and more |

### Profile & Avatar

| Name | Type | Description |
|---|---|---|
| `avatar-picker` | `registry:component` | DiceBear generated avatars with style pills, custom seed, and file upload |
| `profile-editor` | `registry:component` | Profile editor card with avatar, status, editable fields, and save/cancel |

### Progression

| Name | Type | Description |
|---|---|---|
| `onboarding-checklist` | `registry:component` | Linear onboarding checklist with progress bar and step locking |
| `step-flow` | `registry:component` | Interactive multi-step flow visualizer with navigation |
| `flow-diagram` | `registry:component` | Animated architecture diagram with bezier edges, particles, and auto-layout |

### Animation

| Name | Type | Description |
|---|---|---|
| `typing-text` | `registry:component` | CSS-only typewriter animation with blinking cursor |
| `scroll-prompt` | `registry:component` | Animated scroll-down prompt for out-of-view targets |

### Navigation

| Name | Type | Description |
|---|---|---|
| `section-heading` | `registry:component` | Heading with auto-generated anchor link and click-to-copy URL |
| `component-grid` | `registry:component` | Tic-tac-toe grid of component cards with scaled live previews |
| `grouped-sidebar` | `registry:component` | Grouped sidebar navigation with responsive mobile slide-over |

### Interactive

| Name | Type | Description |
|---|---|---|
| `feature-pill` | `registry:component` | Rounded pill badge for feature labels with variant colors |
| `info-tip` | `registry:component` | Info icon with tooltip on hover and tap toggle on mobile |
| `collapsible-group` | `registry:component` | Accordion-style collapsible section with smooth grid-row animation |
| `copyable-row` | `registry:component` | Click-to-copy wrapper with hover highlight |

### Shared

| Name | Type | Description |
|---|---|---|
| `use-copy` | `registry:hook` | Clipboard copy hook with copied-state feedback |
| `terminal-lib` | `registry:lib` | Shared terminal timing and color utilities |

## Install

### Direct URL (no config needed)

```bash
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/terminal-demo.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/terminal-chrome.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/tool-call-block.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/avatar-picker.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/profile-editor.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/onboarding-checklist.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/step-flow.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/flow-diagram.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/typing-text.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/scroll-prompt.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/section-heading.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/component-grid.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/grouped-sidebar.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/feature-pill.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/info-tip.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/collapsible-group.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/copyable-row.json
```

### With namespace (one-time setup)

Add to your `components.json`:

```json
{
  "registries": {
    "@worthingtravis": {
      "url": "https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r"
    }
  }
}
```

Then install by name:

```bash
npx shadcn@latest add @worthingtravis/terminal-demo
npx shadcn@latest add @worthingtravis/flow-diagram
npx shadcn@latest add @worthingtravis/avatar-picker
npx shadcn@latest add @worthingtravis/step-flow
# etc.
```

## Usage

```tsx
"use client";

import { FlowDiagram } from "@/registry/new-york/flow-diagram/flow-diagram";

export default function Page() {
  return (
    <FlowDiagram
      nodes={[
        { id: "client", label: "Client", description: "Browser" },
        { id: "api", label: "API", description: "REST endpoints", live: true },
        { id: "db", label: "Database", description: "PostgreSQL" },
      ]}
      edges={[
        { id: "c-a", from: "client", to: "api", label: "requests" },
        { id: "a-d", from: "api", to: "db", label: "queries" },
      ]}
    />
  );
}
```

## Development

```bash
pnpm install
pnpm build          # registry + next build
pnpm build:registry # registry JSON only
pnpm dev            # local dev server
```

## License

MIT
