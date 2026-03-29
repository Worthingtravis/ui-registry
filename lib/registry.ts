import type { RegistryCategory, RegistryEntry } from "./types";

const BASE_URL = "https://raw.githubusercontent.com/Worthingtravis/ui-registry/main/public/r";

/** Build the install command from a component name. */
export function installCommand(name: string) {
  return `npx shadcn@latest add ${BASE_URL}/${name}.json`;
}

/**
 * Ordered list of sidebar categories.
 * Components are grouped under these headings in the sidebar.
 */
export const CATEGORY_ORDER: RegistryCategory[] = [
  "Terminal",
  "Profile & Avatar",
  "Progression",
  "Animation",
  "Navigation",
  "Interactive",
];

/**
 * Central registry of all preview-able components.
 *
 * To add a new component:
 * 1. Create `registry/new-york/{name}/{name}.tsx` with exported `{Name}Props`
 * 2. Create `fixtures/{name}.fixtures.ts` with typed `ALL_FIXTURES`
 * 3. Create `demos/{name}.demo.tsx` exporting `config`
 * 4. Add an entry here
 */
export const REGISTRY: RegistryEntry[] = [
  // --- Terminal ---
  {
    name: "terminal-chrome",
    description: "macOS-style terminal window shell with traffic light buttons and optional title bar.",
    lab: () => import("@/demos/terminal-chrome.demo"),
    tags: ["terminal", "shell", "chrome"],
    category: "Terminal",
  },
  {
    name: "tool-call-block",
    description: "MCP tool call display with name, arguments, and result.",
    lab: () => import("@/demos/tool-call-block.demo"),
    tags: ["terminal", "mcp", "ai"],
    category: "Terminal",
  },
  {
    name: "mini-terminal-demo",
    description: "Compact animated terminal card with copy-to-clipboard and pin support.",
    lab: () => import("@/demos/mini-terminal-demo.demo"),
    tags: ["terminal", "animation", "demo"],
    category: "Terminal",
  },
  {
    name: "terminal-demo",
    description: "Full animated terminal session with typing, tool calls, thinking indicators, and memory blocks.",
    lab: () => import("@/demos/terminal-demo.demo"),
    tags: ["terminal", "animation", "demo", "ai"],
    category: "Terminal",
  },

  // --- Profile & Avatar ---
  {
    name: "avatar-picker",
    description: "Avatar picker with DiceBear generated avatars, style pills, custom seed, and file upload.",
    lab: () => import("@/demos/avatar-picker.demo"),
    tags: ["avatar", "picker", "dicebear", "upload"],
    category: "Profile & Avatar",
  },
  {
    name: "profile-editor",
    description: "Profile editor card with avatar, status indicator, editable fields, and save/cancel actions.",
    lab: () => import("@/demos/profile-editor.demo"),
    tags: ["profile", "avatar", "editor", "form"],
    category: "Profile & Avatar",
  },

  // --- Progression ---
  {
    name: "step-flow",
    description: "Interactive multi-step flow visualizer with clickable step buttons and navigation.",
    lab: () => import("@/demos/step-flow.demo"),
    tags: ["flow", "stepper", "wizard"],
    category: "Progression",
  },
  {
    name: "flow-diagram",
    description: "Animated architecture flow diagram with bezier-curved edges, flowing particles, and hover highlighting.",
    lab: () => import("@/demos/flow-diagram.demo"),
    tags: ["architecture", "diagram", "flow"],
    category: "Progression",
  },

  // --- Animation ---
  {
    name: "typing-text",
    description: "CSS-only typewriter animation with blinking cursor.",
    lab: () => import("@/demos/typing-text.demo"),
    tags: ["animation", "text", "typewriter"],
    category: "Animation",
  },
  {
    name: "scroll-prompt",
    description: "Animated scroll-down prompt that appears when a target section is out of view.",
    lab: () => import("@/demos/scroll-prompt.demo"),
    tags: ["animation", "scroll", "navigation"],
    category: "Animation",
  },

  {
    name: "section-heading",
    description: "Heading with auto-generated anchor link and click-to-copy URL.",
    lab: () => import("@/demos/section-heading.demo"),
    tags: ["heading", "anchor", "navigation", "documentation"],
    category: "Navigation",
  },

  // --- Navigation ---
  {
    name: "component-grid",
    description: "Tic-tac-toe grid of component cards with scaled live preview thumbnails.",
    lab: () => import("@/demos/component-grid.demo"),
    tags: ["navigation", "layout", "grid", "preview"],
    category: "Navigation",
  },
  {
    name: "grouped-sidebar",
    description: "Grouped sidebar navigation with responsive slide-over for mobile.",
    lab: () => import("@/demos/grouped-sidebar.demo"),
    tags: ["navigation", "sidebar", "responsive", "layout"],
    category: "Navigation",
  },

  // --- Interactive ---
  {
    name: "collapsible-group",
    description: "Accordion-style collapsible section with smooth grid-row animation.",
    lab: () => import("@/demos/collapsible-group.demo"),
    tags: ["accordion", "collapsible", "animation"],
    category: "Interactive",
  },
  {
    name: "copyable-row",
    description: "Click-to-copy wrapper with hover highlight and copy/check icon transition.",
    lab: () => import("@/demos/copyable-row.demo"),
    tags: ["interactive", "clipboard", "copy"],
    category: "Interactive",
  },
];

/** Lookup a registry entry by name. */
export function getEntry(name: string): RegistryEntry | undefined {
  return REGISTRY.find((e) => e.name === name);
}

/** Group registry entries by category, in display order. */
export function groupedRegistry(): { category: RegistryCategory; entries: RegistryEntry[] }[] {
  const groups = new Map<RegistryCategory, RegistryEntry[]>();
  for (const entry of REGISTRY) {
    if (!groups.has(entry.category)) groups.set(entry.category, []);
    groups.get(entry.category)!.push(entry);
  }
  return CATEGORY_ORDER
    .filter((cat) => groups.has(cat))
    .map((cat) => ({ category: cat, entries: groups.get(cat)! }));
}
