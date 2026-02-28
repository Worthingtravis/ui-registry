# @worthingtravis/ui-registry

Animated terminal UI components for [shadcn/ui](https://ui.shadcn.com). Built for the [Twitch MCP](https://github.com/Worthingtravis/twitch-mcp) project.

## Components

| Name | Type | Description |
|---|---|---|
| `terminal-chrome` | `registry:ui` | macOS-style terminal window shell with traffic light buttons |
| `typing-text` | `registry:ui` | CSS-only typewriter animation with blinking cursor |
| `tool-call-block` | `registry:ui` | MCP tool call display with name, arguments, and result |
| `terminal-demo` | `registry:block` | Full animated terminal session with typing, tool calls, and more |

## Install

### Direct URL (no config needed)

```bash
# Full demo block (auto-installs dependencies)
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/terminal-demo.json

# Individual primitives
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/terminal-chrome.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/typing-text.json
npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/tool-call-block.json
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
```

## Usage

```tsx
"use client";

import { TerminalDemo } from "@/components/terminal-demo";

export default function Page() {
  return <TerminalDemo mcpEndpoint="https://your-app.vercel.app/api/mcp" />;
}
```

### Custom script

```tsx
"use client";

import { TerminalDemo, buildScript, type TerminalEntry } from "@/components/terminal-demo";

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
pnpm build    # generates public/r/*.json
```

## License

MIT
