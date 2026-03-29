import type { ComponentGridProps } from "@/registry/new-york/component-grid/component-grid";

export type ComponentGridFixture = Omit<ComponentGridProps, "className" | "renderLink">;
type Fixture = ComponentGridFixture;

const PLACEHOLDER_ITEMS = [
  { id: "1", title: "Button", description: "Interactive button with variants and sizes.", href: "#" },
  { id: "2", title: "Input", description: "Text input with validation states.", href: "#" },
  { id: "3", title: "Select", description: "Dropdown select with search and multi-select.", href: "#" },
  { id: "4", title: "Dialog", description: "Modal dialog with header, body, and footer.", href: "#" },
  { id: "5", title: "Card", description: "Content container with header and actions.", href: "#" },
  { id: "6", title: "Avatar", description: "User avatar with fallback initials.", href: "#" },
];

const BASE: Fixture = {
  items: PLACEHOLDER_ITEMS,
  columns: 3,
  previewScale: 0.6,
  previewMinHeight: 120,
  previewMaxHeight: 200,
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "3 Columns (Default)": BASE,

  "2 Columns": fx({
    columns: 2,
    items: PLACEHOLDER_ITEMS.slice(0, 4),
  }),

  "4 Columns": fx({
    columns: 4,
    items: [
      ...PLACEHOLDER_ITEMS,
      { id: "7", title: "Tabs", description: "Tabbed content with keyboard navigation.", href: "#" },
      { id: "8", title: "Toast", description: "Notification toasts with auto-dismiss.", href: "#" },
    ],
  }),

  "Few Items": fx({
    items: PLACEHOLDER_ITEMS.slice(0, 2),
    columns: 2,
  }),

  "No Descriptions": fx({
    items: PLACEHOLDER_ITEMS.map(({ description, ...rest }) => rest),
  }),
};
