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
 * 1. Create `registry/{name}.tsx` with exported `{Name}Props`
 * 2. Create `fixtures/{name}.fixtures.ts` with typed `ALL_FIXTURES`
 * 3. Create `demos/{name}.demo.tsx` exporting `config`
 * 4. Add an entry here
 */
export const REGISTRY: RegistryEntry[] = [
  // --- Primitives (no internal registry deps) ---
  {
    name: "terminal-chrome",
    lab: () => import("@/demos/terminal-chrome.demo"),
    tags: ["terminal", "shell", "chrome", "primitive"],
  },
  {
    name: "typing-text",
    lab: () => import("@/demos/typing-text.demo"),
    tags: ["animation", "text", "typewriter", "primitive"],
  },
  {
    name: "tool-call-block",
    lab: () => import("@/demos/tool-call-block.demo"),
    tags: ["terminal", "mcp", "ai", "primitive"],
  },
  {
    name: "copyable-row",
    lab: () => import("@/demos/copyable-row.demo"),
    tags: ["interactive", "clipboard", "copy", "primitive"],
  },
  {
    name: "scroll-prompt",
    lab: () => import("@/demos/scroll-prompt.demo"),
    tags: ["animation", "scroll", "navigation", "primitive"],
  },
  {
    name: "step-flow",
    lab: () => import("@/demos/step-flow.demo"),
    tags: ["interactive", "flow", "stepper", "wizard", "primitive"],
  },

  // --- Compositions (built from primitives above) ---
  {
    name: "mini-terminal-demo",
    lab: () => import("@/demos/mini-terminal-demo.demo"),
    tags: ["terminal", "animation", "demo", "composed"],
  },
  {
    name: "terminal-demo",
    lab: () => import("@/demos/terminal-demo.demo"),
    tags: ["terminal", "animation", "demo", "ai", "composed"],
  },
];

/** Lookup a registry entry by name. */
export function getEntry(name: string): RegistryEntry | undefined {
  return REGISTRY.find((e) => e.name === name);
}
