import type { RegistryEntry } from "./types";

const BASE_URL = "https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r";

/** Build the install command from a component name. */
export function installCommand(name: string) {
  return `npx shadcn@latest add ${BASE_URL}/${name}.json`;
}

/**
 * Central registry of all preview-able components.
 *
 * To add a new component:
 * 1. Create `registry/{name}.tsx` with exported `{Name}Props`
 * 2. Create `fixtures/{name}.fixtures.ts` with typed `ALL_FIXTURES`
 * 3. Create `demos/{name}.demo.tsx` exporting `config`
 * 4. Add an entry here
 */
export const REGISTRY: RegistryEntry[] = [
  {
    name: "step-flow",
    lab: () => import("@/demos/step-flow.demo"),
    tags: ["interactive", "flow", "stepper", "wizard"],
  },
  {
    name: "terminal-chrome",
    lab: () => import("@/demos/terminal-chrome.demo"),
    tags: ["terminal", "shell", "chrome"],
  },
  {
    name: "typing-text",
    lab: () => import("@/demos/typing-text.demo"),
    tags: ["animation", "text", "typewriter"],
  },
  {
    name: "tool-call-block",
    lab: () => import("@/demos/tool-call-block.demo"),
    tags: ["terminal", "mcp", "ai"],
  },
  {
    name: "copyable-row",
    lab: () => import("@/demos/copyable-row.demo"),
    tags: ["interactive", "clipboard", "copy"],
  },
  {
    name: "scroll-prompt",
    lab: () => import("@/demos/scroll-prompt.demo"),
    tags: ["animation", "scroll", "navigation"],
  },
  {
    name: "mini-terminal-demo",
    lab: () => import("@/demos/mini-terminal-demo.demo"),
    tags: ["terminal", "animation", "demo"],
  },
  {
    name: "terminal-demo",
    lab: () => import("@/demos/terminal-demo.demo"),
    tags: ["terminal", "animation", "demo", "ai"],
  },
];

/** Lookup a registry entry by name. */
export function getEntry(name: string): RegistryEntry | undefined {
  return REGISTRY.find((e) => e.name === name);
}
