import type { TerminalChromeProps } from "@/registry/new-york/terminal-chrome/terminal-chrome";

/** Terminal chrome fixtures use a simplified shape since children is ReactNode */
export interface TerminalChromeFixture {
  title?: string;
  hasRightSlot: boolean;
  bodyLines: Array<{ text: string; color?: "green" | "zinc" | "cyan" | "muted" }>;
}

const BASE: TerminalChromeFixture = {
  title: "~/projects/ui-registry",
  hasRightSlot: false,
  bodyLines: [
    { text: "$ pnpm build", color: "green" },
    { text: "Building registry...", color: "muted" },
    { text: "Done in 1.2s", color: "green" },
  ],
};

const fx = (overrides: Partial<TerminalChromeFixture>): TerminalChromeFixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, TerminalChromeFixture> = {
  "With output": BASE,
  "With status badge": fx({
    title: "dev-server",
    hasRightSlot: true,
    bodyLines: [
      { text: "Local: http://localhost:3000", color: "cyan" },
      { text: "Ready in 280ms", color: "green" },
    ],
  }),
  "Empty terminal": fx({
    title: "bash",
    bodyLines: [],
  }),
};
