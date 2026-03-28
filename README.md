# @worthingtravis/ui-registry

Animated terminal UI components for [shadcn/ui](https://ui.shadcn.com). Built for the [Twitch MCP](https://github.com/Worthingtravis/twitch-mcp) project.

## Components

| Name | Type | Description |
|---|---|---|
| `terminal-chrome` | `registry:component` | macOS-style terminal window shell with traffic light buttons |
| `typing-text` | `registry:component` | CSS-only typewriter animation with blinking cursor |
| `tool-call-block` | `registry:component` | MCP tool call display with name, arguments, and result |
| `tool-call-block-inline` | `registry:component` | Inline single-line variant of ToolCallBlock |
| `copyable-row` | `registry:component` | Click-to-copy wrapper with hover highlight |
| `scroll-prompt` | `registry:component` | Animated scroll-down prompt for out-of-view targets |
| `step-flow` | `registry:component` | Interactive multi-step flow visualizer with navigation |
| `step-flow-vertical` | `registry:component` | Vertical timeline variant of StepFlow |
| `mini-terminal-demo` | `registry:block` | Compact animated terminal card with copy-to-clipboard |
| `terminal-demo` | `registry:block` | Full animated terminal session with typing, tool calls, and more |

### Shared

| Name | Type | Description |
|---|---|---|
| `use-copy` | `registry:hook` | Clipboard copy hook with copied-state feedback |
| `terminal-lib` | `registry:lib` | Shared terminal timing and color utilities |

## Install

### Direct URL (no config needed)

```bash
# Full demo block (auto-installs dependencies)
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/terminal-demo.json

# Individual primitives
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/terminal-chrome.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/typing-text.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/tool-call-block.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/step-flow.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/copyable-row.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/scroll-prompt.json
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
npx shadcn@latest add @worthingtravis/step-flow
```

## Usage

```tsx
"use client";

import { TerminalDemo } from "@/registry/new-york/terminal-demo/terminal-demo";

export default function Page() {
  return <TerminalDemo mcpEndpoint="https://your-app.vercel.app/api/mcp" />;
}
```

### Custom script

```tsx
"use client";

import { TerminalDemo, type TerminalEntry } from "@/registry/new-york/terminal-demo/terminal-demo";

const myScript: TerminalEntry[] = [
  { kind: "phase", label: "Setup", pauseAfter: 300 },
  { kind: "input", text: "hello world", prompt: "$", typingMs: 800, pauseAfter: 400 },
  { kind: "output", text: "Done!", color: "green", pauseAfter: 0 },
];

export default function Page() {
  return <TerminalDemo script={myScript} />;
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
