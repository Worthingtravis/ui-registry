import type { GroupedSidebarProps } from "@/registry/new-york/grouped-sidebar/grouped-sidebar";

export type GroupedSidebarFixture = Omit<GroupedSidebarProps, "className" | "onNavigate" | "renderLink">;
type Fixture = GroupedSidebarFixture;

const BASE: Fixture = {
  groups: [
    {
      title: "Getting Started",
      items: [
        { id: "intro", label: "Introduction", href: "/" },
        { id: "install", label: "Installation", href: "/install" },
      ],
    },
    {
      title: "Components",
      items: [
        { id: "button", label: "Button", href: "/button" },
        { id: "input", label: "Input", href: "/input" },
        { id: "select", label: "Select", href: "/select" },
        { id: "dialog", label: "Dialog", href: "/dialog" },
      ],
    },
    {
      title: "Hooks",
      items: [
        { id: "use-copy", label: "useCopy", href: "/use-copy" },
        { id: "use-media", label: "useMediaQuery", href: "/use-media" },
      ],
    },
  ],
  activeId: "button",
  width: 220,
  mobileBreakpoint: "none",
};

const fx = (overrides: Partial<Fixture> = {}): Fixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, Fixture> = {
  "Default": BASE,

  "No Active Item": fx({
    activeId: undefined,
  }),

  "Many Groups": fx({
    groups: [
      {
        title: "Terminal",
        items: [
          { id: "chrome", label: "Terminal Chrome", href: "/chrome" },
          { id: "tool-call", label: "Tool Call Block", href: "/tool-call" },
          { id: "mini-demo", label: "Mini Terminal Demo", href: "/mini-demo" },
        ],
      },
      {
        title: "Profile & Avatar",
        items: [
          { id: "avatar", label: "Avatar Picker", href: "/avatar" },
          { id: "profile", label: "Profile Editor", href: "/profile" },
        ],
      },
      {
        title: "Progression",
        items: [
          { id: "step-flow", label: "Step Flow", href: "/step-flow" },
          { id: "flow-diagram", label: "Flow Diagram", href: "/flow-diagram" },
        ],
      },
      {
        title: "Animation",
        items: [
          { id: "typing", label: "Typing Text", href: "/typing" },
          { id: "scroll", label: "Scroll Prompt", href: "/scroll" },
        ],
      },
      {
        title: "Interactive",
        items: [
          { id: "copyable", label: "Copyable Row", href: "/copyable" },
        ],
      },
    ],
    activeId: "flow-diagram",
  }),

  "Narrow (180px)": fx({
    width: 180,
  }),

  "Wide (280px)": fx({
    width: 280,
  }),

  "Single Group": fx({
    groups: [
      {
        title: "Pages",
        items: [
          { id: "home", label: "Home", href: "/" },
          { id: "about", label: "About", href: "/about" },
          { id: "blog", label: "Blog", href: "/blog" },
          { id: "contact", label: "Contact", href: "/contact" },
        ],
      },
    ],
    activeId: "about",
  }),
};
