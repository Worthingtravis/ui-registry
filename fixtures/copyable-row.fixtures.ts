/** Fixture shape for CopyableRow demos — describes a list of rows to render */
export interface CopyableRowFixture {
  label: string;
  rows: Array<{
    text: string;
    prefix?: string;
    prefixColor?: string;
    display: string;
    displayColor?: string;
  }>;
}

const BASE: CopyableRowFixture = {
  label: "Terminal commands",
  rows: [
    { text: "git status", prefix: "$", prefixColor: "text-term-success", display: "git status" },
    { text: "pnpm install", prefix: "$", prefixColor: "text-term-success", display: "pnpm install" },
    { text: "npm run dev", prefix: "$", prefixColor: "text-term-success", display: "npm run dev" },
  ],
};

const fx = (overrides: Partial<CopyableRowFixture>): CopyableRowFixture => ({
  ...BASE,
  ...overrides,
});

export const ALL_FIXTURES: Record<string, CopyableRowFixture> = {
  "Commands": BASE,
  "Key-Value pairs": fx({
    label: "Configuration",
    rows: [
      { text: "sk-proj-abc123...", prefix: "API Key:", prefixColor: "text-term-text-muted", display: "sk-proj-abc123...", displayColor: "text-term-warning" },
      { text: "https://api.example.com/v2", prefix: "Endpoint:", prefixColor: "text-term-text-muted", display: "https://api.example.com/v2", displayColor: "text-term-accent" },
    ],
  }),
  "Single row": fx({
    label: "Single item",
    rows: [
      { text: "npm install", prefix: "$", prefixColor: "text-term-success", display: "npm install" },
    ],
  }),
  "File paths": fx({
    label: "Project files",
    rows: [
      { text: "src/index.ts", prefix: "entry:", prefixColor: "text-term-text-muted", display: "src/index.ts", displayColor: "text-term-accent" },
      { text: "src/utils.ts", prefix: "utils:", prefixColor: "text-term-text-muted", display: "src/utils.ts", displayColor: "text-term-accent" },
      { text: "tsconfig.json", prefix: "config:", prefixColor: "text-term-text-muted", display: "tsconfig.json", displayColor: "text-term-accent" },
      { text: "package.json", prefix: "pkg:", prefixColor: "text-term-text-muted", display: "package.json", displayColor: "text-term-accent" },
    ],
  }),
  "Output lines": fx({
    label: "Build output",
    rows: [
      { text: "✓ Compiled 42 files", display: "✓ Compiled 42 files", displayColor: "text-term-success" },
      { text: "✓ No type errors", display: "✓ No type errors", displayColor: "text-term-success" },
      { text: "⚠ 2 unused imports", display: "⚠ 2 unused imports", displayColor: "text-term-warning" },
    ],
  }),
};
