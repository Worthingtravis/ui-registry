import type { RegistryEntry } from "./types";

const BASE_URL = "https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r";

/** Build the install command from a component name. */
export function installCommand(name: string) {
  return `npx shadcn@latest add ${BASE_URL}/${name}.json`;
}

/**
 * Central registry of all preview-able components.
 *
 * Ordered by dependency: primitives first, then compositions.
 *
 * To add a new component:
 * 1. Create `registry/new-york/{name}/{name}.tsx` with exported `{Name}Props`
 * 2. Create `fixtures/{name}.fixtures.ts` with typed `ALL_FIXTURES`
 * 3. Create `demos/{name}.demo.tsx` exporting `config`
 * 4. Add an entry here
 */
export const REGISTRY: RegistryEntry[] = [
  // --- Primitives (no internal registry deps) ---
  {
    name: "terminal-chrome",
    description: "macOS-style terminal window shell with traffic light buttons and optional title bar.",
    lab: () => import("@/demos/terminal-chrome.demo"),
    tags: ["terminal", "shell", "chrome", "primitive"],
  },
  {
    name: "typing-text",
    description: "CSS-only typewriter animation with blinking cursor.",
    lab: () => import("@/demos/typing-text.demo"),
    tags: ["animation", "text", "typewriter", "primitive"],
  },
  {
    name: "tool-call-block",
    description: "MCP tool call display with name, arguments, and result.",
    lab: () => import("@/demos/tool-call-block.demo"),
    tags: ["terminal", "mcp", "ai", "primitive"],
  },
  {
    name: "copyable-row",
    description: "Click-to-copy wrapper with hover highlight and copy/check icon transition.",
    lab: () => import("@/demos/copyable-row.demo"),
    tags: ["interactive", "clipboard", "copy", "primitive"],
  },
  {
    name: "scroll-prompt",
    description: "Animated scroll-down prompt that appears when a target section is out of view.",
    lab: () => import("@/demos/scroll-prompt.demo"),
    tags: ["animation", "scroll", "navigation", "primitive"],
  },
  {
    name: "step-flow",
    description: "Interactive multi-step flow visualizer with clickable step buttons and navigation.",
    lab: () => import("@/demos/step-flow.demo"),
    tags: ["interactive", "flow", "stepper", "wizard", "primitive"],
  },

  {
    name: "flow-diagram",
    description: "Animated architecture flow diagram with bezier-curved edges, flowing particles, and hover highlighting.",
    lab: () => import("@/demos/flow-diagram.demo"),
    tags: ["architecture", "diagram", "flow", "animation", "interactive", "primitive"],
  },
  {
    name: "avatar-picker",
    description: "Avatar picker with DiceBear generated avatars, style pills, custom seed, and file upload.",
    lab: () => import("@/demos/avatar-picker.demo"),
    tags: ["avatar", "picker", "dicebear", "upload", "interactive", "primitive"],
  },
  {
    name: "profile-editor",
    description: "Profile editor card with avatar, status indicator, editable fields, and save/cancel actions.",
    lab: () => import("@/demos/profile-editor.demo"),
    tags: ["profile", "avatar", "editor", "form", "interactive", "primitive"],
  },

  // --- Compositions (built from primitives above) ---
  {
    name: "mini-terminal-demo",
    description: "Compact animated terminal card with copy-to-clipboard and pin support.",
    lab: () => import("@/demos/mini-terminal-demo.demo"),
    tags: ["terminal", "animation", "demo", "composed"],
  },
  {
    name: "terminal-demo",
    description: "Full animated terminal session with typing, tool calls, thinking indicators, and memory blocks.",
    lab: () => import("@/demos/terminal-demo.demo"),
    tags: ["terminal", "animation", "demo", "ai", "composed"],
  },
];

/** Lookup a registry entry by name. */
export function getEntry(name: string): RegistryEntry | undefined {
  return REGISTRY.find((e) => e.name === name);
}
