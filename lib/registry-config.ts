import type { ComponentType } from "react";

/** Metadata for a registry component preview. */
export interface RegistryEntry {
  /** kebab-case name matching registry.json */
  name: string;
  /** Human-readable title */
  title: string;
  /** One-line description */
  description: string;
  /** shadcn install command */
  installCommand: string;
  /** Dynamic import for the demo component */
  demo: () => Promise<{ default: ComponentType }>;
  /** Tags for filtering */
  tags: string[];
}

/**
 * Central registry of all preview-able components.
 *
 * To add a new component:
 * 1. Create `demos/{name}.tsx` with a default export
 * 2. Add an entry here
 * That's it — the dynamic route and index page pick it up automatically.
 */
export const REGISTRY: RegistryEntry[] = [
  {
    name: "step-flow",
    title: "Step Flow",
    description: "Interactive multi-step flow visualizer with clickable steps, arrow connectors, and back/next navigation.",
    installCommand: "npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/step-flow.json",
    demo: () => import("@/demos/step-flow"),
    tags: ["interactive", "flow", "stepper", "wizard"],
  },
  {
    name: "terminal-chrome",
    title: "Terminal Chrome",
    description: "macOS-style terminal window shell with traffic light buttons and optional title bar.",
    installCommand: "npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/terminal-chrome.json",
    demo: () => import("@/demos/terminal-chrome"),
    tags: ["terminal", "shell", "chrome"],
  },
  {
    name: "typing-text",
    title: "Typing Text",
    description: "CSS-only typewriter animation with blinking cursor.",
    installCommand: "npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/typing-text.json",
    demo: () => import("@/demos/typing-text"),
    tags: ["animation", "text", "typewriter"],
  },
  {
    name: "tool-call-block",
    title: "Tool Call Block",
    description: "MCP tool call display with name, arguments, and result.",
    installCommand: "npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/tool-call-block.json",
    demo: () => import("@/demos/tool-call-block"),
    tags: ["terminal", "mcp", "ai"],
  },
  {
    name: "copyable-row",
    title: "Copyable Row",
    description: "Click-to-copy wrapper with hover highlight and copy/check icon transition.",
    installCommand: "npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/copyable-row.json",
    demo: () => import("@/demos/copyable-row"),
    tags: ["interactive", "clipboard", "copy"],
  },
  {
    name: "scroll-prompt",
    title: "Scroll Prompt",
    description: "Animated scroll-down prompt that appears when a target section is out of view.",
    installCommand: "npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/scroll-prompt.json",
    demo: () => import("@/demos/scroll-prompt"),
    tags: ["animation", "scroll", "navigation"],
  },
  {
    name: "mini-terminal-demo",
    title: "Mini Terminal Demo",
    description: "Compact animated terminal card with copy-to-clipboard, pin support, and stagger delay.",
    installCommand: "npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/mini-terminal-demo.json",
    demo: () => import("@/demos/mini-terminal-demo"),
    tags: ["terminal", "animation", "demo"],
  },
  {
    name: "terminal-demo",
    title: "Terminal Demo",
    description: "Full animated terminal session with typing, tool calls, thinking indicators, memory blocks, and copyable rows.",
    installCommand: "npx shadcn@latest add https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r/terminal-demo.json",
    demo: () => import("@/demos/terminal-demo"),
    tags: ["terminal", "animation", "demo", "ai"],
  },
];

/** Lookup a registry entry by name. */
export function getEntry(name: string): RegistryEntry | undefined {
  return REGISTRY.find((e) => e.name === name);
}
